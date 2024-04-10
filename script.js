function createGameboard() {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];

  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLUMNS; c++) {
      board[r].push(createCell());
    }
  }

  const getBoard = () => board;
  const addMarker = (rowIdx, columnIdx, marker) => {
    const selectedCell = board[rowIdx][columnIdx];

    if (selectedCell.getValue() !== null) return;

    selectedCell.setMarker(marker);
  };

  // ? this might be removed / modified after we move to a UI version (rather than the current, console version)
  const printBoard = () => {
    const boardWithCellsMarked = board.map((r) =>
      r.map((cell) => cell.getValue())
    );
    console.log(boardWithCellsMarked);
    return boardWithCellsMarked;
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

  // todo: create function called "findWinner" or something that can be used to output the winning player's name
  const playRound = (row, column) => {
    // add markers
    console.log(
      `adding ${
        getActivePlayer().name
      }'s mark into coordinates: row ${row}, column ${column} (zero-indexed)`
    );
    board.addMarker(row, column, getActivePlayer().marker);

    // check winning condition
    const printedBoard = board.printBoard();
    const markersOnTheBoard = printedBoard.flat(1).filter((c) => c).length;

    // if there are less than 5 markers total (3 x's minimum), don't even check. x can't win.
    // if (markersCount >= 5) {
    //   for (let r = 0; r < printedBoard.length; r++) {
    //     for (let c = 0; c < r.length; c++) {
    //       console.log(`${(r, c)}, ${printedBoard[r][c]}`);
    //     }
    //   }
    // }
    //todo: uncomment out check to make sure markersCount > 5 first before winning conditions checked

    // CHECK IF WON BY 3 IN A ROW
    for (let r = 0; r < printedBoard.length; r++) {
      if (printedBoard[r].includes(null)) continue;
      if (
        printedBoard[r].every(
          (currentValue) => currentValue === printedBoard[r][0]
        )
      )
        return console.log(`${printedBoard[r][0]} wins!`);
    }

    // CHECK IF WON BY 3 IN A COLUMN
    for (let c = 0; c < printedBoard[0].length; c++) {
      const colArray = [
        printedBoard[0][c],
        printedBoard[1][c],
        printedBoard[2][c],
      ];

      if (colArray.includes(null)) continue;
      if (colArray.every((currentValue) => currentValue === colArray[0]))
        return console.log(`${colArray[0]} wins!`);
    }

    // CHECK IF WON BY DIAGONAL
    // to win by diagonal, the centre value needs to be there
    const centreCell = printedBoard[1][1];
    const cornerCellsLookup = {
      topLeft: printedBoard[(0, 0)],
      topRight: printedBoard[(0, 2)],
      bottomLeft: printedBoard[(2, 0)],
      bottomRight: printedBoard[(2, 2)],
    };
    if (centreCell != null) {
    }

    // if no 3 in a row at all, check if there are any free spaces left. if no free space, then end and say tie.

    // if no and game should continue, then run the following (switch players, then print new round)
    switchPlayers();
    printNewRound();
  };

  // running
  printNewRound();

  return { playRound };
}

const game = createGameController();
