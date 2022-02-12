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
let form;

const svg_paths = {
  red: "./zap.svg",
  blue: "./zap.svg",
  green: "./zap.svg",
  orange: "./zap.svg",
  black: "./zap.svg"
}
const generate_level = (color, o_tier, c_tier) => {
  return {
    color: color,
    o_tier: Number(o_tier),
    c_tier: Number(c_tier),
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
let levels = create_levels().flat();

const zapButtons = document.querySelectorAll(".zapButton");

zapButtons.forEach(button => {
  button.addEventListener("click", (e) => {
  const index = Number(e.target.id.slice(-1));
    form = document.querySelector(`.lvl${index}`)
    form.classList.remove("hidden")
})
})

const get_object = (color, tier) => {
  return levels.find(level => (
    level.color == color && level.o_tier == tier 
  ))
}

const get_stats = (obj, offense) => {
  const points = document.createElement("div")
  points.style.fontWeight = "bold"
  const name = document.createElement("div")
  const c_points = document.createElement("div")
  points.classList.add("t_points")
  points.textContent = `Current Zap Points: ${total_points}`
  name.textContent = `Last offense committed: ${offense}`
  c_points.textContent = `${offense}'s tier moved: ${tierPoints[obj.c_tier]} => ${tierPoints[obj.c_tier + 1]}`
  return [points, name, c_points]
}

const update_stats = (obj, offense) => {
  total_points += tierPoints[obj.c_tier]
  const display_stats = document.querySelector(".zapPointsLabel")
  const stats = get_stats(obj, offense)
  display_stats.textContent = ""
  stats.forEach(stat => {
    stat.classList.add("stat")
    display_stats.appendChild(stat)
  })
}

const update_object = (obj) => {
    obj.add_tier()
}

const set_images = (cell_imgs) => {
  const factor = 17;
  const new_set = []
  const length = cell_imgs.length;
  for(let i = length - 1 ; i >= 0; i--){
    const img = cell_imgs[length - (i + 1)]
    img.style.width = `${100 - (i * factor)}%`
    new_set.push(img)
  }
  return new_set
}

const update_chart = (obj) => {
  const cell = document.querySelector(`#t${obj.o_tier}${obj.c_tier}`)
  const div = document.createElement("div")
  div.classList.add("img-container")
  div.style.backgroundImage = `url(${svg_paths[obj.color]})`
  cell.appendChild(div)
  const cell_imgs = document.querySelectorAll(`#t${obj.o_tier}${obj.c_tier} > div`)
  const set_imgs = set_images(cell_imgs)
  cell.textContent = ""
  set_imgs.forEach(image => {
    cell.appendChild(image)
  })
}

const getBanned = () => {
  document.querySelector(".bannMessage").classList.remove("hidden");
}

const check_ban = () => {
  if(total_points > 9){
    getBanned()
  }
}

const lvl_buttons = document.querySelectorAll(".levels button")
lvl_buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    const classes = e.target.classList
    const color = classes[1]
    const tier = Number(classes[0].slice(-1))
    const obj = get_object(color, tier)
    update_chart(obj)
    update_stats(obj, e.target.textContent)
    check_ban()
    update_object(obj)
    form.classList.add("hidden")
  })
})

const tryAgainButton = document.querySelector(".tryAgainButton");
tryAgainButton.addEventListener("click", () => {
  levels = create_levels().flat();
  total_points = 0;
  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = ""
  })
  document.querySelector(".zapPointsLabel").textContent = ""
  document.querySelector(".bannMessage").classList.add("hidden");
})

 const timeTravelButton = document.querySelector(".timeTravelButton");

timeTravelButton.addEventListener("click", () => {
  total_points < 1 ? total_points : total_points--
  const points = document.querySelector(".t_points")
  points ? points.textContent = `Current Zap Points: ${total_points}` : null
});

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
  const lights = document.querySelectorAll(".light")
  lights.forEach(light => {
    light.classList.toggle("dark")
  })
  swapIcon()
})
