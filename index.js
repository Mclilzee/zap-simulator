const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
let totalPoints = 0;

//if you go with the tier level I suggest the below order for Tier 0 to 10:
const svgPaths = {
  0: "./images/zaps/TOPzap-shade-1.svg", //tier 0  #ffdc2f
  1: "./images/zaps/TOPzap-shade-2.svg", //tier 1  #eeb434
  2: "./images/zaps/TOPzap-shade-3.svg", //tier 2  #e09034
  3: "./images/zaps/TOPzap-shade-4.svg", //tier 5  #d47032
  4: "./images/zaps/TOPzap-shade-5.svg", //tier 10 #be1e2d
};

/* These Two Functions use functions a variety of modules. */
const addOffenseAndUpdateDOM = (event) => {
  if (event.target.tagName === "BUTTON") {
    const classes = event.target.classList;
    const offenseButtonIndex = classes[1][1];
    const tier = Number(classes[0].slice(-1));
    const offenseObject = Levels.getObject(offenseButtonIndex, tier);
    ChartController.updateChart(offenseObject);
    StatsController.updateStats(offenseObject, event.target.textContent);
    FormController.checkBan();
    offenseObject.add_tier();
  }
  FormController.form.classList.add("hidden");
};

const resetSimulator = () => {
  Levels.levels = Levels.createLevels().flat();
  totalPoints = 0;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
  });
  document.querySelector(".zapPointsLabel").textContent =
    "Welcome, you are clean right now";
  document.querySelector(".bannMessage").classList.add("hidden");
};

const Levels = (function() {
  const generateLevel = (offenseButtonIndex, offenseTier, pointsAfterOffense) => {
    return {
      offenseButtonIndex: offenseButtonIndex,
      offenseTier: Number(offenseTier),
      pointsAfterOffense: Number(pointsAfterOffense),
      add_tier: function () {
        this.pointsAfterOffense++;
      },
    };
  };

  const createLevels = () => {
    return Object.keys(tierPoints).map((tier) =>
      Object.keys(svgPaths).map((offenseButtonIndex) =>
        generateLevel(offenseButtonIndex, tier, tier)
      )
    );
  };

  const getObject = (offenseButtonIndex, tier) => {
    return levels.find(
      (level) =>
        level.offenseButtonIndex == offenseButtonIndex &&
        level.offenseTier == tier
    );
  };

  let levels = createLevels().flat();

  return {
    getObject,
    createLevels,
    get levels() {return levels},
    set levels(newLevels) {levels = newLevels}
  }
})()

