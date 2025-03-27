class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.isGameActive = true;
        this.isComputerMode = true;
        this.isPlayerFirst = true;
        this.computerDelay = 500;

        // DOM elements
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.cells = document.querySelectorAll('.cell');
        this.resetButton = document.getElementById('reset');
        this.startFirstButton = document.getElementById('start-first');
        this.startSecondButton = document.getElementById('start-second');
        this.pvpModeButton = document.getElementById('pvp-mode');
        this.pvcModeButton = document.getElementById('pvc-mode');
        this.computerGameOptions = document.getElementById('computerGameOptions');
        this.opponentName = document.getElementById('opponent-name');
        this.playerX = document.querySelector('.player-x');
        this.playerO = document.querySelector('.player-o');

        // Bind event listeners
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.startFirstButton.addEventListener('click', () => this.setPlayerFirst(true));
        this.startSecondButton.addEventListener('click', () => this.setPlayerFirst(false));
        this.pvpModeButton.addEventListener('click', () => this.setGameMode(false));
        this.pvcModeButton.addEventListener('click', () => this.setGameMode(true));
    }

    setGameMode(isComputerMode) {
        this.isComputerMode = isComputerMode;
        this.pvpModeButton.classList.toggle('active', !isComputerMode);
        this.pvcModeButton.classList.toggle('active', isComputerMode);
        this.computerGameOptions.style.display = isComputerMode ? 'block' : 'none';
        this.opponentName.textContent = isComputerMode ? 'Computer' : 'Player 2';
        this.resetGame();
    }

    setPlayerFirst(isFirst) {
        this.isPlayerFirst = isFirst;
        this.startFirstButton.classList.toggle('active', isFirst);
        this.startSecondButton.classList.toggle('active', !isFirst);
        this.resetGame();
    }

    updatePlayerIndicator() {
        this.playerX.classList.toggle('active', this.currentPlayer === 'X');
        this.playerO.classList.toggle('active', this.currentPlayer === 'O');
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        
        if (this.board[index] || !this.isGameActive) {
            return;
        }

        if (this.isComputerMode) {
            if ((this.currentPlayer === 'O' && this.isPlayerFirst) || 
                (this.currentPlayer === 'X' && !this.isPlayerFirst)) {
                return;
            }
        }

        this.makeMove(index);
        
        if (this.isGameActive && this.isComputerMode) {
            setTimeout(() => this.computerMove(), this.computerDelay);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWinner()) {
            const winner = this.isComputerMode ? 
                (this.currentPlayer === 'X' ? 'You win!' : 'Computer wins!') :
                `Player ${this.currentPlayer} wins!`;
            this.statusElement.textContent = winner;
            this.statusElement.classList.add('winning-message');
            this.isGameActive = false;
            return;
        }

        if (this.isDraw()) {
            this.statusElement.textContent = "It's a draw!";
            this.isGameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
        this.updatePlayerIndicator();
    }

    computerMove() {
        if (!this.isGameActive) return;
        
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove);
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.currentPlayer;
                const score = this.minimax(0, false);
                this.board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    minimax(depth, isMaximizing) {
        const winner = this.checkWinner();
        if (winner) {
            return winner === (this.isPlayerFirst ? 'O' : 'X') ? 10 - depth : depth - 10;
        }
        if (this.isDraw()) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === '') {
                    this.board[i] = this.currentPlayer;
                    const score = this.minimax(depth + 1, false);
                    this.board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === '') {
                    this.board[i] = this.currentPlayer === 'X' ? 'O' : 'X';
                    const score = this.minimax(depth + 1, true);
                    this.board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                // Highlight winning cells
                pattern.forEach(index => {
                    this.cells[index].style.backgroundColor = 'rgba(46, 204, 113, 0.3)';
                });
                return this.board[a];
            }
        }
        return null;
    }

    isDraw() {
        return this.board.every(cell => cell !== '');
    }

    updateStatus() {
        let statusText;
        if (this.isComputerMode) {
            statusText = this.currentPlayer === 'X' ? 'Your turn' : "Computer's turn";
        } else {
            statusText = `Player ${this.currentPlayer}'s turn`;
        }
        this.statusElement.textContent = `${statusText} (${this.currentPlayer})`;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.isGameActive = true;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            cell.style.backgroundColor = '';
        });
        this.statusElement.classList.remove('winning-message');
        this.updateStatus();
        this.updatePlayerIndicator();

        if (this.isComputerMode && !this.isPlayerFirst) {
            setTimeout(() => this.computerMove(), this.computerDelay);
        }
    }
}

// Initialize the game
const game = new TicTacToe();