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
    selectedCell.setMarker(marker);
  };

  const printBoard = () => {
    const boardWithCellsMarked = board.map((r) =>
      r.map((cell) => cell.getValue())
    );
    return boardWithCellsMarked;
  };

  return { getBoard, addMarker, printBoard };
}

function createCell() {
  let value = null;

  const setMarker = (marker) => (value = marker);
  const getValue = () => value;

  return { setMarker, getValue };
}

// GameController will control flow and state of game's turn, and win/loss/tie
function createGameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = createGameboard();
  const players = [
    { name: playerOneName, marker: "x" },
    { name: playerTwoName, marker: "o" },
  ];

  // determine active player (turn)
  let activePlayer = players[0];
  const switchPlayers = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  // methods for new rounds
  const printNewRound = () => board.printBoard();
  // todo: create function called "findWinner" or something that can be used to output the winning player's name
  const playRound = (row, column) => {
    board.addMarker(row, column, getActivePlayer().marker);

    // check winning condition
    const printedBoard = board.printBoard();

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
    if (centreCell != null) {
      const cornerCellsLookup = {
        topLeft: printedBoard[0][0],
        topRight: printedBoard[0][2],
        bottomLeft: printedBoard[2][0],
        bottomRight: printedBoard[2][2],
      };
      const topLeftToBottomRightDiagonalArr = [
        centreCell,
        cornerCellsLookup.topLeft,
        cornerCellsLookup.bottomRight,
      ];
      const topRightToBottomLeftDiagonalArr = [
        centreCell,
        cornerCellsLookup.topRight,
        cornerCellsLookup.bottomLeft,
      ];

      const isSameMarker = (arr) =>
        arr.every((currentValue) => currentValue === centreCell);

      if (
        isSameMarker(topLeftToBottomRightDiagonalArr) ||
        isSameMarker(topRightToBottomLeftDiagonalArr)
      )
        return console.log(`${centreCell} wins!`);
    }

    // then, if there are no more free spaces, it is a tie.
    const printedBoardFlattened = printedBoard.flat(1);
    if (!printedBoardFlattened.includes(null))
      return console.log("it's a tie!");

    switchPlayers();
    printNewRound();
  };

  // running
  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

const screenController = (function () {
  const game = createGameController();
  const playerTurnElement = document.querySelector(".turn");
  const boardElement = document.querySelector(".board");
  const resetBtn = document.querySelector(".reset");

  const updateScreen = () => {
    // clear board
    boardElement.textContent = "";

    // get most up-to-date version of board, and whose turn it is
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // display player's turn
    playerTurnElement.textContent = `${activePlayer.name}'s turn`;

    // render board
    board.forEach((row, rowIdx) => {
      row.forEach((cell, columnIdx) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell");
        cellBtn.setAttribute("data-row", rowIdx);
        cellBtn.setAttribute("data-column", columnIdx);
        cellBtn.textContent = cell.getValue();
        if (cellBtn.textContent) cellBtn.disabled = true;
        boardElement.appendChild(cellBtn);
      });
    });
  };

  // add event listener for board
  function handleClickOnBoard(e) {
    const selectedRow = e.target.getAttribute("data-row");
    const selectedColumn = e.target.getAttribute("data-column");

    // make sure column/row clicked and not gaps
    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  boardElement.addEventListener("click", handleClickOnBoard);

  // add event listener for game reset button
  function handleClickOnResetBtn() {
    alert("reset");
  }
  resetBtn.addEventListener("click", handleClickOnResetBtn);

  // initial render
  updateScreen();
})();
