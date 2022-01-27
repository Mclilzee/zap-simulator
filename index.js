const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 5, 5: 10, 6: 20 };
let tierList = [0, 1, 2, 3, 4, 5];
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
  document.querySelector(".buttonsContainer").classList.remove("hidden");

  currentZapPoints = 0;
  setZapPointsLabel();
  resetBoard();
});

function resetBoard() {
  tierList = [0, 1, 2, 3, 4, 5];
  emptyAllCells();
}

function emptyAllCells() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("zapped");
  });
}

function commitZap(zapTier) {
  const zapRank = tierList[zapTier];
  const zapResult = tierPoints[zapRank];
  tierList[zapTier] += 1;

  currentZapPoints += zapResult;

  updateBoard(zapTier);

  if (currentZapPoints >= 10) {
    getBanned();
  }
}

function updateBoard(zapTier) {
  setZapPointsLabel();

  const cellsCount = tierList[zapTier];
  for (let i = zapTier; i < cellsCount; i++) {
    const cellId = "" + zapTier + i;
    const cellToUpdate = document.getElementById(cellId);
    cellToUpdate.classList.add("zapped");
  }
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
  document.querySelector(".buttonsContainer").classList.add("hidden");
  document.querySelector(".bannMessage").classList.remove("hidden");
}
