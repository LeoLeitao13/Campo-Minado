var board = [];
var rows = 10;
var columns = 10;

var minesCount = 5;
var minesLocation = []; //id de onde vai ficar as bombas

var tilesClicked = 0; //Clicar em todas menos nas bombas
var flagEnabled = false;

var gameOver = false;
var firstClick = true;

window.onload = function () {
  startGame();
};

function setMines() {
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
  iniciarCronometro();

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

  if (firstClick) {
    firstClick = false;
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // remove a bomba da célula clicada
    minesLocation = minesLocation.filter((id) => id !== tile.id);

    // redefine as minas aleatoriamente
    setMines();

    checkMine(r, c); // chama a função para a célula clicada
  } else {
    // demais cliques
    if (minesLocation.includes(tile.id)) {
      alert("GAME OVER");
      gameOver = true;
      revealMines();
      return;
    }
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
  }
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
    document.getElementById("mines-count").innerText =
      "PARABÉNS VOCÊ VENCEU!!!";
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

//Cronometro

let tempo = 0;
let cronometro;

function atualizarCronometro() {
  const horas = Math.floor(tempo / 3600);
  const minutos = Math.floor((tempo % 3600) / 60);
  const segundos = tempo % 60;
  const tempoFormatado = `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  document.getElementById("cronometro").textContent = tempoFormatado;
}

function iniciarCronometro() {
  if (!cronometro) {
    cronometro = setInterval(() => {
      tempo++;
      atualizarCronometro();
    }, 1000);
  }
}

function pararCronometro() {
  if (cronometro) {
    clearInterval(cronometro);
    cronometro = null;
  } else {
    tempo = 0;
    atualizarCronometro();
  }
}
