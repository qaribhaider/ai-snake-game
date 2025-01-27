describe('Snake Game', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#game-canvas').should('be.visible')
  })

  it('should initialize with correct visual elements', () => {
    cy.get('#score').should('contain', 'Score: 0 | High Score: 0')
    cy.get('#game-canvas').should('have.attr', 'width').and('not.eq', '0')
    cy.get('#game-canvas').should('have.attr', 'height').and('not.eq', '0')
    cy.get('#restart-button').should('not.be.visible')
  })

  it('should update score when snake eats food', () => {
    // Wait for game to start and initial render
    cy.wait(1000)
    
    // Store initial food position
    let initialFoodPos
    cy.window().then((win) => {
      initialFoodPos = win.game.food
    })

    // Move snake to food
    cy.window().then((win) => {
      const moveToFood = () => {
        if (!win.game || win.game.gameOver) return
        
        const head = win.game.snake[0]
        const food = win.game.food
        
        // Navigate to food
        if (head.x < food.x) win.game.direction = { x: 1, y: 0 }
        else if (head.x > food.x) win.game.direction = { x: -1, y: 0 }
        else if (head.y < food.y) win.game.direction = { x: 0, y: 1 }
        else if (head.y > food.y) win.game.direction = { x: 0, y: -1 }
      }

      // Move every 100ms for 3 seconds max
      const interval = setInterval(moveToFood, 100)
      setTimeout(() => clearInterval(interval), 3000)
    })

    // Verify score increases
    cy.get('#score').should('not.contain', 'Score: 0')
  })

  // Modify game over test
  it('should end game on collision and show appropriate game over screen', () => {
    // Wait for game to initialize
    cy.wait(500);

    cy.window().then((win) => {
      // Force snake to collide with wall by moving it outside the grid
      win.game.snake[0] = { x: win.game.gridWidth + 1, y: 0 };
      win.game.update();
      win.game.draw();

      cy.wait(500);

      // Verify game over state immediately after update
      expect(win.game.gameOver).to.be.true;
    });

    // Test restart functionality based on device type
    cy.window().then((win) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
      
      if (isMobile) {
        cy.get('#restart-button').should('be.visible').click();
      } else {
        cy.get('#restart-button').should('not.be.visible');
        cy.get('body').type(' ');
      }

      // Verify game has restarted
      cy.wait(100);
      cy.get('#score').should('contain', 'Score: 0');
    });
  });

  it('should persist high score', () => {
    // Reset high score before test
    cy.window().then((win) => {
      win.game.scoreManager.resetHighScore();
    });

    // Set a score and trigger game over
    cy.window().then((win) => {
      win.game.score = 10;
      win.game.gameOver = true;
      win.game.update();
      win.game.scoreManager.updateHighScore(win.game.score);
    });

    // Wait for score to be updated
    cy.wait(500);

    // Verify high score was updated
    cy.window().then((win) => {
      expect(win.game.scoreManager.getHighScore()).to.equal(10);
    });

    // Reload page and verify persistence
    cy.reload();
    cy.wait(500);
    cy.window().then((win) => {
      expect(win.game.scoreManager.getHighScore()).to.equal(10);
    });
  });

  it('should handle responsive canvas sizing', () => {
    // Test desktop viewport
    cy.viewport(1024, 768)
    cy.get('#game-canvas').then($canvas => {
      const initialWidth = $canvas[0].width
      cy.viewport(400, 800)
      cy.get('#game-canvas').should($newCanvas => {
        expect($newCanvas[0].width).to.be.lessThan(initialWidth)
      })
    })
  })
})