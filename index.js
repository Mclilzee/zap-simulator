const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
let totalPoints = 0;
let form;

const disclaimerConfirmButton = document.querySelector(
  ".disclaimerConfirmButton"
);
disclaimerConfirmButton.addEventListener("click", () => {
  document.querySelector(".disclaimerScreen").remove();
});

(function () {
  //adds tier tags
  const buttons = document.querySelectorAll(
    ".levels .combinedOffencesContainer .offenceContainer button"
  );
  buttons.forEach((button) => {
    const tag = document.createElement("span");
    tag.classList.add("tier-tag");
    button.parentNode.insertBefore(tag, button.nextSibling);
  });
})();

//if you go with the tier level I suggest the below order for Tier 0 to 10:
const svgPaths = {
  0: "./images/zaps/TOPzap-shade-1.svg", //tier 0  #ffdc2f
  1: "./images/zaps/TOPzap-shade-2.svg", //tier 1  #eeb434
  2: "./images/zaps/TOPzap-shade-3.svg", //tier 2  #e09034
  3: "./images/zaps/TOPzap-shade-4.svg", //tier 5  #d47032
  4: "./images/zaps/TOPzap-shade-5.svg", //tier 10 #be1e2d
};

const colorCodes = {
  0: "#ffdc2f",
  1: "#eeb434",
  2: "#e09034",
  3: "#d47032",
  4: "#be1e2d",
};

const generateLevel = (offenseButtonIndex, offenseTier, tierAfterOffense) => {
  return {
    offenseButtonIndex: offenseButtonIndex,
    offenseTier: Number(offenseTier),
    tierAfterOffense: Number(tierAfterOffense),
    add_tier: function () {
      this.tierAfterOffense++;
    },
  };
};
const createLevels = () => {
  return Object.keys(tierPoints).map((tier) =>
    Object.keys(svgPaths).map((offenseButtonIndex) => generateLevel(offenseButtonIndex, tier, tier))
  );
};

let levels = createLevels().flat();

const getObject = (offenseButtonIndex, tier) => {
  return levels.find((level) => level.offenseButtonIndex == offenseButtonIndex && level.offenseTier == tier);
};

const updateButtons = (form) => {
  const combinedOffencesContainer = form.lastElementChild;

  let buttons = [];
  [...combinedOffencesContainer.childNodes].forEach((element) => {
    const button = [...element.childNodes].filter(
      (node) => node.tagName == "BUTTON"
    );
    buttons = [...buttons, ...button];
  });

  buttons.forEach((button) => {
    const classes = button.classList;
    const obj = getObject(classes[1][1], classes[0][1]);
    button.style.borderColor = colorCodes[`${obj.tierAfterOffense}`];
    button.nextSibling.textContent = `Add Points: ${tierPoints[obj.tierAfterOffense]}`;
  });
};

const zapButtons = document.querySelectorAll(".zapButton");

zapButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const index = Number(e.target.id.slice(-1));
    form = document.querySelector(`.lvl${index}`);
    updateButtons(form);
    form.classList.remove("hidden");
  });
});

const getStats = (obj, offenseType) => {
  const currentPoints = document.createElement("div");
  currentPoints.style.fontWeight = "bold";
  const name = document.createElement("div");
  const afterOffensePoints = document.createElement("div");
  currentPoints.classList.add("t_points");
  currentPoints.textContent = `Current Zap Points: ${totalPoints}`;
  name.textContent = `Last offense committed: ${offenseType}`;
  afterOffensePoints.textContent = `${offenseType}'s tier moved: ${
    tierPoints[obj.tierAfterOffense]
  } => ${tierPoints[obj.tierAfterOffense + 1]}`;
  return [currentPoints, name, afterOffensePoints];
};

const updateStats = (obj, offense) => {
  totalPoints += tierPoints[obj.tierAfterOffense];
  const displayStats = document.querySelector(".zapPointsLabel");
  const stats = getStats(obj, offense);
  displayStats.textContent = "";
  stats.forEach((stat) => {
    stat.classList.add("stat");
    displayStats.appendChild(stat);
  });
};

const updateObject = (obj) => {
  obj.add_tier();
};

const getFactor = (allCellImages) => {
  const setFactor = 10; // Gap between each svg
  return setFactor * (allCellImages.length - 1);
};

const setImages = (allCellImages) => {
  const factor = getFactor(allCellImages);
  const newSet = [];
  for (let i = 0; i < allCellImages.length; i++) {
    const currentImage = allCellImages[i];
    currentImage.style.width = `${100 - factor}%`;
    currentImage.style.height = `${100 - factor / 2}%`;
    currentImage.style.marginLeft = `${factor * (i / allCellImages.length)}%`;
    newSet.push(currentImage);
  }
  return newSet;
};

const updateChart = (obj) => {
  const cell = document.querySelector(`#t${obj.offenseTier}${obj.tierAfterOffense}`);
  const div = document.createElement("div");
  div.classList.add("img-container");
  div.style.backgroundImage = `url(${svgPaths[obj.tierAfterOffense]})`;
  cell.appendChild(div);
  const allCellImages = document.querySelectorAll(
    `#t${obj.offenseTier}${obj.tierAfterOffense} > div`
  );
  const setImgs = setImages(allCellImages);
  cell.textContent = "";
  setImgs.forEach((image) => {
    cell.appendChild(image);
  });
};

const getBanned = () => {
  document.querySelector(".bannMessage").classList.remove("hidden");
};

const checkBan = () => {
  if (totalPoints > 9) {
    getBanned();
  }
};

const forms = document.querySelectorAll(".form");
forms.forEach((eachForm) => {
  // eachForm is to avoid name conflict with form
  eachForm.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const classes = e.target.classList;
      const offenseButtonIndex = classes[1][1];
      const tier = Number(classes[0].slice(-1));
      const obj = getObject(offenseButtonIndex, tier);
      updateChart(obj);
      updateStats(obj, e.target.textContent);
      checkBan();
      updateObject(obj);
    }
    form.classList.add("hidden");
  });
});

const resetSimulator = () => {
  levels = createLevels().flat();
  totalPoints = 0;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
  });
  document.querySelector(".zapPointsLabel").textContent =
    "Welcome, you are clean right now";
  document.querySelector(".bannMessage").classList.add("hidden");
};

const tryAgainButton = document.querySelector(".tryAgainButton");
tryAgainButton.addEventListener("click", resetSimulator);

const resetButton = document.querySelector(".resetButton");
resetButton.addEventListener("click", resetSimulator);

const timeTravelButton = document.querySelector(".timeTravelButton");

timeTravelButton.addEventListener("click", () => {
  totalPoints < 1 ? totalPoints : totalPoints--;
  const points = document.querySelector(".t_points");
  points ? (points.textContent = `Current Zap Points: ${totalPoints}`) : null;
});

const themeIconsButton = document.querySelector(".themeIcons");

themeIconsButton.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  swapThemeIcon();

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("dark-mode", "true");
  } else {
    localStorage.setItem("dark-mode", "false");
  }
});

const swapThemeIcon = () => {
  const themeIcons = document.querySelectorAll(".themeSvg");
  themeIcons.forEach((icon) => icon.classList.toggle("notDisplayed"));
};

if (localStorage.getItem("dark-mode") === "true") {
  document.documentElement.classList.add("dark");
  swapThemeIcon();
} else {
  document.documentElement.classList.remove("dark");
}
