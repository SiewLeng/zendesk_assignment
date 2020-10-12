const readline = require('readline');
const Math = require('math');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

function printBoard(boardValue) {
  const n = boardValue.length;
  for (let i = 0 ; i < n; i++) {
    //print a row of board value
    let rowTop = '';
    for (let j = 0; j < n; j++) {
      rowTop = rowTop + '   ';
    }
    let rowMiddle = '';
    for (let j = 0; j < n; j++) {
      let printBoardValue = '';
      if (boardValue[i][j] < 10 || typeof boardValue[i][j] == 'string') {
        printBoardValue = printBoardValue + ` ${boardValue[i][j]}`;
      } else {
        printBoardValue = printBoardValue + boardValue[i][j];
      }
      if (j < n - 1) {
        rowMiddle = rowMiddle + ` ${printBoardValue} |`;

      } else {
        rowMiddle = rowMiddle + ` ${printBoardValue} `;
      }
    }
    let rowBottom = '';
    if (i < n - 1) {
      for (let j = 0; j < n; j++) {
        rowBottom = rowBottom + '_ _ ';
      }
      rowBottom = rowBottom + '_ _ _ ';
    } else {
      rowTop = rowTop + '   ';
    }
    console.log(rowTop);
    console.log(rowMiddle);
    console.log(rowBottom);
  }
}

function isValidResponse(response, boardValue) {
  const n =  boardValue.length;
  let validResponse = false;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (typeof boardValue[i][j] == 'number' && boardValue[i][j] == response) {
        validResponse = true;
        break;
      }
    }
  }
  return validResponse;
}

function isWinning(i, j, boardValue, playerValue) {
  const n = boardValue.length;
  const isRow = () => {
    let count = 0;
    for (let k = 0; k < n; k++) {
      if (boardValue[i][k] == playerValue) {
        count++;
      } else {
        break;
      }
    }
    if (count == n) {
      return true;
    } else {
      return false;
    }
  }
  const isColumn = () => {
    let count = 0;
    for (let k = 0; k < n; k++) {
      if (boardValue[k][j] == playerValue) {
        count++;
      } else {
        break;
      }
    }
    if (count == n) {
      return true;
    } else {
      return false;
    }
  }
  const isDiagonalOne = () => {
    let count = 0;
    for (let k = 0; k < n; k++) {
      if (boardValue[k][k] == playerValue) {
        count++;
      } else {
        break;
      }
    }
    if (count == n) {
      return true;
    } else {
      return false;
    }
  }
  const isDiagonalTwo= () => {
    let count = 0;
    for (let k = 0; k < n; k++) {
      if (boardValue[n - 1 - k][k] == playerValue) {
        count++;
      } else {
        break;
      }
    }
    if (count == n) {
      return true;
    } else {
      return false;
    }
  }
  if (isRow()) {
    return true;
  } else if (isColumn()) {
    return true;
  } else if (isDiagonalOne()) {
    return true;
  } else if(isDiagonalTwo()) {
    return true;
  } else {
    return false;
  }
}

start();

async function start() {
  // get player name
  const players = [];
  const playerOneName = await ask('Enter name for Player 1: ');
  const playerTwoName = await ask('Enter name for Player 2: ');
  players.push({ name: playerOneName, value: 'x' });
  players.push({ name: playerTwoName, value: 'o' });

  // initialize board value
  const n = 3;
  const boardValue = [];
  for (let i = 0; i < n; i++) {
    boardValue[i] = [];
    for (let j = 0; j < n; j++) {
      boardValue[i][j] = (i * n + j) + 1;
    }
  }

  printBoard(boardValue);

  let playerNumber = 0;
  let continueGame = true;
  let count = 0;
  const maxNumber = n * n;

  while (continueGame) {
    // ask Player to choose a box
    let player = players[playerNumber];
    let response = await ask(`${player.name}, please choose a box to place an '${player.value}' into: `);
    while (!isValidResponse(response, boardValue)) {
      response = await ask(`${player.name}, please choose a box to place an '${player.value}' into with number from 1 to ${maxNumber}: `);
    }

    // update the board with the player's response
    const i = Math.floor((parseInt(response) - 1) / n);
    const j = (parseInt(response) - 1) % n;
    boardValue[i][j] = `${player.value}`;
    count ++;

    printBoard(boardValue);

    if (isWinning(i, j, boardValue, player.value)) {
      continueGame = false;
      console.log(`Congrats, ${player.name} has won.`);
    } else if (count == n * n) {
      continueGame = false;
      console.log(`It is a draw.`);
    } else {
      continueGame = true;
      playerNumber = (playerNumber + 1) % 2;
    }
  }

  process.exit();

}