const FormController = (function() {
  let form;
  const colorCodes = {
    0: "#ffdc2f",
    1: "#eeb434",
    2: "#e09034",
    3: "#d47032",
    4: "#be1e2d",
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
      const obj = Levels.getObject(classes[1][1], classes[0][1]);
      button.style.borderColor = colorCodes[`${obj.pointsAfterOffense}`];
      button.nextSibling.textContent = `Add Points: ${
        tierPoints[obj.pointsAfterOffense]
      }`;
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

  const dismissDisclaimerScreen = () => {
    document.querySelector(".disclaimerScreen").remove();
  };

  const displayFormWithUpdatedPoints = (event) => {
    const index = Number(event.target.id.slice(-1));
    form = document.querySelector(`.lvl${index}`);
    updateButtons(form);
    form.classList.remove("hidden");
  };

  const disclaimerConfirmButton = document.querySelector(
    ".disclaimerConfirmButton"
  );
  disclaimerConfirmButton.addEventListener("click", dismissDisclaimerScreen);

  const forms = document.querySelectorAll(".form");
  forms.forEach((eachForm) => {
    // eachForm is to avoid name conflict with form
    eachForm.addEventListener("click", (event) => addOffenseAndUpdateDOM(event));
  });

  const zapButtons = document.querySelectorAll(".zapButton");
  zapButtons.forEach((button) => {
    button.addEventListener("click", (event) =>
      displayFormWithUpdatedPoints(event)
    );
  });

  const tryAgainButton = document.querySelector(".tryAgainButton");
  tryAgainButton.addEventListener("click", resetSimulator);

  (function addTierTags() {
    const buttons = document.querySelectorAll(
      ".levels .combinedOffencesContainer .offenceContainer button"
    );
    buttons.forEach((button) => {
      const tag = document.createElement("span");
      tag.classList.add("tier-tag");
      button.parentNode.insertBefore(tag, button.nextSibling);
    });
  })();

  return {
    checkBan,
    get form() {return form}
  }
})()

const ChartController = (function() {
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

  const updateChart = (offenseObject) => {
    const cell = document.querySelector(
      `#t${offenseObject.offenseTier}${offenseObject.pointsAfterOffense}`
    );
    const div = document.createElement("div");
    div.classList.add("img-container");
    div.style.backgroundImage = `url(${
      svgPaths[offenseObject.pointsAfterOffense]
    })`;
    cell.appendChild(div);
    const allCellImages = document.querySelectorAll(
      `#t${offenseObject.offenseTier}${offenseObject.pointsAfterOffense} > div`
    );
    const setImgs = setImages(allCellImages);
    cell.textContent = "";
    setImgs.forEach((image) => {
      cell.appendChild(image);
    });
  };

  return {
    updateChart
  }
})()

const StatsController = (function() {
  const getStats = (obj, offenseType) => {
    const currentPoints = document.createElement("div");
    currentPoints.style.fontWeight = "bold";
    const name = document.createElement("div");
    const afterOffensePoints = document.createElement("div");
    currentPoints.classList.add("t_points");
    currentPoints.textContent = `Current Zap Points: ${totalPoints}`;
    name.textContent = `Last offense committed: ${offenseType}`;
    afterOffensePoints.textContent = `${offenseType}'s tier moved: ${
      tierPoints[obj.pointsAfterOffense]
    } => ${tierPoints[obj.pointsAfterOffense + 1]}`;
    return [currentPoints, name, afterOffensePoints];
  };

  const updateStats = (offenseObject, offenseType) => {
    totalPoints += tierPoints[offenseObject.pointsAfterOffense];
    const displayStats = document.querySelector(".zapPointsLabel");
    const stats = getStats(offenseObject, offenseType);
    displayStats.textContent = "";
    stats.forEach((stat) => {
      stat.classList.add("stat");
      displayStats.appendChild(stat);
    });
  };

  const reducePointAndUpdateDOM = () => {
    totalPoints < 1 ? totalPoints : totalPoints--;
    const points = document.querySelector(".t_points");
    points ? (points.textContent = `Current Zap Points: ${totalPoints}`) : null;
  };

  const resetButton = document.querySelector(".resetButton");
  resetButton.addEventListener("click", resetSimulator);

  const timeTravelButton = document.querySelector(".timeTravelButton");
  timeTravelButton.addEventListener("click", reducePointAndUpdateDOM);

  return {
    updateStats
  }
})()

const ThemeController = (function() {
  const changeThemeAndSave = () => {
    document.documentElement.classList.toggle("dark");
    swapThemeIcon();

    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("dark-mode", "true");
    } else {
      localStorage.setItem("dark-mode", "false");
    }
  };

  const checkLocalStorageTheme = () => {
    if (localStorage.getItem("dark-mode") === "true") {
      document.documentElement.classList.add("dark");
      swapThemeIcon();
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const swapThemeIcon = () => {
    const themeIcons = document.querySelectorAll(".themeSvg");
    themeIcons.forEach((icon) => icon.classList.toggle("notDisplayed"));
  };

  const themeIconsButton = document.querySelector(".themeIcons");
  themeIconsButton.addEventListener("click", changeThemeAndSave);
  checkLocalStorageTheme();
})()