function createGameboard() {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];

  // row 0 is top, column 0 is left
  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLUMNS; c++) {
      board[r].push(createCell());
    }
  }

  const getBoard = () => board;
  const addMarker = (rowIdx, columnIdx, marker) => {
    if (board[rowIdx][columnIdx].getValue() !== null)
      console.log("already marker there");
    else console.log("ok let's mark it there");
    // show user what cells are available??

    // if the cell is not available, ask to try again

    // if the cell is available, register it using cell.registerMarker();
    return;
  };

  //   const addMark = (row, column, mark) => {
  //     const availableCells = board
  //       .filter((row) => row[column].getValue() === null)
  //       .map((row) => row[column]);

  //     if (!availableCells.length) return;
  //     board[row][column].registerMark(mark);

  //     console.log("availableCells", availableCells);
  //   };

  // ? this might be removed / modified after we move to a UI version (rather than the current, console version)
  const printBoard = () => {
    const boardWithCellsMarked = board.map((r) =>
      r.map((cell) => cell.getValue())
    );
    console.log(boardWithCellsMarked);
  };

  // return _interface_ (rather than board itself) for rest of application to interact with gameboard
  return { getBoard, addMarker, printBoard };
}

function createCell() {
  let value = null;

  // accept player's mark ("x" or "o") to change value of cell
  const setMarker = (marker) => (value = marker);
  // retrieve current value of cell through closure
  const getValue = () => value;

  return { setMarker, getValue };
}

// GameController will control flow and state of game's turn, and win/loss/tie
// ? this should probably be an IIFE if only used once
function createGameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = createGameboard();
  const players = [
    { name: playerOneName, marker: "x" },
    { name: playerTwoName, marker: "o" },
  ];

  let activePlayer = players[0];

  const switchPlayers = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.
    
Please enter game.playRound(rowNumber, columnNumber) to place your marker "${
      getActivePlayer().marker
    }" to those coordinates.`);
  };

  const playRound = (row, column) => {
    // add mark to chosen row and column, for current player
    console.log(
      `adding ${
        getActivePlayer().name
      }'s mark into position ${row}, ${column} (row, column)`
    );
    board.addMarker(row, column, getActivePlayer().marker);

    // TODO: placeholder for win condition and output (eg winner message)

    switchPlayers();
    printNewRound();
  };

  // running
  printNewRound();

  return { playRound };
}

const game = createGameController();
