const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

let cells = Array(9).fill(null);
let playerTurn = true;
let gameActive = true;
let scores = { x: 0, o: 0, draw: 0 };

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderBoard(winningCells) {
  board.innerHTML = '';
  cells.forEach((value, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.dataset.idx = idx;

    if (value) {
      cellDiv.textContent = value;
      cellDiv.classList.add(value.toLowerCase(), 'taken');
      if (winningCells && winningCells.includes(idx)) {
        cellDiv.classList.add('win-cell');
      }
    }

    if (!value && gameActive && playerTurn) {
      cellDiv.addEventListener('click', onCellClick);
    } else if (value) {
      cellDiv.classList.add('taken');
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

  const xWin = getWinningPattern('X');
  if (xWin) {
    showStatus('You win! 🎉');
    gameActive = false;
    scores.x++;
    updateScores();
    renderBoard(xWin);
    return;
  }
  if (isDraw()) {
    showStatus("It's a draw! 🤝");
    gameActive = false;
    scores.draw++;
    updateScores();
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

  const oWin = getWinningPattern('O');
  if (oWin) {
    showStatus('AI wins! 🤖');
    gameActive = false;
    scores.o++;
    updateScores();
    renderBoard(oWin);
    return;
  }
  if (isDraw()) {
    showStatus("It's a draw! 🤝");
    gameActive = false;
    scores.draw++;
    updateScores();
    renderBoard();
    return;
  }

  playerTurn = true;
  showStatus('Your turn (X)');
  renderBoard();
}

function getBestMove() {
  const empty = cells.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
  if (empty.length === 0) return -1;

  // Win if possible
  for (const i of empty) {
    cells[i] = 'O';
    if (checkWinner('O')) { cells[i] = null; return i; }
    cells[i] = null;
  }
  // Block player
  for (const i of empty) {
    cells[i] = 'X';
    if (checkWinner('X')) { cells[i] = null; return i; }
    cells[i] = null;
  }
  // Center
  if (empty.includes(4)) return 4;
  // Corner
  const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  // Edge
  return empty[Math.floor(Math.random() * empty.length)];
}

function getWinningPattern(player) {
  for (const pattern of winPatterns) {
    if (pattern.every(idx => cells[idx] === player)) {
      return pattern;
    }
  }
  return null;
}

function checkWinner(player) {
  return getWinningPattern(player) !== null;
}

function isDraw() {
  return cells.every(cell => cell !== null);
}

function showStatus(msg) {
  statusDiv.textContent = msg;
}

function updateScores() {
  scoreXEl.textContent = scores.x;
  scoreOEl.textContent = scores.o;
  scoreDrawEl.textContent = scores.draw;
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
