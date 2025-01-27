import { ScoreManager } from './ScoreManager';

describe('ScoreManager', () => {
    let scoreManager;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Create a new ScoreManager instance
        scoreManager = new ScoreManager();
    });

    afterEach(() => {
        // Clear localStorage after each test
        localStorage.clear();
    });

    test('should initialize with high score of 0', () => {
        expect(scoreManager.highScore).toBe(0);
        expect(localStorage.getItem('snakeGameHighScore')).toBeNull();
    });

    test('should update high score if the new score is higher', () => {
        scoreManager.highScore = 30;
        const updated = scoreManager.updateHighScore(50);
        expect(updated).toBe(true);
        expect(scoreManager.highScore).toBe(50);
        expect(localStorage.getItem('snakeGameHighScore')).toBe('50');
    });

    test('should not update high score if the new score is lower or equal', () => {
        scoreManager.highScore = 30;
        const updated = scoreManager.updateHighScore(20);
        expect(updated).toBe(false);
        expect(scoreManager.highScore).toBe(30);
        expect(localStorage.getItem('snakeGameHighScore')).toBeNull();
    });

    test('should not update high score if the score is invalid', () => {
        scoreManager.updateHighScore(100);
        const updated = scoreManager.updateHighScore('invalid');
        expect(updated).toBe(false);
        expect(scoreManager.highScore).toBe(100);
        expect(localStorage.getItem('snakeGameHighScore')).toBe('100');
    });

    test('should reset the high score to 0 and remove it from localStorage', () => {
        localStorage.setItem('snakeGameHighScore', '100');
        scoreManager.highScore = 100;
        scoreManager.resetHighScore();
        expect(scoreManager.highScore).toBe(0);
        expect(localStorage.getItem('snakeGameHighScore')).toBeNull();
    });
});
