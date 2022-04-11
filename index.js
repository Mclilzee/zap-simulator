const offences = {
  //"offenceName": offenceTier
  dogpiling: 0,
  "discussing windows": 0,
  "chat bombing": 0,
  "discussing mental health issues": 0,
  "inappropriate profile": 0,

  "mini-modding": 1,
  "requesting out of scope help": 1,
  "mild unprofessionalism": 1,

  "discussing piracy": 2,
  "unsolicited pings/dms": 2,
  "discussing politics/religion": 2,
  "mild toxicity": 2,
  "self promoting without permission": 2,

  "discussing illegal activities": 3,
  "arguing over moderation": 3,
  "excessive toxicity": 3,

  bigotry: 4,
  "continued harrassment": 4,
  "nsfw or highly offensive content": 4,
  spamming: 4,
  doxxing: 4,
};

function Offence(offenceName, offenceTier) {
  return {
    offenceName,
    offenceTier: Number(offenceTier),
    pointsAfterOffence: Number(offenceTier),
    addTier: function () {
      if (this.pointsAfterOffence < 4) {
        this.pointsAfterOffence++;
      }
    },
  };
}

function createOffenceList(offences) {
  const offenceList = [];
  for (const offenceName in offences) {
    offenceList.push(Offence(offenceName, offences[offenceName]));
  }
  return offenceList;
}

// Meant to be used as a factory function with 'offences' object
function ZapSimulator(offences) {
  const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
  let offenceList = createOffenceList(offences);
  let points = 0;

  function _findOffence(offenceName) {
    return offenceList.find((offence) => {
      return offence.offenceName === offenceName;
    });
  }

  function _isBanned() {
    if (points >= 10) {
      return true;
    } else {
      return false;
    }
  }

  function _reducePoint() {
    if (points > 0) {
      return --points;
    } else {
      return points;
    }
  }

  function commitOffence(offenceName) {
    const offence = _findOffence(offenceName);
    const pointsToAdd = tierPoints[offence.pointsAfterOffence];
    points += pointsToAdd;
    const severityLevel = offence.pointsAfterOffence;
    offence.addTier();
    const nextPoints = tierPoints[offence.pointsAfterOffence];
    return {
      points,
      offenceCommitted: offence.offenceName,
      addedPoints: pointsToAdd,
      nextPoints,
      severityLevel,
      offenceTier: offence.offenceTier,
      isBanned: _isBanned(),
    };
  }

  function reset() {
    points = 0;
    offenceList = createOffenceList(offences);
  }

  return Object.freeze({
    commitOffence,
    reset,
    waitOneWeek: _reducePoint,
    get offences() {
      return offenceList.map((offence) => offence.offenceName);
    },
    get offencesList() {
      return offenceList;
    },
    get points() {
      return points;
    },
    get tierPoints() {
      return tierPoints;
    },
  });
}

const FormController = function (app) {
  let form;
  let banMessageShown = false;
  const colorCodes = {
    0: "#ffdc2f",
    1: "#eeb434",
    2: "#e09034",
    3: "#d47032",
    4: "#be1e2d",
  };

  const updateButtons = (form) => {
    const combinedOffencesContainer = form.lastElementChild;
    const offencesList = app.offencesList;

    let buttons = [];
    [...combinedOffencesContainer.childNodes].forEach((element) => {
      const button = [...element.childNodes].filter(
        (node) => node.tagName == "BUTTON"
      );
      buttons = [...buttons, ...button];
    });

    buttons.forEach((button) => {
      const offenceName = button.textContent.toLowerCase();
      const offence = offencesList.find(
        (offence) => offence.offenceName === offenceName
      );

      button.style.borderColor = colorCodes[`${offence.pointsAfterOffence}`];
      button.nextSibling.textContent = `Add Points: ${
        app.tierPoints[offence.pointsAfterOffence]
      }`;
    });
  };

  const displayFormWithUpdatedPoints = (event) => {
    const index = Number(event.target.id.slice(-1));
    form = document.querySelector(`.lvl${index}`);
    updateButtons(form);
    form.classList.remove("hidden");
  };

  const zapButtons = document.querySelectorAll(".zapButton");
  zapButtons.forEach((button) => {
    button.addEventListener("click", (event) =>
      displayFormWithUpdatedPoints(event)
    );
  });

  const tryAgainButton = document.querySelector(".tryAgainButton");
  const resetButton = document.querySelector(".resetButton");

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

  const dismissDisclaimerScreen = () => {
    document.querySelector(".disclaimerScreen").remove();
  };

  const disclaimerConfirmButton = document.querySelector(
    ".disclaimerConfirmButton"
  );
  disclaimerConfirmButton.addEventListener("click", dismissDisclaimerScreen);

  const allForms = document.querySelectorAll(".form");

  const hideDisplayedForm = () => {
    form.classList.add("hidden");
  };

  // Use during development
  // dismissDisclaimerScreen();

  const hideBanMessage = () => {
    document.querySelector(".bannMessage").classList.add("hidden");
    banMessageShown = false;
  };

  const showBanMessage = () => {
    document.querySelector(".bannMessage").classList.remove("hidden");
    banMessageShown = true;
  };

  return {
    get form() {
      return form;
    },
    get tryAgainButton() {
      return tryAgainButton;
    },
    get resetButton() {
      return resetButton;
    },
    get banMessageShown() {
      return banMessageShown;
    },
    get allForms() {
      return allForms;
    },
    showBanMessage,
    hideBanMessage,
    hideDisplayedForm,
  };
};

