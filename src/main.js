// Constants
const GRID_SIZE = 20;
const GAME_SPEED = 100;
const DIRECTIONS = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 }
};

import { ScoreManager } from './ScoreManager.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.scoreManager = new ScoreManager();
        this.score = 0;
        this.highScore = 0;
        this.setCanvasSize();
        this.reset();
        
        // Event Listeners
        window.addEventListener('keydown', this.handleKeyPress.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    reset() {
        this.snake = [{ x: 5, y: 5 }];
        this.food = this.generateFood();
        this.direction = DIRECTIONS.ArrowRight;
        this.score = 0;
        this.gameOver = false;
        this.lastRenderTime = 0;
        this.touchStartX = null;
        this.touchStartY = null;
        this.highScore = this.scoreManager.getHighScore();
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = `Score: ${this.score} | High Score: ${this.highScore}`;
    }

    setCanvasSize() {
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = window.innerHeight * 0.6;
        
        this.canvas.width = Math.floor(containerWidth / GRID_SIZE) * GRID_SIZE;
        this.canvas.height = Math.floor(containerHeight / GRID_SIZE) * GRID_SIZE;
        
        this.gridWidth = this.canvas.width / GRID_SIZE;
        this.gridHeight = this.canvas.height / GRID_SIZE;
    }



    generateFood() {
        const food = {
            x: Math.floor(Math.random() * this.gridWidth),
            y: Math.floor(Math.random() * this.gridHeight)
        };

        // Ensure food doesn't spawn on snake
        return this.snake.some(segment => segment.x === food.x && segment.y === food.y)
            ? this.generateFood()
            : food;
    }

    update() {
        if (this.gameOver) return;

        // Move snake
        const newHead = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // Check for collisions before moving
        if (this.checkCollision(newHead)) {
            this.gameOver = true;
            if (this.score > this.highScore) {
                this.scoreManager.updateHighScore(this.score);
                this.highScore = this.scoreManager.getHighScore();
            }
            this.updateScoreDisplay();
            return;
        }

        // Check if food is eaten
        const foodEaten = newHead.x === this.food.x && newHead.y === this.food.y;

        // Move snake
        this.snake.unshift(newHead);

        // Handle food eating
        if (foodEaten) {
            this.score += 10;
            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.scoreManager.updateHighScore(this.score);
            }
            this.updateScoreDisplay();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    checkCollision(position) {
        const collision = (
            position.x < 0 ||
            position.x >= this.gridWidth ||
            position.y < 0 ||
            position.y >= this.gridHeight ||
            this.snake.some(segment => segment.x === position.x && segment.y === position.y)
        );
        if (collision) {
            this.gameOver = true;
            if (this.score > this.highScore) {
                this.scoreManager.updateHighScore(this.score);
                this.highScore = this.scoreManager.getHighScore();
            }
            this.updateScoreDisplay();
        }
        return collision;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head - filled grey with border
                this.ctx.fillStyle = '#808080';
                this.ctx.fillRect(
                    segment.x * GRID_SIZE,
                    segment.y * GRID_SIZE,
                    GRID_SIZE - 1,
                    GRID_SIZE - 1
                );
                this.ctx.strokeStyle = '#000000';
                this.ctx.strokeRect(
                    segment.x * GRID_SIZE,
                    segment.y * GRID_SIZE,
                    GRID_SIZE - 1,
                    GRID_SIZE - 1
                );
            } else {
                // Snake body - only borders
                this.ctx.strokeStyle = '#000000';
                this.ctx.strokeRect(
                    segment.x * GRID_SIZE,
                    segment.y * GRID_SIZE,
                    GRID_SIZE - 1,
                    GRID_SIZE - 1
                );
            }
        });

        // Draw food - filled black
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(
            this.food.x * GRID_SIZE,
            this.food.y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
        );

        // Draw game over message
        if (this.gameOver) {
            // Draw semi-transparent black overlay
            this.ctx.globalAlpha = 0.75;
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1.0;
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
            
            const restartButton = document.getElementById('restart-button');
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                restartButton.style.display = 'block';
            } else {
                this.ctx.font = '24px Arial';
                this.ctx.fillText(
                    'Press Space to Restart',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 40
                );
            }
        } else {
            const restartButton = document.getElementById('restart-button');
            restartButton.style.display = 'none';
        }
    }

    handleKeyPress(event) {
        if (this.gameOver && event.code === 'Space') {
            this.reset();
            return;
        }

        const newDirection = DIRECTIONS[event.key];
        if (newDirection && !this.isOppositeDirection(newDirection)) {
            this.direction = newDirection;
        }
    }

    isOppositeDirection(newDir) {
        return (
            this.direction.x === -newDir.x && this.direction.y === -newDir.y
        );
    }

    handleResize() {
        this.setCanvasSize();
    }

    handleTouchStart(event) {
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        event.preventDefault();
    }

    handleTouchMove(event) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.direction = deltaX > 0 ? DIRECTIONS.ArrowRight : DIRECTIONS.ArrowLeft;
        } else {
            this.direction = deltaY > 0 ? DIRECTIONS.ArrowDown : DIRECTIONS.ArrowUp;
        }

        this.touchStartX = null;
        this.touchStartY = null;
        event.preventDefault();
    }

    gameLoop(currentTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));

        const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
        if (secondsSinceLastRender < GAME_SPEED / 1000) return;

        this.lastRenderTime = currentTime;
        this.update();
        this.draw();
    }

    start() {
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
}

export { Game };

if (typeof window !== 'undefined') {
    // Start the game only in browser environment
    document.addEventListener('DOMContentLoaded', () => {
        window.game = new Game();
        window.game.start();

        // Add click event listener for restart button
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', () => window.game.reset());
    });
}