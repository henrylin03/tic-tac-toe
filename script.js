function createGameboard() {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];
  const cell = createCell();

  // row 0 is top, column 0 is left
  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLUMNS; c++) {
      board[r].push(cell);
    }
  }
  // getter for entire board that UI will eventually render
  const getBoard = () => board;

  //?? TODO: add function to include logic of adding mark from player

  // ? this might be removed / modified after we move to a UI version (rather than the current, console version)
  const printBoard = () => {
    const boardWithCellsMarked = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellsMarked);
  };

  // return _interface_ (rather than board itself) for rest of application to interact with gameboard
  return { getBoard, printBoard };
}

function createCell() {
  let value = 0;

  // accept player's mark ("x" or "o") to change value of cell //? connect four example just took player 1 or 2 as values rather than colours. we may need to convert this later.
  const addMark = (mark) => (value = mark);
  // retrieve current value of cell through closure
  const getValue = () => value;

  return { addMark, getValue };
}
