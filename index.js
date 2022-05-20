const offenceTiers = [
  {
    tier: 0,
    zaps: 0,
    offences: [
      "dogpiling",
      "discussing windows",
      "chat bombing",
      "discussing mental health issues",
      "inappropriate profile",
    ],
  },
  {
    tier: 1,
    zaps: 1,
    offences: [
      "mini-modding",
      "requesting out of scope help",
      "mild unprofessionalism",
    ],
  },
  {
    tier: 2,
    zaps: 2,
    offences: [
      "discussing piracy",
      "unsolicited pings/dms",
      "discussing politics/religion",
      "mild toxicity",
      "self promoting without permission",
    ],
  },
  {
    tier: 3,
    zaps: 5,
    offences: [
      "discussing illegal activities",
      "arguing over moderation",
      "excessive toxicity",
    ],
  },
  {
    tier: 4,
    zaps: 10,
    offences: [
      "bigotry",
      "continued harrassment",
      "nsfw or highly offensive content",
      "spamming",
      "doxxing",
    ],
  },
];

function ZapSimulator(offenceTiers) {
  let points = 0;
  let committedOffences = {};

  function _findTier(offenceName) {
    for (let i = 0; i < offenceTiers.length; i++) {
      if (offenceTiers[i].offences.includes(offenceName)) {
        return offenceTiers[i].tier
      }
    }
  }

  function reset() {
    points = 0;
    committedOffences = {};
  }

  function _isBanned() {
    if (points >= 10) {
      return true;
    } else {
      return false;
    }
  }

  function _calculatePoints(tier, timesCommitted) {
    if (tier + timesCommitted >= offenceTiers.length) {
      return offenceTiers[offenceTiers.length - 1].zaps
    } else {
      return offenceTiers[tier + timesCommitted].zaps;
    }
  }

  function _updateTimesCommitted(offenceName) {
    if (!committedOffences[offenceName]) {
      committedOffences[offenceName] = 1;
    } else {
      ++committedOffences[offenceName];
    }

    return committedOffences[offenceName];
  }

  function _reducePoint() {
    if (points > 0) {
      return --points;
    } else {
      return points;
    }
  }

  function commitOffence(offenceName) {
    const offenceTier = _findTier(offenceName);
    if (offenceTier === undefined) return;

    const previousTimesCommitted = committedOffences[offenceName]
      ? committedOffences[offenceName]
      : 0;

    const pointsToAdd = _calculatePoints(offenceTier, previousTimesCommitted);

    points += pointsToAdd;

    const severityLevel =
     offenceTier + previousTimesCommitted >= offenceTiers.length
        ? offenceTiers.length - 1
        : offenceTier + previousTimesCommitted;

    _updateTimesCommitted(offenceName);

    const newTimesCommitted = committedOffences[offenceName];
    const nextPoints = _calculatePoints(offenceTier, newTimesCommitted);

    return {
      points,
      offenceCommitted: offenceName,
      addedPoints: pointsToAdd,
      nextPoints,
      severityLevel,
      offenceTier: offenceTier,
      isBanned: _isBanned(),
    };
  }

  return Object.freeze({
    commitOffence,
    reset,
    waitOneWeek: _reducePoint,
    tierPoints: offenceTiers.reduce((object, tier, index) => {
      object[index] = tier.zaps;
      return object;
    }, {}), // {0: 0, 1: 1, 2: 2, 3: 5, 4: 10};
    get points() {
      return points;
    },
  });
};

