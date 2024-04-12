function createCell() {
  let value = null;

  const setMarker = (marker) => (value = marker);
  const getValue = () => value;

  return { setMarker, getValue };
}

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

function createGameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = createGameboard();
  const players = [
    { position: "playerOne", name: playerOneName, marker: "x" },
    { position: "playerTwo", name: playerTwoName, marker: "o" },
  ];

  // determine active player (turn)
  let activePlayer = players[0];
  const switchPlayers = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => board.printBoard();

  const activePlayerHasWon = (currentBoard) => {
    const winByRow = () => {
      for (let r = 0; r < currentBoard.length; r++) {
        const hasWon = currentBoard[r].every(
          (currentValue) => currentValue === currentBoard[r][0]
        );
        if (currentBoard[r].includes(null)) continue;
        if (hasWon) return true;
      }
      return false;
    };

    const winByColumn = () => {
      for (let c = 0; c < currentBoard[0].length; c++) {
        const colArray = [
          currentBoard[0][c],
          currentBoard[1][c],
          currentBoard[2][c],
        ];
        const hasWon = colArray.every(
          (currentValue) => currentValue === colArray[0]
        );
        if (colArray.includes(null)) continue;
        if (hasWon) return true;
      }
      return false;
    };

    const winByDiagonal = () => {
      const centreCell = currentBoard[1][1];
      // skip if centre cell is null
      if (centreCell === null) return false;

      const cornerCellsLookup = {
        topLeft: currentBoard[0][0],
        topRight: currentBoard[0][2],
        bottomLeft: currentBoard[2][0],
        bottomRight: currentBoard[2][2],
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

      return (
        isSameMarker(topLeftToBottomRightDiagonalArr) ||
        isSameMarker(topRightToBottomLeftDiagonalArr)
      );
    };

    return winByRow() || winByColumn() || winByDiagonal();
  };

  const playRound = (row, column) => {
    board.addMarker(row, column, getActivePlayer().marker);

    const printedBoard = board.printBoard();
    const printedBoardFlat = printedBoard.flat(1);
    const markersCount = printedBoardFlat.filter((c) => c).length;

    if (markersCount >= 5 && activePlayerHasWon(printedBoard))
      console.log(`${activePlayer.name} wins`);
    else if (printedBoardFlat.length === markersCount)
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
  const playerDivs = document.querySelectorAll(".player");
  const boardElement = document.querySelector(".board");
  const resetBtn = document.querySelector(".reset");
  const dialogElement = document.querySelector("dialog");
  const playAgainBtn = document.querySelector(".play-again");
  const closeModalBtn = document.querySelector(".close");

  const updateScreen = () => {
    // clear board
    boardElement.textContent = "";

    // get most up-to-date version of board, and whose turn it is
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // display player's turn
    const activePlayerPosition = activePlayer.position;
    playerDivs.forEach((d) => d.classList.remove("active"));
    document.querySelector(`#${activePlayerPosition}`).classList.add("active");

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

  // add event listener for game reset button
  function resetGame() {
    location.reload();
  }

  boardElement.addEventListener("click", handleClickOnBoard);
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);
  closeModalBtn.addEventListener("click", () => dialogElement.close());

  // initial render
  updateScreen();
})();

// TODO: delete this - this is just to test modal
const dialog = document.querySelector("dialog");
const btn = document.querySelector("#btn");

btn.addEventListener("click", () => dialog.showModal());
