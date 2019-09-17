import CENSUS_CONFIG from "./censusConfig"

const DEFAULT_LAYOUT = {
  w: 12,
  h: 9,
  static: true
}

export const maleColor = '#5588ee';
export const femaleColor = '#e68fac';

export const configLoader = BASE_CONFIG => {

  let x = 0, y = 0;

  const rects = [new Rect(0, -1, 12, 1)] // <-- this is the "ground" rect

  return BASE_CONFIG.map(config => {
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

    const layout = Object.assign({}, DEFAULT_LAYOUT, config.layout)

    // ensure max width of 12
    layout.w = Math.min(12, layout.w);

    if (layout.x !== undefined) {
      x = layout.x;
    }
    else if ((x + layout.w) > 12) {
      x = 0;
    }

    const rect = new Rect(x, y, layout.w, layout.h);

    while (isIntersecting(rect, rects)) {
      rect.translateY(1);
    }
    rects.push(rect);

    applyGravity(rects);

    config.layout = rect.getLayout();
    x += layout.w;
    y = rects.reduce((a, c) => Math.max(c.bottom(), a), y);

    return config;
  })
}

const isIntersecting = (rect, rects) =>
  rects.reduce((a, c) => a || c.intersects(rect), false)

const applyGravity = rects => {
  for (let i = 1; i < rects.length; ++i) {
    const rect = rects[i],
      others = rects.filter((r, ii) => i !== ii);

    rect.translateY(-1);

    while (!isIntersecting(rect, others)) {
      rect.translateY(-1);
    }
    rect.translateY(1);
  }
}

export class Rect {
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
