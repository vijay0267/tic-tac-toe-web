const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

let cells = Array(9).fill(null); // 3x3 grid
let currentPlayer = 'X';         // User is always 'X'
let gameActive = true;

// Winning combinations
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((value, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.dataset.idx = idx;
    cellDiv.textContent = value ? value : '';
    if (!value && gameActive && currentPlayer === 'X') {
      cellDiv.addEventListener('click', onCellClick);
    }
    board.appendChild(cellDiv);
  });
}

function onCellClick(e) {
  const idx = +e.target.dataset.idx;
  if (!gameActive || cells[idx]) return;
  cells[idx] = currentPlayer;
  renderBoard();
  if (checkWinner(currentPlayer)) {
    showStatus(currentPlayer + ' wins!');
    gameActive = false;
    return;
  }
  if (cells.every(cell => cell)) {
    showStatus('Draw!');
    gameActive = false;
    return;
  }
  currentPlayer = 'O'; // Switch to AI
  setTimeout(aiMove, 500);
}

function aiMove() {
  // Simple AI: pick first empty cell
  if (!gameActive) return;
  let idx = cells.findIndex(cell => !cell);
  if (idx !== -1) {
    cells[idx] = 'O';
    renderBoard();
    if (checkWinner('O')) {
      showStatus('O wins (AI)!');
      gameActive = false;
      return;
    }
    if (cells.every(cell => cell)) {
      showStatus('Draw!');
      gameActive = false;
      return;
    }
    currentPlayer = 'X';
  }
}

function checkWinner(player) {
  return winPatterns.some(pattern =>
    pattern.every(idx => cells[idx] === player)
  );
}

function showStatus(msg) {
  statusDiv.textContent = msg;
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  showStatus('');
  renderBoard();
}

restartBtn.addEventListener('click', restartGame);
renderBoard();
