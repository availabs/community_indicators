import CENSUS_CONFIG from "./censusConfig"

const DEFAULT_LAYOUT = {
  x: 0,
  w: 12,
  h: 12,
  static: true
}

export const maleColor = '#5588ee';
export const femaleColor = '#e68fac';

export const configLoader = BASE_CONFIG => {
  let x = 0, y = 0, h = 0;
  return BASE_CONFIG.map((config, i) => {
    if (config["broadCensusKey"]) {
      const bk = CENSUS_CONFIG[config["broadCensusKey"]];
      config.censusKeys = bk.variables.map(v => v.value);
      config.getKeyName = key => bk.variables.reduce((a, c) => c.value === key ? c.name : a, key)
      config.name = bk.name;
      config.title = bk.name;
    }
    else {
      config.getKeyName = config.getKeyName || (key => key);
    }
    if (config["left"] && config["left"].slice) {
      config["left"].keys = config.censusKeys.slice(...config["left"].slice);
    }
    if (config["right"] && config["right"].slice) {
      config["right"].keys = config.censusKeys.slice(...config["right"].slice);
    }
    config.id = i.toString();

    const layout = Object.assign({}, DEFAULT_LAYOUT, config.layout)

    if (layout.x) {
      x = layout.x;
    }
    if ((layout.w + x) > 12) {
      y += h;
      h = 0;
      x = layout.x;
    }
    h = Math.max(h, layout.h)
    config.layout = {
      ...layout,
      i: config.id,
      x,
      y
    }
    x += layout.w;

    return config;
  })
}
