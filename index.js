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

const generateLevel = (ind, o_tier, c_tier) => {
  return {
    ind: ind,
    o_tier: Number(o_tier),
    c_tier: Number(c_tier),
    add_tier: function () {
      this.c_tier++;
    },
  };
};
const createLevels = () => {
  return Object.keys(tierPoints).map((tier) =>
    Object.keys(svgPaths).map((ind) => generateLevel(ind, tier, tier))
  );
};

let levels = createLevels().flat();

const getObject = (ind, tier) => {
  return levels.find((level) => level.ind == ind && level.o_tier == tier);
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
    button.style.borderColor = colorCodes[`${obj.c_tier}`];
    button.nextSibling.textContent = `Add Points: ${tierPoints[obj.c_tier]}`;
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

const getStats = (obj, offense) => {
  const points = document.createElement("div");
  points.style.fontWeight = "bold";
  const name = document.createElement("div");
  const cPoints = document.createElement("div");
  points.classList.add("t_points");
  points.textContent = `Current Zap Points: ${totalPoints}`;
  name.textContent = `Last offense committed: ${offense}`;
  cPoints.textContent = `${offense}'s tier moved: ${
    tierPoints[obj.c_tier]
  } => ${tierPoints[obj.c_tier + 1]}`;
  return [points, name, cPoints];
};

const updateStats = (obj, offense) => {
  totalPoints += tierPoints[obj.c_tier];
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

const getFactor = (cellImgs) => {
  const setFactor = 10; // Gap between each svg
  return setFactor * (cellImgs.length - 1);
};

const setImages = (cellImgs) => {
  const factor = getFactor(cellImgs);
  const newSet = [];
  for (let i = 0; i < cellImgs.length; i++) {
    const img = cellImgs[i];
    img.style.width = `${100 - factor}%`;
    img.style.height = `${100 - factor / 2}%`;
    img.style.marginLeft = `${factor * (i / cellImgs.length)}%`;
    newSet.push(img);
  }
  return newSet;
};

const updateChart = (obj) => {
  const cell = document.querySelector(`#t${obj.o_tier}${obj.c_tier}`);
  const div = document.createElement("div");
  div.classList.add("img-container");
  div.style.backgroundImage = `url(${svgPaths[obj.c_tier]})`;
  cell.appendChild(div);
  const cellImgs = document.querySelectorAll(
    `#t${obj.o_tier}${obj.c_tier} > div`
  );
  const setImgs = setImages(cellImgs);
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
      const ind = classes[1][1];
      const tier = Number(classes[0].slice(-1));
      const obj = getObject(ind, tier);
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
