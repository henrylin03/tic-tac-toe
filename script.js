function createGameboard() {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];
  const cell = createCell();

  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLUMNS; c++) {
      board[r].push(cell);
    }
  }

  return board;
}

function createCell() {
  let value = 0;

  // accept player's mark ("x" or "o") to change value of cell //? connect four example just took player 1 or 2 as values rather than colours. we may need to convert this later.
  const addMark = (mark) => (value = mark);
  // retrieve current value of cell through closure
  const getValue = () => value;

  return { addMark, getValue };
}

const gameboard = createGameboard();
console.log(gameboard);
