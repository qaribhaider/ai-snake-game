import { Game } from './main';
import { ScoreManager } from './ScoreManager';

jest.mock('./ScoreManager');

const DIRECTIONS = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

describe('Snake Game', () => {
    let game;
    
    beforeEach(() => {
        // Reset ScoreManager mock
        jest.clearAllMocks();
        ScoreManager.mockImplementation(() => ({
            getHighScore: jest.fn().mockReturnValue(0),
            updateHighScore: jest.fn(),
            resetHighScore: jest.fn()
        }));

        document.body.innerHTML = `
            <div id="score">Score: 0</div>
            <div id="game-container">
                <canvas id="game-canvas"></canvas>
                <button id="restart-button">Restart Game</button>
            </div>
        `;
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            strokeStyle: '',
            strokeRect: jest.fn(),
            font: '',
            textAlign: '',
            fillText: jest.fn(),
            globalAlpha: 1
        };
        const canvas = document.getElementById('game-canvas');
        canvas.getContext = jest.fn(() => mockContext);
        game = new Game();
    });

    test('initializes with correct default values', () => {
        expect(game.snake).toHaveLength(1);
        expect(game.score).toBe(0);
        expect(game.gameOver).toBe(false);
        expect(game.direction).toEqual({ x: 1, y: 0 });
    });

    test('game over when snake hits wall', () => {
        game.snake[0] = { x: -1, y: 0 };
        game.update();
        expect(game.gameOver).toBe(true);
    });

    test('game over when snake hits itself', () => {
        game.snake = [
            { x: 5, y: 5 },
            { x: 6, y: 5 },
            { x: 7, y: 5 }
        ];
        game.direction = { x: -1, y: 0 };
        game.update();
        expect(game.gameOver).toBe(true);
    });

    test('game resets correctly', () => {
        game.score = 50;
        game.gameOver = true;
        game.reset();
        expect(game.score).toBe(0);
        expect(game.gameOver).toBe(false);
        expect(game.snake).toHaveLength(1);
    });

    test('updates high score when current score is higher', () => {
        const mockScoreManager = game.scoreManager;
        game.score = 100;
        game.snake[0] = { x: -1, y: 0 }; // Trigger game over
        game.update();
        expect(mockScoreManager.updateHighScore).toHaveBeenCalledWith(100);
    });
});