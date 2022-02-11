/* const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
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

const darkModeButton = document.querySelector("#darkModeIcon");
isMoon = true;
function swapIcon() {
  if (isMoon) {
    isMoon = false;
    darkModeButton.textContent = `🌞`;
  } else {
    isMoon = true;
    darkModeButton.textContent = `🌙`;
  }
}
darkModeButton.addEventListener("click", () => {
  const divs = document.querySelectorAll("div");
  const buttons = document.querySelectorAll("button");
  const cells = document.querySelectorAll(".cell");
  const zapLabels = document.querySelectorAll(".zapLabel");
  const pointsLabels = document.querySelectorAll(".pointsLabel");
  const body = document.querySelector("body");
  body.classList.toggle("darkMode");
  divs.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  buttons.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  cells.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  zapLabels.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  pointsLabels.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  swapIcon();
});
*/ 
const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
let total_points = 0;
const svg_paths = {
  red: "",
  blue: "",
  green: "",
  yellow: "",
  alien: ""
}
const generate_level = (color, o_tier, c_tier, skip = false) => {
  return {
    color: color,
    o_tier: o_tier,
    c_tier: c_tier,
    add_tier: function() {
      this.c_tier++
    }
  }
}
const create_levels = () => {
  return Object.keys(tierPoints).map((tier) => (
   Object.keys(svg_paths).map((color) => (
       generate_level(color, tier, tier)
    ))
  ))
}
const levels = create_levels().flat();

const zapButtons = document.querySelector(".zapButtons");

zapButtons.addEventListener("click", (e) => {
  const index = Number(e.target.id.slice(-1));
    document.querySelector(`.lvl${index}`).classList.remove("hidden")
});

const lvl_buttons = document.querySelectorAll(".levels button")
lvl_buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    const classes = e.target.classList
    const color = classes[1]
    const tier = Number(classes[0].slice(-1))
    const obj = levels.find(level => (
      level.color == color && level.o_tier == tier 
    ))
    total_points += tierPoints[obj.c_tier]
    obj.add_tier()
    console.log(total_points)
  })
})
