// ? this should probably be an IIFE if only used once
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

  const addMark = (row, column, player) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === null)
      .map((row) => row[column]);

    if (!availableCells.length) return;
    board[row][column].registerMark(player);

    console.log(availableCells);
  };

  // ? this might be removed / modified after we move to a UI version (rather than the current, console version)
  const printBoard = () => {
    const boardWithCellsMarked = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellsMarked);
  };

  // return _interface_ (rather than board itself) for rest of application to interact with gameboard
  return { getBoard, addMark, printBoard };
}

function createCell() {
  let value = null;

  // accept player's mark ("x" or "o") to change value of cell
  const registerMark = (mark) => (value = mark);
  // retrieve current value of cell through closure
  const getValue = () => value;

  return { registerMark, getValue };
}

// GameController will control flow and state of game's turn, and win/loss/tie
// ? this should probably be an IIFE if only used once
function createGameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = createGameboard();
  const players = [
    { name: playerOneName, mark: "x" },
    { name: playerTwoName, mark: "o" },
  ];

  let activePlayer = players[0];
  const switchPlayerTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    // add mark to chosen row and column, for current player
    console.log(
      `adding ${
        getActivePlayer().name
      }'s mark into position ${row}, ${column} (row, column)`
    );
    board.addMark(row, column, getActivePlayer().mark);

    // TODO: placeholder for win condition and output (eg winner message)

    switchPlayerTurns();
    printNewRound();
  };

  // running
  printNewRound();

  return { playRound, getActivePlayer };
}

const game = createGameController();
