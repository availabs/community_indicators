import CENSUS_CONFIG from "./censusConfig"

const DEFAULT_LAYOUT = {
  w: 12,
  h: 9,
  static: true
}

export const maleColor = '#99ccff';
export const femaleColor = '#ffafcc';

const keyRegex = /\w{6}(\w?)_(\d{3})\w/

const ALPHABET = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

const expandKeys = keys =>
  keys.reduce((a, c) => [...a, ...expandKeyRange(c)], [])
const expandKeyRange = key => {
  const split = key.split("...");
  if (split.length === 1) return split;
  const [start, end] = split,
    matchStart = keyRegex.exec(start),
    matchEnd = keyRegex.exec(end);

  if (matchStart[1] !== matchEnd[1] &&
      matchStart[2] === matchEnd[2]) {
    const s = matchStart[1],
      e = matchEnd[1],
      keys = [];
    let c = s;
    while (c <= e) {
      keys.push(start.replace(`${ s }_`, `${ c }_`));
      const index = ALPHABET.indexOf(c);
      c = ALPHABET[index + 1]
    }
    return keys;
  }
  else if (matchStart[2] !== matchEnd[2] &&
            matchStart[1] === matchEnd[1]) {
    const s = +matchStart[2],
      e = +matchEnd[2],
      keys = [];
    for (let i = s; i <= e; ++i) {
      keys.push(start.replace(`_${ matchStart[2] }`, `_${ (`000${ i }`).slice(-3) }`));
    }
    return keys;
  }
  return [start];
}

export const configLoader = BASE_CONFIG => {

  let x = 0, y = 0;

  const rects = [new Rect(0, -1, 12, 1)] // <-- this is the "ground" rect

  return BASE_CONFIG.map((config, index) => {
    if (config.type === "ProfileFooter" || config.type === "ProfileHeader") return config;

    if (config["broadCensusKey"]) {
      const bk = CENSUS_CONFIG[config["broadCensusKey"]];
      config.censusKeys = bk.variables.map(v => v.value);
      // config.getKeyName = key => bk.variables.reduce((a, c) => c.value === key ? c.name : a, key)
      config.name = bk.name;
      config.title = bk.name;
    }

    if (config["left"] && config["left"].keys &&
        config["right"] && config["right"].keys) {
      config["left"].keys =  expandKeys(config["left"].keys);
      config["right"].keys =  expandKeys(config["right"].keys);
      config["censusKeys"] = [...config["left"].keys, ...config["right"].keys];
    }
    if (config["left"] && config["left"].slice && config.censusKeys) {
      config["left"].keys = config.censusKeys.slice(...config["left"].slice);
    }
    if (config["right"] && config["right"].slice && config.censusKeys) {
      config["right"].keys = config.censusKeys.slice(...config["right"].slice);
    }

    if (config["censusKey"]) {
      config.censusKeys = [config.censusKey];
    }

    if (config["censusKeys"]) {
      config.censusKeys = expandKeys(config.censusKeys);
    }
    if (config["divisorKey"]) {
      config.divisorKeys = [config.divisorKey];
    }

    if (config["divisorKeys"] && !config["yFormat"]) {
      config.yFormat = ",.1%";
    }

    const layout = Object.assign({}, DEFAULT_LAYOUT, config.layout)

    // ensure max width of 12
    layout.w = Math.min(12, layout.w);

    if (layout.x !== undefined) {
      x = layout.x;
    }
    else if ((x + layout.w) > 12) {
      x = 0;
    }

    if (layout.y !== undefined) {
      y = layout.y;
    }
    const rect = new Rect(x, y, layout.w, layout.h);

    while (isIntersecting(rect, rects)) {
      rect.translateY(1);
    }

    if (layout.y === undefined) {
      applyGravity(rect, rects);
    }
    rects.push(rect);

    config.layout = rect.getLayout();
    x += rect.w;
    y = rects.reduce((a, c) => Math.max(c.bottom(), a), y);

    return config;
  })
}

const isIntersecting = (rect, others) =>
  others.reduce((a, c) => a || c.intersects(rect), false)

const applyGravity = (rect, others) => {
  rect.translateY(-1);

  while (!isIntersecting(rect, others)) {
    rect.translateY(-1);
  }
  rect.translateY(1);
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  getLayout() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h
    }
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.h;
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.w;
  }
  translate(x, y) {
    this.x += x;
    this.y += y;
  }
  translateX(x) {
    this.translate(x, 0);
  }
  translateY(y) {
    this.translate(0, y);
  }
  intersects(other) {
    if (this.right() <= other.left()) return false;
    if (this.left() >= other.right()) return false;
    if (this.bottom() <= other.top()) return false;
    if (this.top() >= other.bottom()) return false;
    return true;
  }
}
