const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

let cells = Array(9).fill(null);
let playerTurn = true;   // true = player's turn (X), false = AI's turn (O)
let gameActive = true;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((value, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.dataset.idx = idx;
    cellDiv.textContent = value || '';
    if (!value && gameActive && playerTurn) {
      cellDiv.addEventListener('click', onCellClick);
    }
    board.appendChild(cellDiv);
  });
}

function onCellClick(e) {
  const idx = +e.target.dataset.idx;
  if (!gameActive || cells[idx] || !playerTurn) return;

  cells[idx] = 'X';
  playerTurn = false;
  renderBoard();

  if (checkWinner('X')) {
    showStatus('You win! 🎉');
    gameActive = false;
    renderBoard();
    return;
  }
  if (isDraw()) {
    showStatus("It's a draw!");
    gameActive = false;
    renderBoard();
    return;
  }

  showStatus('AI is thinking...');
  setTimeout(aiMove, 400);
}

function aiMove() {
  if (!gameActive) return;

  const idx = getBestMove();
  if (idx === -1) return;

  cells[idx] = 'O';

  if (checkWinner('O')) {
    showStatus('AI wins! 🤖');
    gameActive = false;
    renderBoard();
    return;
  }
  if (isDraw()) {
    showStatus("It's a draw!");
    gameActive = false;
    renderBoard();
    return;
  }

  playerTurn = true;
  showStatus('Your turn (X)');
  renderBoard();
}

// Smarter AI: win if possible, block if needed, otherwise pick best spot
function getBestMove() {
  const empty = cells.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
  if (empty.length === 0) return -1;

  // 1. Can AI win?
  for (const i of empty) {
    cells[i] = 'O';
    if (checkWinner('O')) { cells[i] = null; return i; }
    cells[i] = null;
  }
  // 2. Block player win
  for (const i of empty) {
    cells[i] = 'X';
    if (checkWinner('X')) { cells[i] = null; return i; }
    cells[i] = null;
  }
  // 3. Take center
  if (empty.includes(4)) return 4;
  // 4. Take a corner
  const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  // 5. Take any edge
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWinner(player) {
  return winPatterns.some(pattern =>
    pattern.every(idx => cells[idx] === player)
  );
}

function isDraw() {
  return cells.every(cell => cell !== null);
}

function showStatus(msg) {
  statusDiv.textContent = msg;
}

function restartGame() {
  cells = Array(9).fill(null);
  playerTurn = true;
  gameActive = true;
  showStatus('Your turn (X)');
  renderBoard();
}

restartBtn.addEventListener('click', restartGame);
showStatus('Your turn (X)');
renderBoard();
