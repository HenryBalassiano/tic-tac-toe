function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return true;
    } else {
      return false;
    }
  };
  const checkLine = (a, b, c) => {
    return a === b && b === c && a !== 0;
  };

  const checkWinner = () => {
    for (let i = 0; i < 3; i++) {
      if (
        checkLine(
          board[i][0].getValue(),
          board[i][1].getValue(),
          board[i][2].getValue()
        )
      ) {
        return board[i][0].getValue();
      }
      if (
        checkLine(
          board[0][i].getValue(),
          board[1][i].getValue(),
          board[2][i].getValue()
        )
      ) {
        return board[0][i].getValue();
      }
    }

    if (
      checkLine(
        board[0][0].getValue(),
        board[1][1].getValue(),
        board[2][2].getValue()
      )
    ) {
      return board[0][0].getValue();
    }
    if (
      checkLine(
        board[0][2].getValue(),
        board[1][1].getValue(),
        board[2][0].getValue()
      )
    ) {
      return board[0][2].getValue();
    }

    return null;
  };
  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].reset();
      }
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues, "haha fuck yiou");

    return boardWithCellValues;
  };

  return {getBoard, placeToken, printBoard, checkWinner, resetBoard};
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  const reset = () => {
    value = 0;
  };

  return {
    addToken,
    getValue,
    reset,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into  ${(column, row)}...`
    );
    const tokenPlaced = board.placeToken(row, column, getActivePlayer().token);

    if (tokenPlaced) {
      switchPlayerTurn();
      board.printBoard();
      // if (board.checkWinner()) {
      // }
    }
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinner: board.checkWinner,
  };
}
const game = GameController();

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    game.getWinner()
      ? (playerTurnDiv.textContent = `The winner is ${game.getWinner()}!`)
      : (playerTurnDiv.textContent = `${activePlayer.name}'s turn...`);

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn && !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
