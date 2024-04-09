function createGameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  return board;
}

function createCell() {
  let value = 0;

  // accept player's mark ("x" or "o") to change value of cell
  const addMark = (player) => {
    value = player;
  };

  // retrieve current value of cell through closure
  const getValue = () => value;

  return { addMark, getValue };
}

// const gameboard = createGameboard();
const cell = createCell();
console.log(cell);
// console.log(gameboard);
