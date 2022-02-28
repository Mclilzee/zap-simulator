const tierPoints = { 0: 0, 1: 1, 2: 2, 3: 5, 4: 10 };
let total_points = 0;
let form;

const disclaimerConfirmButton = document.querySelector(
  '.disclaimerConfirmButton'
);
disclaimerConfirmButton.addEventListener('click', () => {
  document.querySelector('.disclaimerScreen').remove();
});

(function () {
  //adds tier tags
  const buttons = document.querySelectorAll('.levels button');
  buttons.forEach((button) => {
    const tag = document.createElement('span');
    tag.classList.add('tier-tag');
    button.parentNode.insertBefore(tag, button.nextSibling);
  });
})();

//if you go with the tier level I suggest the below order for Tier 0 to 10:
const svg_paths = {
  0: './images/zaps/TOPzap-shade-1.svg', //tier 0  #ffdc2f
  1: './images/zaps/TOPzap-shade-2.svg', //tier 1  #eeb434
  2: './images/zaps/TOPzap-shade-3.svg', //tier 2  #e09034
  3: './images/zaps/TOPzap-shade-4.svg', //tier 5  #d47032
  4: './images/zaps/TOPzap-shade-5.svg', //tier 10 #be1e2d
};

const color_codes = {
  0: '#ffdc2f',
  1: '#eeb434',
  2: '#e09034',
  3: '#d47032',
  4: '#be1e2d',
};

const generate_level = (ind, o_tier, c_tier) => {
  return {
    ind: ind,
    o_tier: Number(o_tier),
    c_tier: Number(c_tier),
    add_tier: function () {
      this.c_tier++;
    },
  };
};
const create_levels = () => {
  return Object.keys(tierPoints).map((tier) =>
    Object.keys(svg_paths).map((ind) => generate_level(ind, tier, tier))
  );
};

let levels = create_levels().flat();

const get_object = (ind, tier) => {
  return levels.find((level) => level.ind == ind && level.o_tier == tier);
};

const update_buttons = (form) => {
  const buttons = [...form.childNodes].filter(
    (node) => node.tagName == 'BUTTON'
  );
  buttons.forEach((button) => {
    const classes = button.classList;
    const obj = get_object(classes[1][1], classes[0][1]);
    button.style.borderColor = color_codes[`${obj.c_tier}`];
    button.nextSibling.textContent = `Add Points: ${tierPoints[obj.c_tier]}`;
  });
};

const zapButtons = document.querySelectorAll('.zapButton');

zapButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const index = Number(e.target.id.slice(-1));
    form = document.querySelector(`.lvl${index}`);
    update_buttons(form);
    form.classList.remove('hidden');
  });
});

const get_stats = (obj, offense) => {
  const points = document.createElement('div');
  points.style.fontWeight = 'bold';
  const name = document.createElement('div');
  const c_points = document.createElement('div');
  points.classList.add('t_points');
  points.textContent = `Current Zap Points: ${total_points}`;
  name.textContent = `Last offense committed: ${offense}`;
  c_points.textContent = `${offense}'s tier moved: ${
    tierPoints[obj.c_tier]
  } => ${tierPoints[obj.c_tier + 1]}`;
  return [points, name, c_points];
};

const update_stats = (obj, offense) => {
  total_points += tierPoints[obj.c_tier];
  const display_stats = document.querySelector('.zapPointsLabel');
  const stats = get_stats(obj, offense);
  display_stats.textContent = '';
  stats.forEach((stat) => {
    stat.classList.add('stat');
    display_stats.appendChild(stat);
  });
};

const update_object = (obj) => {
  obj.add_tier();
};

const get_factor = (cell_imgs) => {
  const set_factor = 10; // Gap between each svg
  return set_factor * (cell_imgs.length - 1);
};

const set_images = (cell_imgs) => {
  const factor = get_factor(cell_imgs);
  const new_set = [];
  for (let i = 0; i < cell_imgs.length; i++) {
    const img = cell_imgs[i];
    img.style.width = `${100 - factor}%`;
    img.style.height = `${100 - factor / 2}%`;
    img.style.marginLeft = `${factor * (i / cell_imgs.length)}%`;
    new_set.push(img);
  }
  return new_set;
};

const update_chart = (obj) => {
  const cell = document.querySelector(`#t${obj.o_tier}${obj.c_tier}`);
  const div = document.createElement('div');
  div.classList.add('img-container');
  div.style.backgroundImage = `url(${svg_paths[obj.c_tier]})`;
  cell.appendChild(div);
  const cell_imgs = document.querySelectorAll(
    `#t${obj.o_tier}${obj.c_tier} > div`
  );
  const set_imgs = set_images(cell_imgs);
  cell.textContent = '';
  set_imgs.forEach((image) => {
    cell.appendChild(image);
  });
};

const getBanned = () => {
  document.querySelector('.bannMessage').classList.remove('hidden');
};

const check_ban = () => {
  if (total_points > 9) {
    getBanned();
  }
};

const forms = document.querySelectorAll('.form');
forms.forEach((eachForm) => {
  // eachForm is to avoid name conflict with form
  eachForm.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const classes = e.target.classList;
      const ind = classes[1][1];
      const tier = Number(classes[0].slice(-1));
      const obj = get_object(ind, tier);
      update_chart(obj);
      update_stats(obj, e.target.textContent);
      check_ban();
      update_object(obj);
    }
    form.classList.add('hidden');
  });
});

const resetSimulator = () => {
  levels = create_levels().flat();
  total_points = 0;
  document.querySelectorAll('.cell').forEach((cell) => {
    cell.textContent = '';
  });
  document.querySelector('.zapPointsLabel').textContent =
    'Welcome, you are clean right now';
  document.querySelector('.bannMessage').classList.add('hidden');
};

const tryAgainButton = document.querySelector('.tryAgainButton');
tryAgainButton.addEventListener('click', resetSimulator);

const resetButton = document.querySelector('.resetButton');
resetButton.addEventListener('click', resetSimulator);

const timeTravelButton = document.querySelector('.timeTravelButton');

timeTravelButton.addEventListener('click', () => {
  total_points < 1 ? total_points : total_points--;
  const points = document.querySelector('.t_points');
  points ? (points.textContent = `Current Zap Points: ${total_points}`) : null;
});

const themeIconsButton = document.querySelector('.themeIcons');

themeIconsButton.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  swapThemeIcon();

  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('dark-mode', 'true');
  } else {
    localStorage.setItem('dark-mode', 'false');
  }
});

const swapThemeIcon = () => {
  const themeIcons = document.querySelectorAll('.themeSvg');
  themeIcons.forEach((icon) => icon.classList.toggle('notDisplayed'));
};

if (localStorage.getItem('dark-mode') === 'true') {
  document.documentElement.classList.add('dark');
  swapThemeIcon();
} else {
  document.documentElement.classList.remove('dark');
}
