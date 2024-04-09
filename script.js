function createGameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(createCell());
    }
  }

  return board;
}

function createCell() {
  let value = 0;

  // accept player's mark ("x" or "o") to change value of cell
  const addMark = (mark) => (value = mark);
  // retrieve current value of cell through closure
  const getValue = () => value;

  return { addMark, getValue };
}

const gameboard = createGameboard();
console.log(gameboard);
const cell = createCell();
console.log(cell);
