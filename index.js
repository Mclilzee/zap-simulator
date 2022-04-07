//tuck inside of ZapSimulator factory when it's no longer needout outside of it.
const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };

//if you go with the tier level I suggest the below order for Tier 0 to 10:
//belongs in Chart once we move away from the Levels module.
const svgPaths = {
  0: "./images/zaps/TOPzap-shade-1.svg", //tier 0  #ffdc2f
  1: "./images/zaps/TOPzap-shade-2.svg", //tier 1  #eeb434
  2: "./images/zaps/TOPzap-shade-3.svg", //tier 2  #e09034
  3: "./images/zaps/TOPzap-shade-4.svg", //tier 5  #d47032
  4: "./images/zaps/TOPzap-shade-5.svg", //tier 10 #be1e2d
};

/*~~~~~~~~~~~~~~~~~~Code in this block should be phased out~~~~~~~~~~~~~~~~~~*/
let totalPoints = 0;

const Levels = (function() {
  const generateLevel = (offenceButtonIndex, offenceTier, pointsAfterOffence) => {
    return {
      offenceButtonIndex: offenceButtonIndex,
      offenceTier: Number(offenceTier),
      pointsAfterOffence: Number(pointsAfterOffence),
      add_tier: function () {
        this.pointsAfterOffence++;
      },
    };
  };

  const createLevels = () => {
    return Object.keys(tierPoints).map((tier) =>
      Object.keys(svgPaths).map((offenceButtonIndex) =>
        generateLevel(offenceButtonIndex, tier, tier)
      )
    );
  };

  const getObject = (offenceButtonIndex, tier) => {
    return levels.find(
      (level) =>
        level.offenceButtonIndex == offenceButtonIndex &&
        level.offenceTier == tier
    );
  };

  const reset = () => {
    levels = createLevels().flat()
  }

  let levels = createLevels().flat();

  return {
    getObject,
    reset,
  }
})()
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const offences = {
  //"offenceName": offenceTier
  "dogpiling": 0,
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

  "bigotry": 4,
  "continued harrassment": 4,
  "nsfw or highly offensive content": 4,
  "spamming": 4,
  "doxxing": 4,
}

function Offence(offenceName, offenceTier) {
  return {
    offenceName, 
    offenceTier: Number(offenceTier),
    pointsAfterOffence: Number(offenceTier),
    addTier: function () {
      if(this.pointsAfterOffence < 4) {
        this.pointsAfterOffence++;
      }
    },
  };
};

function createOffenceList(offences) {
  const offenceList = [];
  for(const offenceName in offences) {
    offenceList.push(Offence(offenceName, offences[offenceName]))
  }
  return offenceList
}

// Meant to be used as a factory function with 'offences' object
function ZapSimulator(offences) {
  const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
  const offenceList = createOffenceList(offences)
  let points = 0

  function _findOffence(offenceName) {
    return offenceList.find((offence) => {
      return offence.offenceName === offenceName
    });
  };

  function _isBanned() {
    if(points >= 10) {
      return true
    } else {
      return false
    }
  }

  function _reducePoint() {
    if(points > 0) {
      return --points
    } else {
      return points
    }
  }

  function commitOffence(offenceName) {
    const offence = _findOffence(offenceName)
    const pointsToAdd = tierPoints[offence.pointsAfterOffence]
    points += pointsToAdd
    offence.addTier()
    const nextPoints = tierPoints[offence.pointsAfterOffence]
    return {
      points,
      offenceCommitted: offence.offenceName,
      addedPoints: pointsToAdd,
      nextPoints,
      isBanned: _isBanned()
    }
  }

  return Object.freeze({
    commitOffence,
    waitOneWeek: _reducePoint,
    get offences() { return offenceList.map(offence => offence.offenceName) },
    get points() {return points}
  })
}

/* These Two Functions use functions a variety of modules. */
const addOffenceAndUpdateDOM = (event) => {
  if (event.target.tagName === "BUTTON") {
    const classes = event.target.classList;
    const offenceButtonIndex = classes[1][1];
    const tier = Number(classes[0].slice(-1));
    const offenceObject = Levels.getObject(offenceButtonIndex, tier);
    ChartController.updateChart(offenceObject);
    StatsController.updateStats(offenceObject, event.target.textContent);
    FormController.checkBan();
    offenceObject.add_tier();
  }
  FormController.form.classList.add("hidden");
};

const resetSimulator = () => {
  Levels.reset()
  totalPoints = 0;
  // resets chart
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
  });
  // resets Stats
  document.querySelector(".zapPointsLabel").textContent =
    "Welcome, you are clean right now";
  // hides ban message
  document.querySelector(".bannMessage").classList.add("hidden");
};

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
      button.style.borderColor = colorCodes[`${obj.pointsAfterOffence}`];
      button.nextSibling.textContent = `Add Points: ${
        tierPoints[obj.pointsAfterOffence]
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
    eachForm.addEventListener("click", (event) => addOffenceAndUpdateDOM(event));
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

  const updateChart = (offenceObject) => {
    const cell = document.querySelector(
      `#t${offenceObject.offenceTier}${offenceObject.pointsAfterOffence}`
    );
    const div = document.createElement("div");
    div.classList.add("img-container");
    div.style.backgroundImage = `url(${
      svgPaths[offenceObject.pointsAfterOffence]
    })`;
    cell.appendChild(div);
    const allCellImages = document.querySelectorAll(
      `#t${offenceObject.offenceTier}${offenceObject.pointsAfterOffence} > div`
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
  const getStats = (obj, offenceType) => {
    const currentPoints = document.createElement("div");
    currentPoints.style.fontWeight = "bold";
    const name = document.createElement("div");
    const afterOffencePoints = document.createElement("div");
    currentPoints.classList.add("t_points");
    currentPoints.textContent = `Current Zap Points: ${totalPoints}`;
    name.textContent = `Last offence committed: ${offenceType}`;
    afterOffencePoints.textContent = `${offenceType}'s tier moved: ${
      tierPoints[obj.pointsAfterOffence]
    } => ${tierPoints[obj.pointsAfterOffence + 1]}`;
    return [currentPoints, name, afterOffencePoints];
  };

  const updateStats = (offenceObject, offenceType) => {
    totalPoints += tierPoints[offenceObject.pointsAfterOffence];
    const displayStats = document.querySelector(".zapPointsLabel");
    const stats = getStats(offenceObject, offenceType);
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