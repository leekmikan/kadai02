const boardSize = 8;
let board = [];
let currentPlayer = 'black';

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0], [1, 1]
];

function createBoard() {
  const boardEl = document.getElementById('game-board');
  boardEl.innerHTML = '';
  board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));

  // 初期配置
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', handleClick);
      boardEl.appendChild(cell);
    }
  }
  updateBoard();
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const x = +cell.dataset.x;
    const y = +cell.dataset.y;
    cell.innerHTML = '';
    if (board[y][x]) {
      const disc = document.createElement('div');
      disc.classList.add('disc', board[y][x]);
      cell.appendChild(disc);
    }
  });

  document.getElementById('turn-display').textContent = `現在のターン: ${currentPlayer === 'black' ? '黒' : '白'}`;
}

function handleClick(e) {
  const x = +e.currentTarget.dataset.x;
  const y = +e.currentTarget.dataset.y;

  if (!isValidMove(x, y, currentPlayer)) return;

  makeMove(x, y, currentPlayer);
  currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

  if (!hasValidMoves(currentPlayer)) {
    showPassMessage(currentPlayer);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    
    if (!hasValidMoves(currentPlayer)) {
      updateBoard();
      countval();
      alert('両者とも置ける場所がありません。ゲーム終了。');
      let res = countval();
	  alert((res[0] > res[1]) ? "白の勝ち" : ((res[0] == res[1]) ? "引き分け" : "黒の勝ち")); 
      return;
    }
  }

  updateBoard();
countval();
}

function isValidMove(x, y, player) {
  if (board[y][x]) return false;

  for (const [dx, dy] of directions) {
    let i = x + dx;
    let j = y + dy;
    let foundOpponent = false;

    while (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
      if (board[j][i] === null) break;
      if (board[j][i] !== player) {
        foundOpponent = true;
      } else {
        if (foundOpponent) return true;
        break;
      }
      i += dx;
      j += dy;
    }
  }
  return false;
}

function makeMove(x, y, player) {
  board[y][x] = player;

  for (const [dx, dy] of directions) {
    let i = x + dx;
    let j = y + dy;
    const toFlip = [];

    while (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
      if (board[j][i] === null) break;
      if (board[j][i] !== player) {
        toFlip.push([i, j]);
      } else {
        for (const [fx, fy] of toFlip) {
          board[fy][fx] = player;
        }
        break;
      }
      i += dx;
      j += dy;
    }
  }
}

function resetGame() {
  currentPlayer = 'black';
  createBoard();
  countval();
}
function hasValidMoves(player) {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (isValidMove(x, y, player)) return true;
    }
  }
  return false;
}
function showPassMessage(player) {
  const playerName = player === 'black' ? '黒' : '白';
  alert(`${playerName}は置ける場所がないため、パスします。`);
}
function countval(){
let wb_x = [0,0];
  for (let y = 0; y < boardSize; y++) {
  for (let x = 0; x < boardSize; x++) {
	  if(board[y][x] == "white") wb_x[0]++;
      else if(board[y][x] == "black") wb_x[1]++;
}
}
document.getElementById('w').innerText = wb_x[0];
document.getElementById('b').innerText = wb_x[1];
return wb_x;
}
createBoard();