const form = (function () {
  let form;
  let tierTagsAdded = false;
  const colorCodes = {
    0: "#ffdc2f",
    1: "#eeb434",
    2: "#e09034",
    3: "#d47032",
    4: "#be1e2d",
  };

  function addTierTags() {
    if(tierTagsAdded === true) return
    const buttons = document.querySelectorAll(
      ".levels .combined-offences-container .offence-container button"
    );
    buttons.forEach((button) => {
      const tag = document.createElement("span");
      tag.classList.add("tier-tag");
      button.parentNode.insertBefore(tag, button.nextSibling);
    });
    tierTagsAdded = true
  }

  function initializeButtonText(tierPoints) {
    addTierTags()
    allForms.forEach( (form, index) => {
      const buttons = form.querySelectorAll('button')
      buttons.forEach(button => {
        button.nextSibling.textContent = `Add Points: ${tierPoints[index]}`;
        button.style.borderColor = colorCodes[`${index}`];
      })
    })
  }

  const updateForm = (offenceObject) => {
    const allButtons = Array.from(document.querySelectorAll("button"));
    const updateButton = allButtons.find(
      (button) =>
        button.textContent.toLowerCase() === offenceObject.offenceCommitted
    );
    updateButton.style.borderColor =
      colorCodes[offenceObject.severityLevel + 1];
    updateButton.nextSibling.textContent = `Add Points: ${offenceObject.nextPoints}`;
    hideDisplayedForm();
  };

  const displayForm = (event) => {
    const index = Number(event.target.id.slice(-1));
    form = document.querySelector(`.lvl${index}`);
    form.classList.remove("hidden");
  };

  const zapButtons = document.querySelectorAll(".zap-button");

  zapButtons.forEach((button) => {
    button.addEventListener("click", displayForm);
  });

  const tryAgainButton = document.querySelector(".try-again-button");
  const resetButton = document.querySelector(".reset-button");

  const dismissDisclaimerScreen = () => {
    document.querySelector(".disclaimer-screen").remove();
  };

  const disclaimerConfirmButton = document.querySelector(
    ".disclaimer-confirm-button"
  );
  disclaimerConfirmButton.addEventListener("click", dismissDisclaimerScreen);

  const allForms = document.querySelectorAll(".form");

  const hideDisplayedForm = () => {
    form.classList.add("hidden");
  };

  const hideBanMessage = () => {
    document.querySelector(".ban-message").classList.add("hidden");
  };

  const showBanMessage = () => {
    document.querySelector(".ban-message").classList.remove("hidden");
  };

  document.querySelectorAll(".close-svg").forEach((closeButton) => {
    closeButton.addEventListener("click", hideDisplayedForm);
  });

  const resetForm = (tierPoints) => {
    hideBanMessage();
    initializeButtonText(tierPoints);
  };

  return {
    get tryAgainButton() {
      return tryAgainButton;
    },
    get resetButton() {
      return resetButton;
    },
    get allForms() {
      console.log(allForms)
      return allForms;
    },
    showBanMessage,
    updateForm,
    initializeButtonText,
    resetForm,
  };
})();

const chart = (function () {
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
})();

const stats = (function () {
  const getStats = (obj) => {
    const currentPoints = document.createElement("div");
    currentPoints.style.fontWeight = "bold";
    const name = document.createElement("div");
    const afterOffencePoints = document.createElement("div");
    currentPoints.classList.add("t_points");
    currentPoints.textContent = `Current Zap Points: ${obj.points}`;
    name.textContent = `Last offence committed: ${obj.offenceCommitted}`;
    afterOffencePoints.textContent = `${obj.offenceCommitted}'s tier moved: ${obj.addedPoints} => ${obj.nextPoints}`;
    return [currentPoints, name, afterOffencePoints];
  };

  const updateStats = (offenceObject) => {
    const displayStats = document.querySelector(".zap-points-label");
    const stats = getStats(offenceObject);
    displayStats.textContent = "";
    stats.forEach((stat) => {
      stat.classList.add("stat");
      displayStats.appendChild(stat);
    });
  };

  const waitWeekUpdateDOM = (appPoints) => {
    const points = document.querySelector(".t_points");
    points ? (points.textContent = `Current Zap Points: ${appPoints}`) : null;
  };

  const timeTravelButton = document.querySelector(".time-travel-button");

  const resetStats = () => {
    document.querySelector(".zap-points-label").textContent =
      "Welcome, you are clean right now";
  };

  return {
    updateStats,
    resetStats,
    waitWeekUpdateDOM,
    get timeTravelButton() {
      return timeTravelButton;
    },
  };
})();

const Theme = (function () {
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
    const themeIcons = document.querySelectorAll(".theme-svg");
    themeIcons.forEach((icon) => icon.classList.toggle("not-displayed"));
  };

  const themeIconsButton = document.querySelector(".theme-icons");
  themeIconsButton.addEventListener("click", changeThemeAndSave);
  checkLocalStorageTheme();
})();

const ScreenController = (function () {
  const app = ZapSimulator(offenceTiers);

  form.initializeButtonText(app.tierPoints);

  const resetSimulator = () => {
    form.resetForm(app.tierPoints);
    app.reset();
    stats.resetStats();
    chart.resetChart();
  };

  const waitOneWeek = () => {
    app.waitOneWeek();
    stats.waitWeekUpdateDOM(app.points);
  };

  form.resetButton.addEventListener("click", resetSimulator);
  form.tryAgainButton.addEventListener("click", resetSimulator);
  stats.timeTravelButton.addEventListener("click", waitOneWeek);

  const updateScreen = (event) => {
    if (event.target.tagName === "BUTTON") {
      const offenceName = event.target.textContent;
      const offenceObject = app.commitOffence(offenceName.toLowerCase());

      chart.updateChart(offenceObject);
      stats.updateStats(offenceObject);
      form.updateForm(offenceObject);

      if (offenceObject.isBanned) {
        form.showBanMessage();
      }
    }
  };

  form.allForms.forEach((eachForm) => {
    eachForm.addEventListener("click", updateScreen);
  });
})();
