export class ScoreManager {
    constructor() {
        this.storageKey = 'snakeGameHighScore';
        this.highScore = 0;

        if (typeof localStorage !== 'undefined') {
            this.loadHighScore();
        } else {
            console.warn('localStorage is not available. High scores will not persist.');
        }
    }

    loadHighScore() {
        try {
            if (typeof localStorage !== 'undefined') {
                const storedScore = localStorage.getItem(this.storageKey);
                if (storedScore !== null) {
                    const parsedScore = parseInt(storedScore, 10);
                    if (!isNaN(parsedScore)) {
                        this.highScore = parsedScore;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading high score:', error);
        }
    }

    updateHighScore(score) {
        if (typeof score !== 'number' || isNaN(score)) {
            return false;
        }
        if (score > this.highScore) {
            this.highScore = score;
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(this.storageKey, score.toString());
                }
                return true;
            } catch (error) {
                console.error('Error updating high score:', error);
            }
        }
        return false;
    }

    getHighScore() {
        return this.highScore;
    }

    resetHighScore() {
        this.highScore = 0;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(this.storageKey);
            }
        } catch (error) {
            console.error('Error resetting high score:', error);
        }
    }
}
