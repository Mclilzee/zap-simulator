const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10};
let tierList = [0, 1, 2, 3, 4];
let currentZapPoints = 0;

const zapButtons = document.querySelector(".zapButtons");

zapButtons.addEventListener("click", (e) => {
  const index = Number(e.target.id.slice(-1));

  commitZap(index);
});

const timeTravelButton = document.querySelector(".timeTravelButton");

timeTravelButton.addEventListener("click", () => {
  currentZapPoints--;

  if (currentZapPoints < 0) {
    currentZapPoints = 0;
  }

  setZapPointsLabel();
});

const tryAgainButton = document.querySelector(".tryAgainButton");

tryAgainButton.addEventListener("click", () => {
  document.querySelector(".bannMessage").classList.add("hidden");

  currentZapPoints = 0;
  setZapPointsLabel();
  resetBoard();
});

function resetBoard() {
  tierList = [0, 1, 2, 3, 4];
  emptyAllCells();
}

function emptyAllCells() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("zapped");
  });
}

function commitZap(index) {
  const zapRank = tierList[index];
  const zapResult = tierPoints[zapRank];
  tierList[index] += 1;

  currentZapPoints += zapResult;

  updateBoard(index, zapRank);

  if (currentZapPoints >= 10) {
    getBanned();
  }
}

function updateBoard(index, zapRank) {
  setZapPointsLabel();

  const cellId = "" + index + zapRank;
  const cellToUpdate = document.getElementById(cellId);
  cellToUpdate.classList.add("zapped");
}

function setZapPointsLabel() {
  const zapPointsLabel = document.querySelector(".zapPointsLabel");
  zapPointsLabel.textContent = "Current Zap Points: " + currentZapPoints;

  if (currentZapPoints >= 10) {
    zapPointsLabel.id = "currentPointsRank3";
  } else if (currentZapPoints >= 5) {
    zapPointsLabel.id = "currentPointsRank2";
  } else {
    zapPointsLabel.id = "currentPointsRank1";
  }
}

function getBanned() {
  document.querySelector(".bannMessage").classList.remove("hidden");
}

const darkModeButton = document.querySelector('#darkModeIcon')
isMoon = true
function swapIcon() {
  if (isMoon) {
    isMoon = false;
    darkModeButton.textContent = `🌞`;
  } else {
      isMoon = true;
      darkModeButton.textContent = `🌙`;
  }
}
darkModeButton.addEventListener('click', () => {
  const divs = document.querySelectorAll('div');
  const buttons = document.querySelectorAll('button');
  const cells = document.querySelectorAll('.cell');
  const zapLabels = document.querySelectorAll('.zapLabel')
  const pointsLabels = document.querySelectorAll('.pointsLabel')
  const body = document.querySelector('body');
  body.classList.toggle('darkMode');
  divs.forEach((element) => {
    element.classList.toggle('darkMode');
  });
  buttons.forEach((element) => {
    element.classList.toggle('darkMode');
  });
  cells.forEach((element) => {
    element.classList.toggle('darkMode');
  });
  zapLabels.forEach((element) => {
    element.classList.toggle('darkMode');
  });
  pointsLabels.forEach((element) => {
    element.classList.toggle('darkMode');
  });
  swapIcon()
});
