var board = [];
var rows = 10;
var columns = 10;

var minesCount = 9;
var minesLocation = []; //id de onde vai ficar as bombas

var tilesClicked = 0; //Clicar em todas menos nas bombas
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
  startGame();
};

function setMines() {
  //   minesLocation.push("2-2");
  //   minesLocation.push("2-3");
  //   minesLocation.push("5-6");
  //   minesLocation.push("3-4");
  //   minesLocation.push("1-0");
  //   minesLocation.push("8-8");
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft -= 1;
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-button").addEventListener("click", setFlag);
  setMines();

  //populate o board
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("click", clickTile);
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
  console.log(board);
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
  } else {
    flagEnabled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgray";
  }
}

function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  let tile = this; //this refere ao click no tile
  if (flagEnabled) {
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    } else if (tile.innerText == "🚩") {
      tile.innerText = "";
    }
    return;
  }
  if (minesLocation.includes(tile.id)) {
    alert("GAME OVER");
    gameOver = true;
    revealMines();
    return;
  }

  let coords = tile.id.split("-"); //"0-0" => ["0","0"]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }

  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }

  board[r][c].classList.add("tile-clicked");
  tilesClicked += 1;

  let minesFound = 0;

  //3 minas do topo
  minesFound += checkTile(r - 1, c - 1); //topo esquerda
  minesFound += checkTile(r - 1, c); //topo
  minesFound += checkTile(r - 1, c + 1); //topo direita

  //checar esquerda e direta do tile
  minesFound += checkTile(r, c - 1); //esquerda
  minesFound += checkTile(r, c + 1); //direita

  //checar as 3 minas de baixo
  minesFound += checkTile(r + 1, c - 1); //abaixo esquerda
  minesFound += checkTile(r + 1, c); //abaixo
  minesFound += checkTile(r + 1, c + 1); //abaixo direita

  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x" + minesFound.toString());
  } else {
    //topo 3
    checkMine(r - 1, c - 1); //topo esquerda
    checkMine(r - 1, c); //topo
    checkMine(r - 1, c + 1); //topo direita

    //checar esquerda e direita
    checkMine(r, c - 1); //esquerda
    checkMine(r, c + 1); //direita

    ///checar em baixo as 3 minas
    checkMine(r + 1, c - 1); //abaixo esquerda
    checkMine(r + 1, c); //abaixo
    checkMine(r + 1, c + 1); //abaixo direita
  }

  if (tilesClicked == rows * columns - minesCount) {
    document.getElementById("mines-count").innerText = "SEM MINAS";
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }
  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