const ChartController = function () {
  const svgPaths = {
    0: "./images/zaps/TOPzap-shade-1.svg", //tier 0  #ffdc2f
    1: "./images/zaps/TOPzap-shade-2.svg", //tier 1  #eeb434
    2: "./images/zaps/TOPzap-shade-3.svg", //tier 2  #e09034
    3: "./images/zaps/TOPzap-shade-4.svg", //tier 5  #d47032
    4: "./images/zaps/TOPzap-shade-5.svg", //tier 10 #be1e2d
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

  const updateChart = (offenceObject) => {
    const cell = document.querySelector(
      `#t${offenceObject.offenceTier}${offenceObject.severityLevel}`
    );
    const div = document.createElement("div");
    div.classList.add("img-container");
    div.style.backgroundImage = `url(${svgPaths[offenceObject.severityLevel]})`;
    cell.appendChild(div);
    const allCellImages = document.querySelectorAll(
      `#t${offenceObject.offenceTier}${offenceObject.severityLevel} > div`
    );
    const setImgs = setImages(allCellImages);
    cell.textContent = "";
    setImgs.forEach((image) => {
      cell.appendChild(image);
    });
  };

  const resetChart = () => {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
    });
  };

  return {
    updateChart,
    resetChart,
  };
};

const StatsController = function (app) {
  const getStats = (obj, offenceType) => {
    const currentPoints = document.createElement("div");
    currentPoints.style.fontWeight = "bold";
    const name = document.createElement("div");
    const afterOffencePoints = document.createElement("div");
    currentPoints.classList.add("t_points");
    currentPoints.textContent = `Current Zap Points: ${obj.points}`;
    name.textContent = `Last offence committed: ${offenceType}`;
    afterOffencePoints.textContent = `${offenceType}'s tier moved: ${obj.addedPoints} => ${obj.nextPoints}`;
    return [currentPoints, name, afterOffencePoints];
  };

  const updateStats = (offenceObject, offenceType) => {
    const displayStats = document.querySelector(".zapPointsLabel");
    const stats = getStats(offenceObject, offenceType);
    displayStats.textContent = "";
    stats.forEach((stat) => {
      stat.classList.add("stat");
      displayStats.appendChild(stat);
    });
  };

  const reducePointAndUpdateDOM = () => {
    app.waitOneWeek();
    const points = document.querySelector(".t_points");
    points ? (points.textContent = `Current Zap Points: ${app.points}`) : null;
  };

  const timeTravelButton = document.querySelector(".timeTravelButton");
  timeTravelButton.addEventListener("click", reducePointAndUpdateDOM);

  const resetStats = () => {
    document.querySelector(".zapPointsLabel").textContent =
      "Welcome, you are clean right now";
  };

  return {
    updateStats,
    resetStats,
  };
};

const ThemeController = (function () {
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
})();

const ScreenController = (function () {
  const app = ZapSimulator(offences);
  const form = FormController(app);
  const chart = ChartController();
  const stats = StatsController(app);

  const resetSimulator = () => {
    if (app.points >= 10) {
      form.hideBanMessage();
    }
    app.reset();
    stats.resetStats();
    chart.resetChart();
  };

  form.resetButton.addEventListener("click", resetSimulator);
  form.tryAgainButton.addEventListener("click", resetSimulator);

  const updateScreen = (event) => {
    if (event.target.tagName === "BUTTON") {
      const offenceName = event.target.textContent;
      const offenceObject = app.commitOffence(offenceName.toLowerCase());

      chart.updateChart(offenceObject);
      stats.updateStats(offenceObject, offenceName);

      if (offenceObject.isBanned) {
        form.showBanMessage();
      }
    }
    form.hideDisplayedForm();
  };

  form.allForms.forEach((eachForm) => {
    eachForm.addEventListener("click", updateScreen);
  });
})();
