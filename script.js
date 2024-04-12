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

  let activePlayer = players[0];
  const switchPlayers = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => board.printBoard();

  // returns `true` if win. otherwise returns `false`
  const activePlayerHasWon = () => {
    const currentBoard = board.printBoard();
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

  const allCellsMarked = () => !board.printBoard().flat(1).includes(null);

  const playRound = (row, column) => {
    board.addMarker(row, column, getActivePlayer().marker);
    switchPlayers();
    printNewRound();
  };

  // running
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    activePlayerHasWon,
    allCellsMarked,
    getBoard: board.getBoard,
  };
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

    // get most up-to-date version of board
    const board = game.getBoard();

    // display player's turn
    const activePlayer = game.getActivePlayer();
    playerDivs.forEach((d) => d.classList.remove("active"));
    document.querySelector(`#${activePlayer.position}`).classList.add("active");

    // render board
    board.forEach((row, rowIdx) => {
      row.forEach((cell, columnIdx) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell");
        cellBtn.setAttribute("data-row", rowIdx);
        cellBtn.setAttribute("data-column", columnIdx);
        cellBtn.textContent = cell.getValue();
        if (cellBtn.textContent || game.activePlayerHasWon())
          cellBtn.disabled = true;
        boardElement.appendChild(cellBtn);
      });
    });

    if (game.activePlayerHasWon() || game.allCellsMarked()) {
      dialogElement.showModal();
    }
  };

  // add event listener for board
  function handleClickOnBoard(e) {
    const selectedRow = e.target.getAttribute("data-row");
    const selectedColumn = e.target.getAttribute("data-column");

    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  // add event listener for game reset button
  const resetGame = () => location.reload();

  boardElement.addEventListener("click", handleClickOnBoard);
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);
  closeModalBtn.addEventListener("click", () => dialogElement.close());

  updateScreen();
})();
