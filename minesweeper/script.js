const rows = 10;
const cols = 10;
const mines = 10;

let gameBoard = [];
let revealedCells = 0;
let flagsPlaced = 0;

function createGameBoard() {
	for (let i = 0; i < rows; i++) {
		gameBoard[i] = [];
		for (let j = 0; j < cols; j++) {
			gameBoard[i][j] = {
				isMine: false,
				adjacentMines: 0,
				revealed: false,
				flagged: false
			};
		}
	}

	// Place mines randomly
	for (let i = 0; i < mines; i++) {
		let row, col;
		do {
			row = Math.floor(Math.random() * rows);
			col = Math.floor(Math.random() * cols);
		} while (gameBoard[row][col].isMine);
		gameBoard[row][col].isMine = true;
	}

	// Calculate adjacent mines for each cell
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (!gameBoard[i][j].isMine) {
				gameBoard[i][j].adjacentMines = countAdjacentMines(i, j);
			}
		}
	}
}

function countAdjacentMines(row, col) {
	let count = 0;
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i === 0 && j === 0) continue;
			const newRow = row + i;
			const newCol = col + j;
			if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && gameBoard[newRow][newCol].isMine) {
				count++;
			}
		}
	}
	return count;
}

function revealCell(row, col) {
	if (gameBoard[row][col].flagged) return;

	if (gameBoard[row][col].revealed) return;

	gameBoard[row][col].revealed = true;
	revealedCells++;

	if (gameBoard[row][col].isMine) {
		// Game over
		revealAllMines();
		alert('Game Over!');
		return;
	}

	if (gameBoard[row][col].adjacentMines === 0) {
		// Reveal adjacent empty cells
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue;
				const newRow = row + i;
				const newCol = col + j;
				if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
					revealCell(newRow, newCol);
				}
			}
		}
	}

	if (revealedCells === rows * cols - mines) {
		// Game won
		alert('Congratulations! You won!');
	}
}

function toggleFlag(row, col) {
	if (gameBoard[row][col].revealed) return;

	gameBoard[row][col].flagged = !gameBoard[row][col].flagged;
	flagsPlaced += gameBoard[row][col].flagged ? 1 : -1;
}

function revealAllMines() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (gameBoard[i][j].isMine) {
				gameBoard[i][j].revealed = true;
			}
		}
	}
}

function renderGameBoard() {
	const gameContainer = document.getElementById('game-container');
	gameContainer.innerHTML = '';

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.dataset.row = i;
			cell.dataset.col = j;

			if (gameBoard[i][j].revealed) {
				cell.classList.add('revealed');
				if (gameBoard[i][j].isMine) {
					cell.classList.add('mine');
				} else {
					cell.textContent = gameBoard[i][j].adjacentMines > 0 ? gameBoard[i][j].adjacentMines : '';
				}
			} else if (gameBoard[i][j].flagged) {
				cell.classList.add('flagged');
			}

			cell.addEventListener('click', function () {
				revealCell(parseInt(this.dataset.row), parseInt(this.dataset.col));
				renderGameBoard();
			});

			cell.addEventListener('contextmenu', function (event) {
				event.preventDefault();
				toggleFlag(parseInt(this.dataset.row), parseInt(this.dataset.col));
				renderGameBoard();
			});

			gameContainer.appendChild(cell);
		}
	}
}

// Start the game
createGameBoard();
renderGameBoard();