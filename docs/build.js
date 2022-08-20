"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/bresenham/index.js
  var require_bresenham = __commonJS({
    "node_modules/bresenham/index.js"(exports, module) {
      module.exports = function(x0, y0, x1, y1, fn) {
        if (!fn) {
          var arr = [];
          fn = function(x2, y2) {
            arr.push({ x: x2, y: y2 });
          };
        }
        var dx = x1 - x0;
        var dy = y1 - y0;
        var adx = Math.abs(dx);
        var ady = Math.abs(dy);
        var eps = 0;
        var sx = dx > 0 ? 1 : -1;
        var sy = dy > 0 ? 1 : -1;
        if (adx > ady) {
          for (var x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
            fn(x, y);
            eps += ady;
            if (eps << 1 >= adx) {
              y += sy;
              eps -= adx;
            }
          }
        } else {
          for (var x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
            fn(x, y);
            eps += adx;
            if (eps << 1 >= ady) {
              x += sx;
              eps -= ady;
            }
          }
        }
        return arr;
      };
    }
  });

  // node_modules/wglt/dist/esm/index.js
  var BlendMode;
  (function(BlendMode2) {
    BlendMode2[BlendMode2["None"] = 0] = "None";
    BlendMode2[BlendMode2["Blend"] = 1] = "Blend";
    BlendMode2[BlendMode2["Add"] = 2] = "Add";
  })(BlendMode || (BlendMode = {}));
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function fromRgb(r, g, b, a) {
    if (a === void 0) {
      a = 255;
    }
    return (r << 24) + (g << 16) + (b << 8) + a;
  }
  var Colors = {
    BLACK: fromRgb(0, 0, 0),
    WHITE: fromRgb(255, 255, 255),
    LIGHT_GRAY: fromRgb(170, 170, 170),
    DARK_GRAY: fromRgb(85, 85, 85),
    YELLOW: fromRgb(255, 255, 85),
    BROWN: fromRgb(170, 85, 0),
    LIGHT_RED: fromRgb(255, 85, 85),
    DARK_RED: fromRgb(170, 0, 0),
    LIGHT_GREEN: fromRgb(85, 255, 85),
    DARK_GREEN: fromRgb(0, 170, 0),
    LIGHT_CYAN: fromRgb(85, 255, 255),
    DARK_CYAN: fromRgb(0, 170, 170),
    LIGHT_BLUE: fromRgb(85, 85, 255),
    DARK_BLUE: fromRgb(0, 0, 170),
    LIGHT_MAGENTA: fromRgb(255, 85, 255),
    DARK_MAGENTA: fromRgb(170, 0, 170),
    ORANGE: fromRgb(255, 136, 0)
  };
  var classDefinitions = /* @__PURE__ */ new Map();
  function serializable(value) {
    classDefinitions.set(value.name, value);
  }
  function convertCharCode(charCode) {
    if (typeof charCode === "string" && charCode.length > 0) {
      return charCode.charCodeAt(0);
    } else {
      return charCode;
    }
  }
  var Cell = class Cell2 {
    constructor(x, y, charCode, fg, bg) {
      this.x = x;
      this.y = y;
      if (charCode !== void 0) {
        this.charCode = convertCharCode(charCode);
      } else {
        this.charCode = " ".charCodeAt(0);
      }
      if (fg !== void 0) {
        this.fg = fg;
      } else {
        this.fg = Colors.WHITE;
      }
      if (bg !== void 0) {
        this.bg = bg;
      } else {
        this.bg = Colors.BLACK;
      }
      this.dirty = true;
      this.blocked = false;
      this.blockedSight = false;
      this.explored = false;
      this.visible = false;
      this.pathId = -1;
      this.g = 0;
      this.h = 0;
      this.prev = null;
    }
    setCharCode(charCode) {
      if (this.charCode !== charCode) {
        this.charCode = charCode;
        this.dirty = true;
      }
    }
    setForeground(fg) {
      if (fg !== void 0 && fg !== null && fg !== this.fg) {
        this.fg = fg;
        this.dirty = true;
      }
    }
    setBackground(bg) {
      if (bg !== void 0 && bg !== null && bg !== this.bg) {
        this.bg = bg;
        this.dirty = true;
      }
    }
    setValue(charCode, fg, bg) {
      if (typeof charCode === "string") {
        charCode = charCode.charCodeAt(0);
      }
      if (typeof charCode === "number") {
        this.setCharCode(charCode);
        if (fg !== void 0) {
          this.setForeground(fg);
        }
        if (bg !== void 0) {
          this.setBackground(bg);
        }
      } else {
        this.drawCell(charCode, BlendMode.None);
      }
      return this.dirty;
    }
    drawCell(otherCell, blendMode) {
      const alpha = otherCell.bg & 255;
      if (blendMode === BlendMode.None || otherCell.charCode > 0) {
        this.setCharCode(otherCell.charCode);
        this.setForeground(otherCell.fg);
      } else if (alpha > 0 && alpha < 255) {
        this.setForeground(this.blendColors(this.fg, otherCell.bg, blendMode));
      }
      if (blendMode === BlendMode.None || alpha === 255) {
        this.setBackground(otherCell.bg);
      } else if (alpha > 0) {
        this.setBackground(this.blendColors(this.bg, otherCell.bg, blendMode));
      }
    }
    blendColors(c1, c2, blendMode) {
      const alpha = c2 & 255;
      const w1 = (255 - alpha) / 255;
      const w2 = 1 - w1;
      const r1 = c1 >> 24 & 255;
      const g1 = c1 >> 16 & 255;
      const b1 = c1 >> 8 & 255;
      const r2 = c2 >> 24 & 255;
      const g2 = c2 >> 16 & 255;
      const b2 = c2 >> 8 & 255;
      switch (blendMode) {
        case BlendMode.Blend:
          return fromRgb(w1 * r1 + w2 * r2 | 0, w1 * g1 + w2 * g2 | 0, w1 * b1 + w2 * b2 | 0);
        case BlendMode.Add:
          return fromRgb(this.clamp(r1 + w2 * r2 | 0), this.clamp(g1 + w2 * g2 | 0), this.clamp(b1 + w2 * b2 | 0));
        default:
          return c2;
      }
    }
    clamp(x) {
      return Math.min(255, x);
    }
  };
  Cell = __decorate([
    serializable
  ], Cell);
  var Chars;
  (function(Chars2) {
    Chars2[Chars2["SMILEY"] = 1] = "SMILEY";
    Chars2[Chars2["INVERSE_SMILEY"] = 2] = "INVERSE_SMILEY";
    Chars2[Chars2["HEART"] = 3] = "HEART";
    Chars2[Chars2["DIAMOND"] = 4] = "DIAMOND";
    Chars2[Chars2["CLUB"] = 5] = "CLUB";
    Chars2[Chars2["SPADE"] = 6] = "SPADE";
    Chars2[Chars2["BULLET"] = 7] = "BULLET";
    Chars2[Chars2["INVERSE_BULLET"] = 8] = "INVERSE_BULLET";
    Chars2[Chars2["LIGHT_SHADE"] = 176] = "LIGHT_SHADE";
    Chars2[Chars2["MEDIUM_SHADE"] = 177] = "MEDIUM_SHADE";
    Chars2[Chars2["DARK_SHADE"] = 178] = "DARK_SHADE";
    Chars2[Chars2["BOX_SINGLE_VERTICAL"] = 179] = "BOX_SINGLE_VERTICAL";
    Chars2[Chars2["BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT"] = 180] = "BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT";
    Chars2[Chars2["BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT"] = 185] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT";
    Chars2[Chars2["BOX_DOUBLE_VERTICAL"] = 186] = "BOX_DOUBLE_VERTICAL";
    Chars2[Chars2["BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT"] = 187] = "BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT";
    Chars2[Chars2["BOX_DOUBLE_UP_AND_DOUBLE_LEFT"] = 188] = "BOX_DOUBLE_UP_AND_DOUBLE_LEFT";
    Chars2[Chars2["BOX_SINGLE_DOWN_AND_SINGLE_LEFT"] = 191] = "BOX_SINGLE_DOWN_AND_SINGLE_LEFT";
    Chars2[Chars2["BOX_SINGLE_UP_AND_SINGLE_RIGHT"] = 192] = "BOX_SINGLE_UP_AND_SINGLE_RIGHT";
    Chars2[Chars2["BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP"] = 193] = "BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP";
    Chars2[Chars2["BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN"] = 194] = "BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN";
    Chars2[Chars2["BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT"] = 195] = "BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT";
    Chars2[Chars2["BOX_SINGLE_HORIZONTAL"] = 196] = "BOX_SINGLE_HORIZONTAL";
    Chars2[Chars2["BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL"] = 197] = "BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL";
    Chars2[Chars2["BOX_DOUBLE_UP_AND_DOUBLE_RIGHT"] = 200] = "BOX_DOUBLE_UP_AND_DOUBLE_RIGHT";
    Chars2[Chars2["BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT"] = 201] = "BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT";
    Chars2[Chars2["BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP"] = 202] = "BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP";
    Chars2[Chars2["BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN"] = 203] = "BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN";
    Chars2[Chars2["BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT"] = 204] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT";
    Chars2[Chars2["BOX_DOUBLE_HORIZONTAL"] = 205] = "BOX_DOUBLE_HORIZONTAL";
    Chars2[Chars2["BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL"] = 206] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL";
    Chars2[Chars2["BOX_SINGLE_UP_AND_SINGLE_LEFT"] = 217] = "BOX_SINGLE_UP_AND_SINGLE_LEFT";
    Chars2[Chars2["BOX_SINGLE_DOWN_AND_SINGLE_RIGHT"] = 218] = "BOX_SINGLE_DOWN_AND_SINGLE_RIGHT";
    Chars2[Chars2["BLOCK_FULL"] = 219] = "BLOCK_FULL";
    Chars2[Chars2["BLOCK_BOTTOM_HALF"] = 220] = "BLOCK_BOTTOM_HALF";
    Chars2[Chars2["BLOCK_LEFT_HALF"] = 221] = "BLOCK_LEFT_HALF";
    Chars2[Chars2["BLOCK_RIGHT_HALF"] = 222] = "BLOCK_RIGHT_HALF";
    Chars2[Chars2["BLOCK_TOP_HALF"] = 223] = "BLOCK_TOP_HALF";
  })(Chars || (Chars = {}));
  function wordWrap(str, maxLength) {
    const regex = new RegExp("(\\S(.{0," + maxLength + "}\\S)?)\\s+", "g");
    return (str + " ").replace(regex, "$1\n").trim().split("\n").map((line) => line.trim());
  }
  var Console = class Console2 {
    constructor(width, height, blockedFunc) {
      this.width = width;
      this.height = height;
      this.grid = [];
      this.originX = 0;
      this.originY = 0;
      this.minX = 0;
      this.maxX = 0;
      this.minY = 0;
      this.maxY = 0;
      this.radius = 0;
      for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
          row.push(new Cell(x, y));
        }
        this.grid.push(row);
      }
      this.clear();
      if (blockedFunc) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            this.grid[y][x].blocked = this.grid[y][x].blockedSight = blockedFunc(x, y);
          }
        }
      }
    }
    clear() {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.drawChar(x, y, 0);
        }
      }
    }
    getCell(x, y) {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        return void 0;
      }
      return this.grid[y][x];
    }
    getCharCode(x, y) {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        return void 0;
      }
      return this.grid[y][x].charCode;
    }
    drawChar(x, y, c, fg, bg) {
      if (this.clip && !this.clip.contains({ x, y })) {
        return;
      }
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.grid[y | 0][x | 0].setValue(c, fg, bg);
      }
    }
    drawString(x, y, str, fg, bg) {
      const lines = str.split("\n");
      for (let i = 0; i < lines.length; i++) {
        this.drawStringLine(x, y + i, lines[i], fg, bg);
      }
    }
    drawStringLine(x, y, line, fg, bg) {
      for (let j = 0; j < line.length; j++) {
        this.drawChar(x + j, y, line.charCodeAt(j), fg, bg);
      }
    }
    drawCenteredString(x, y, str, fg, bg) {
      this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
    }
    drawMessage(x, y, message, maxWidth) {
      if (message.text) {
        const lines = wordWrap(message.text, maxWidth || this.width - x);
        for (const line of lines) {
          this.drawStringLine(x, y, line, message.fg, message.bg);
          y++;
        }
      }
      if (message.children) {
        for (const child of message.children) {
          y = this.drawMessage(x, y, child, maxWidth);
        }
      }
      return y;
    }
    drawHLine(x, y, width, c, fg, bg) {
      for (let xi = x; xi < x + width; xi++) {
        this.drawChar(xi, y, c, fg, bg);
      }
    }
    drawVLine(x, y, height, c, fg, bg) {
      for (let yi = y; yi < y + height; yi++) {
        this.drawChar(x, yi, c, fg, bg);
      }
    }
    drawRect(x, y, width, height, c, fg, bg) {
      this.drawHLine(x, y, width, c, fg, bg);
      this.drawHLine(x, y + height - 1, width, c, fg, bg);
      this.drawVLine(x, y, height, c, fg, bg);
      this.drawVLine(x + width - 1, y, height, c, fg, bg);
    }
    drawBox(x, y, width, height, topChar, rightChar, bottomChar, leftChar, topLeftChar, topRightChar, bottomRightChar, bottomLeftChar, fg, bg) {
      this.drawHLine(x, y, width, topChar, fg, bg);
      this.drawHLine(x, y + height - 1, width, bottomChar, fg, bg);
      this.drawVLine(x, y, height, leftChar, fg, bg);
      this.drawVLine(x + width - 1, y, height, rightChar, fg, bg);
      this.drawChar(x, y, topLeftChar, fg, bg);
      this.drawChar(x + width - 1, y, topRightChar, fg, bg);
      this.drawChar(x, y + height - 1, bottomLeftChar, fg, bg);
      this.drawChar(x + width - 1, y + height - 1, bottomRightChar, fg, bg);
    }
    drawSingleBox(x, y, width, height, fg, bg) {
      this.drawBox(x, y, width, height, Chars.BOX_SINGLE_HORIZONTAL, Chars.BOX_SINGLE_VERTICAL, Chars.BOX_SINGLE_HORIZONTAL, Chars.BOX_SINGLE_VERTICAL, Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT, Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT, Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT, Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT, fg, bg);
    }
    drawDoubleBox(x, y, width, height, fg, bg) {
      this.drawBox(x, y, width, height, Chars.BOX_DOUBLE_HORIZONTAL, Chars.BOX_DOUBLE_VERTICAL, Chars.BOX_DOUBLE_HORIZONTAL, Chars.BOX_DOUBLE_VERTICAL, Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT, Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT, Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT, Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, fg, bg);
    }
    fillRect(x, y, width, height, c, fg, bg) {
      for (let yi = y; yi < y + height; yi++) {
        this.drawHLine(x, yi, width, c, fg, bg);
      }
    }
    drawConsole(dstX, dstY, srcConsole, srcX, srcY, srcWidth, srcHeight, blendMode) {
      blendMode = blendMode || BlendMode.None;
      for (let y = 0; y < srcHeight; y++) {
        for (let x = 0; x < srcWidth; x++) {
          const cell = srcConsole.getCell(srcX + x, srcY + y);
          if (cell) {
            this.drawCell(dstX + x, dstY + y, cell, blendMode);
          }
        }
      }
    }
    drawCell(x, y, cell, blendMode) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.grid[y][x].drawCell(cell, blendMode);
      }
    }
    setBlocked(x, y, blocked) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.grid[y][x].blocked = blocked;
      }
    }
    setBlockedSight(x, y, blockedSight) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.grid[y][x].blockedSight = blockedSight;
      }
    }
    isVisible(x, y) {
      if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
        return false;
      }
      return this.grid[y][x].visible;
    }
    isBlocked(x, y) {
      if (x < 0 || x > this.width || y < 0 || y > this.height) {
        return true;
      }
      return this.grid[y][x].blocked;
    }
    isBlockedSight(x, y) {
      if (x < 0 || x > this.width || y < 0 || y > this.height) {
        return true;
      }
      return this.grid[y][x].blockedSight;
    }
    computeOctantY(deltaX, deltaY) {
      const startSlopes = [];
      const endSlopes = [];
      let iteration = 1;
      let totalObstacles = 0;
      let obstaclesInLastLine = 0;
      let minSlope = 0;
      let x;
      let y;
      let halfSlope;
      let processedCell;
      let visible;
      let extended;
      let centreSlope;
      let startSlope;
      let endSlope;
      let previousEndSlope;
      for (y = this.originY + deltaY; y >= this.minY && y <= this.maxY; y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
        halfSlope = 0.5 / iteration;
        previousEndSlope = -1;
        for (processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + processedCell * deltaX; processedCell <= iteration && x >= this.minX && x <= this.maxX; x += deltaX, ++processedCell, previousEndSlope = endSlope) {
          visible = true;
          extended = false;
          centreSlope = processedCell / iteration;
          startSlope = previousEndSlope;
          endSlope = centreSlope + halfSlope;
          if (obstaclesInLastLine > 0) {
            if (!(this.grid[y - deltaY][x].visible && !this.grid[y - deltaY][x].blockedSight) && !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blockedSight)) {
              visible = false;
            } else {
              for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                  if (!this.grid[y][x].blockedSight) {
                    if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                      visible = false;
                      break;
                    }
                  } else {
                    if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                      visible = false;
                      break;
                    } else {
                      startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                      endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                      extended = true;
                    }
                  }
                }
              }
            }
          }
          if (visible) {
            this.grid[y][x].visible = true;
            if (this.grid[y][x].blockedSight) {
              if (minSlope >= startSlope) {
                minSlope = endSlope;
              } else if (!extended) {
                startSlopes[totalObstacles] = startSlope;
                endSlopes[totalObstacles++] = endSlope;
              }
            }
          }
        }
      }
    }
    computeOctantX(deltaX, deltaY) {
      const startSlopes = [];
      const endSlopes = [];
      let iteration = 1;
      let totalObstacles = 0;
      let obstaclesInLastLine = 0;
      let minSlope = 0;
      let x;
      let y;
      let halfSlope;
      let processedCell;
      let visible;
      let extended;
      let centreSlope;
      let startSlope;
      let endSlope;
      let previousEndSlope;
      for (x = this.originX + deltaX; x >= this.minX && x <= this.maxX; x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
        halfSlope = 0.5 / iteration;
        previousEndSlope = -1;
        for (processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + processedCell * deltaY; processedCell <= iteration && y >= this.minY && y <= this.maxY; y += deltaY, ++processedCell, previousEndSlope = endSlope) {
          visible = true;
          extended = false;
          centreSlope = processedCell / iteration;
          startSlope = previousEndSlope;
          endSlope = centreSlope + halfSlope;
          if (obstaclesInLastLine > 0) {
            if (!(this.grid[y][x - deltaX].visible && !this.grid[y][x - deltaX].blockedSight) && !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blockedSight)) {
              visible = false;
            } else {
              for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
                if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                  if (!this.grid[y][x].blockedSight) {
                    if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                      visible = false;
                      break;
                    }
                  } else {
                    if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                      visible = false;
                      break;
                    } else {
                      startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                      endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                      extended = true;
                    }
                  }
                }
              }
            }
          }
          if (visible) {
            this.grid[y][x].visible = true;
            if (this.grid[y][x].blockedSight) {
              if (minSlope >= startSlope) {
                minSlope = endSlope;
              } else if (!extended) {
                startSlopes[totalObstacles] = startSlope;
                endSlopes[totalObstacles++] = endSlope;
              }
            }
          }
        }
      }
    }
    computeFov(originX, originY, radius, opt_noClear, opt_octants) {
      this.originX = originX;
      this.originY = originY;
      this.radius = radius;
      if (opt_noClear) {
        this.minX = Math.min(this.minX, Math.max(0, originX - radius));
        this.minY = Math.min(this.minY, Math.max(0, originY - radius));
        this.maxX = Math.max(this.maxX, Math.min(this.width - 1, originX + radius));
        this.maxY = Math.max(this.maxY, Math.min(this.height - 1, originY + radius));
      } else {
        this.minX = Math.max(0, originX - radius);
        this.minY = Math.max(0, originY - radius);
        this.maxX = Math.min(this.width - 1, originX + radius);
        this.maxY = Math.min(this.height - 1, originY + radius);
        for (let y = this.minY; y <= this.maxY; y++) {
          for (let x = this.minX; x <= this.maxX; x++) {
            this.grid[y][x].visible = false;
          }
        }
      }
      this.grid[originY][originX].visible = true;
      if (opt_octants === void 0) {
        this.computeOctantY(1, 1);
        this.computeOctantX(1, 1);
        this.computeOctantX(1, -1);
        this.computeOctantY(1, -1);
        this.computeOctantY(-1, -1);
        this.computeOctantX(-1, -1);
        this.computeOctantX(-1, 1);
        this.computeOctantY(-1, 1);
      } else {
        if (opt_octants & 1) {
          this.computeOctantY(1, 1);
        }
        if (opt_octants & 2) {
          this.computeOctantX(1, 1);
        }
        if (opt_octants & 4) {
          this.computeOctantX(1, -1);
        }
        if (opt_octants & 8) {
          this.computeOctantY(1, -1);
        }
        if (opt_octants & 16) {
          this.computeOctantY(-1, -1);
        }
        if (opt_octants & 32) {
          this.computeOctantX(-1, -1);
        }
        if (opt_octants & 64) {
          this.computeOctantX(-1, 1);
        }
        if (opt_octants & 128) {
          this.computeOctantY(-1, 1);
        }
      }
    }
    updateExplored() {
      for (let y = this.minY; y <= this.maxY; y++) {
        for (let x = this.minX; x <= this.maxX; x++) {
          const tile = this.grid[y][x];
          tile.explored = tile.explored || tile.visible;
        }
      }
    }
  };
  Console = __decorate([
    serializable
  ], Console);
  var Font = class {
    constructor(url, charWidth, charHeight, scale) {
      this.url = url;
      this.charWidth = charWidth;
      this.charHeight = charHeight;
      this.scale = scale || 1;
    }
  };
  var FONT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eICJsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBqucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqhJRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvhA1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIzCAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsWIE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBWl5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtLji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2fotTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZUghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2GAzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJG199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJIlipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC";
  var DEFAULT_FONT = new Font(FONT_IMAGE, 8, 8);
  var FovOctants;
  (function(FovOctants2) {
    FovOctants2[FovOctants2["OCTANT_SOUTH_SOUTHEAST"] = 1] = "OCTANT_SOUTH_SOUTHEAST";
    FovOctants2[FovOctants2["OCTANT_EAST_SOUTHEAST"] = 2] = "OCTANT_EAST_SOUTHEAST";
    FovOctants2[FovOctants2["OCTANT_EAST_NORTHTHEAST"] = 4] = "OCTANT_EAST_NORTHTHEAST";
    FovOctants2[FovOctants2["OCTANT_NORTH_NORTHEAST"] = 8] = "OCTANT_NORTH_NORTHEAST";
    FovOctants2[FovOctants2["OCTANT_NORTH_NORTHWEST"] = 16] = "OCTANT_NORTH_NORTHWEST";
    FovOctants2[FovOctants2["OCTANT_WEST_NORTHEAST"] = 32] = "OCTANT_WEST_NORTHEAST";
    FovOctants2[FovOctants2["OCTANT_WEST_SOUTHWEST"] = 64] = "OCTANT_WEST_SOUTHWEST";
    FovOctants2[FovOctants2["OCTANT_SOUTH_SOUTHWEST"] = 128] = "OCTANT_SOUTH_SOUTHWEST";
  })(FovOctants || (FovOctants = {}));
  var FovQuadrants;
  (function(FovQuadrants2) {
    FovQuadrants2[FovQuadrants2["QUADRANT_SOUTHEAST"] = 3] = "QUADRANT_SOUTHEAST";
    FovQuadrants2[FovQuadrants2["QUADRANT_EAST"] = 6] = "QUADRANT_EAST";
    FovQuadrants2[FovQuadrants2["QUADRANT_NORTHEAST"] = 12] = "QUADRANT_NORTHEAST";
    FovQuadrants2[FovQuadrants2["QUADRANT_NORTH"] = 24] = "QUADRANT_NORTH";
    FovQuadrants2[FovQuadrants2["QUADRANT_NORTHWEST"] = 48] = "QUADRANT_NORTHWEST";
    FovQuadrants2[FovQuadrants2["QUADRANT_WEST"] = 96] = "QUADRANT_WEST";
    FovQuadrants2[FovQuadrants2["QUADRANT_SOUTHWEST"] = 192] = "QUADRANT_SOUTHWEST";
    FovQuadrants2[FovQuadrants2["QUADRANT_SOUTH"] = 129] = "QUADRANT_SOUTH";
  })(FovQuadrants || (FovQuadrants = {}));
  var Point = class Point2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  Point = __decorate([
    serializable
  ], Point);
  var Rect = class Rect2 {
    constructor(x, y, width, height) {
      this.x = this.left = x;
      this.y = this.top = y;
      this.width = width;
      this.height = height;
      this.x2 = x + width;
      this.y2 = y + height;
    }
    getCenter() {
      return new Point(this.x + this.width / 2 | 0, this.y + this.height / 2 | 0);
    }
    intersects(other) {
      return this.x <= other.x2 && this.x2 >= other.x && this.y <= other.y2 && this.y2 >= other.y;
    }
    contains(point) {
      return point.x >= this.x && point.x < this.x2 && point.y >= this.y && point.y < this.y2;
    }
  };
  Rect = __decorate([
    serializable
  ], Rect);
  var Message = class Message2 {
    constructor(text, fg, bg, children) {
      this.text = text;
      this.fg = fg;
      this.bg = bg;
      this.children = children;
    }
    getWidth() {
      let width = 0;
      if (this.text) {
        for (const line of this.text.split("\n")) {
          width = Math.max(width, line.length);
        }
      }
      if (this.children) {
        for (const child of this.children) {
          width = Math.max(width, child.getWidth());
        }
      }
      return width;
    }
    getHeight() {
      let result = 0;
      if (this.text) {
        result += this.text.split("\n").length;
      }
      if (this.children) {
        for (const child of this.children) {
          result += child.getHeight();
        }
      }
      return result;
    }
  };
  Message = __decorate([
    serializable
  ], Message);
  var INPUT_REPEAT_DELAY = 200;
  var INPUT_REPEAT_RATE = 1e3 / 15;
  var Input = class {
    constructor() {
      this.down = false;
      this.downTime = 0;
      this.repeat = false;
      this.repeatTime = 0;
      this.downCount = 0;
      this.upCount = 100;
    }
    setDown(down) {
      if (this.down !== down) {
        this.down = down;
        this.repeat = false;
        this.downTime = this.repeatTime = performance.now();
      }
    }
    update(time) {
      this.repeat = false;
      if (this.down) {
        this.downCount++;
        this.upCount = 0;
        if (time - this.downTime >= INPUT_REPEAT_DELAY && time - this.repeatTime >= INPUT_REPEAT_RATE) {
          this.repeat = true;
          this.repeatTime = time;
        }
      } else {
        this.downCount = 0;
        this.upCount++;
      }
    }
    isPressed() {
      return this.downCount === 1 || this.repeat;
    }
    isClicked() {
      return this.upCount === 1;
    }
  };
  var InputSet = class {
    constructor() {
      this.inputs = /* @__PURE__ */ new Map();
    }
    clear() {
      this.inputs.clear();
    }
    get(key) {
      let input = this.inputs.get(key);
      if (!input) {
        input = new Input();
        this.inputs.set(key, input);
      }
      return input;
    }
    updateAll(time) {
      this.inputs.forEach((input) => input.update(time));
    }
  };
  var Keyboard = class {
    constructor(el) {
      this.keys = new InputSet();
      el.addEventListener("keydown", (e) => this.setKey(e, true));
      el.addEventListener("keyup", (e) => this.setKey(e, false));
    }
    clear() {
      this.keys.clear();
    }
    getKey(key) {
      return this.keys.get(key);
    }
    setKey(e, state) {
      const key = e.code;
      if (key === Key.VK_F11) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      this.keys.get(key).setDown(state);
    }
    updateKeys(time) {
      this.keys.updateAll(time);
    }
  };
  var Key;
  (function(Key2) {
    Key2["VK_CANCEL"] = "Pause";
    Key2["VK_BACKSPACE"] = "Backspace";
    Key2["VK_TAB"] = "Tab";
    Key2["VK_ENTER"] = "Enter";
    Key2["VK_SHIFT_LEFT"] = "ShiftLeft";
    Key2["VK_SHIFT_RIGHT"] = "ShiftLeft";
    Key2["VK_CONTROL_LEFT"] = "ControlLeft";
    Key2["VK_CONTROL_RIGHT"] = "ControlRight";
    Key2["VK_ALT_LEFT"] = "AltLeft";
    Key2["VK_ALT_RIGHT"] = "AltRight";
    Key2["VK_PAUSE"] = "Pause";
    Key2["VK_CAPS_LOCK"] = "CapsLock";
    Key2["VK_ESCAPE"] = "Escape";
    Key2["VK_SPACE"] = "Space";
    Key2["VK_PAGE_UP"] = "PageUp";
    Key2["VK_PAGE_DOWN"] = "PageDown";
    Key2["VK_END"] = "End";
    Key2["VK_HOME"] = "Home";
    Key2["VK_LEFT"] = "ArrowLeft";
    Key2["VK_UP"] = "ArrowUp";
    Key2["VK_RIGHT"] = "ArrowRight";
    Key2["VK_DOWN"] = "ArrowDown";
    Key2["VK_INSERT"] = "Insert";
    Key2["VK_DELETE"] = "Delete";
    Key2["VK_0"] = "Digit0";
    Key2["VK_1"] = "Digit1";
    Key2["VK_2"] = "Digit2";
    Key2["VK_3"] = "Digit3";
    Key2["VK_4"] = "Digit4";
    Key2["VK_5"] = "Digit5";
    Key2["VK_6"] = "Digit6";
    Key2["VK_7"] = "Digit7";
    Key2["VK_8"] = "Digit8";
    Key2["VK_9"] = "Digit9";
    Key2["VK_SEMICOLON"] = "Semicolon";
    Key2["VK_EQUALS"] = "Equal";
    Key2["VK_A"] = "KeyA";
    Key2["VK_B"] = "KeyB";
    Key2["VK_C"] = "KeyC";
    Key2["VK_D"] = "KeyD";
    Key2["VK_E"] = "KeyE";
    Key2["VK_F"] = "KeyF";
    Key2["VK_G"] = "KeyG";
    Key2["VK_H"] = "KeyH";
    Key2["VK_I"] = "KeyI";
    Key2["VK_J"] = "KeyJ";
    Key2["VK_K"] = "KeyK";
    Key2["VK_L"] = "KeyL";
    Key2["VK_M"] = "KeyM";
    Key2["VK_N"] = "KeyN";
    Key2["VK_O"] = "KeyO";
    Key2["VK_P"] = "KeyP";
    Key2["VK_Q"] = "KeyQ";
    Key2["VK_R"] = "KeyR";
    Key2["VK_S"] = "KeyS";
    Key2["VK_T"] = "KeyT";
    Key2["VK_U"] = "KeyU";
    Key2["VK_V"] = "KeyV";
    Key2["VK_W"] = "KeyW";
    Key2["VK_X"] = "KeyX";
    Key2["VK_Y"] = "KeyY";
    Key2["VK_Z"] = "KeyZ";
    Key2["VK_CONTEXT_MENU"] = "ContextMenu";
    Key2["VK_NUMPAD0"] = "Numpad0";
    Key2["VK_NUMPAD1"] = "Numpad1";
    Key2["VK_NUMPAD2"] = "Numpad2";
    Key2["VK_NUMPAD3"] = "Numpad3";
    Key2["VK_NUMPAD4"] = "Numpad4";
    Key2["VK_NUMPAD5"] = "Numpad5";
    Key2["VK_NUMPAD6"] = "Numpad6";
    Key2["VK_NUMPAD7"] = "Numpad7";
    Key2["VK_NUMPAD8"] = "Numpad8";
    Key2["VK_NUMPAD9"] = "Numpad9";
    Key2["VK_NUMPAD_ENTER"] = "NumpadEnter";
    Key2["VK_MULTIPLY"] = "NumpadMultiply";
    Key2["VK_ADD"] = "NumpadAdd";
    Key2["VK_SEPARATOR"] = "NumpadDecimal";
    Key2["VK_SUBTRACT"] = "NumpadSubtract";
    Key2["VK_DECIMAL"] = "NumpadDecimal";
    Key2["VK_DIVIDE"] = "NumpadDivide";
    Key2["VK_F1"] = "F1";
    Key2["VK_F2"] = "F2";
    Key2["VK_F3"] = "F3";
    Key2["VK_F4"] = "F4";
    Key2["VK_F5"] = "F5";
    Key2["VK_F6"] = "F6";
    Key2["VK_F7"] = "F7";
    Key2["VK_F8"] = "F8";
    Key2["VK_F9"] = "F9";
    Key2["VK_F10"] = "F10";
    Key2["VK_F11"] = "F11";
    Key2["VK_F12"] = "F12";
    Key2["VK_F13"] = "F13";
    Key2["VK_F14"] = "F14";
    Key2["VK_F15"] = "F15";
    Key2["VK_F16"] = "F16";
    Key2["VK_F17"] = "F17";
    Key2["VK_F18"] = "F18";
    Key2["VK_F19"] = "F19";
    Key2["VK_F20"] = "F20";
    Key2["VK_F21"] = "F21";
    Key2["VK_F22"] = "F22";
    Key2["VK_F23"] = "F23";
    Key2["VK_F24"] = "F24";
    Key2["VK_NUM_LOCK"] = "NumLock";
    Key2["VK_SCROLL_LOCK"] = "ScrollLock";
    Key2["VK_COMMA"] = "Comma";
    Key2["VK_PERIOD"] = "Period";
    Key2["VK_SLASH"] = "Slash";
    Key2["VK_BACKQUOTE"] = "Backquote";
    Key2["VK_OPEN_BRACKET"] = "BracketLeft";
    Key2["VK_BACK_SLASH"] = "Backslash";
    Key2["VK_CLOSE_BRACKET"] = "BracketRight";
    Key2["VK_QUOTE"] = "Quote";
    Key2["VK_META"] = "OSLeft";
  })(Key || (Key = {}));
  var PATTERNS = [
    { charCode: Chars.BLOCK_TOP_HALF, active: [1, 1, 0, 0] },
    { charCode: Chars.BLOCK_RIGHT_HALF, active: [0, 1, 0, 1] }
  ];
  var Mouse = class {
    constructor(terminal) {
      this.buttons = new InputSet();
      this.el = terminal.canvas;
      this.width = terminal.width;
      this.height = terminal.height;
      this.prevX = 0;
      this.prevY = 0;
      this.x = 0;
      this.y = 0;
      this.dx = 0;
      this.dy = 0;
      this.wheelDeltaX = 0;
      this.wheelDeltaY = 0;
      const el = this.el;
      el.addEventListener("mousedown", (e) => this.handleEvent(e));
      el.addEventListener("mouseup", (e) => this.handleEvent(e));
      el.addEventListener("mousemove", (e) => this.handleEvent(e));
      el.addEventListener("contextmenu", (e) => this.handleEvent(e));
      el.addEventListener("touchstart", (e) => this.handleTouchEvent(e));
      el.addEventListener("touchend", (e) => this.handleTouchEvent(e));
      el.addEventListener("touchcancel", (e) => this.handleTouchEvent(e));
      el.addEventListener("touchmove", (e) => this.handleTouchEvent(e));
      el.addEventListener("wheel", (e) => this.handleWheelEvent(e));
    }
    handleTouchEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.updatePosition(touch.clientX, touch.clientY);
        this.buttons.get(0).setDown(true);
      } else {
        this.buttons.get(0).setDown(false);
      }
    }
    handleEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      this.updatePosition(e.clientX, e.clientY);
      if (e.type === "mousedown") {
        this.buttons.get(e.button).setDown(true);
        this.el.focus();
      }
      if (e.type === "mouseup") {
        this.buttons.get(e.button).setDown(false);
      }
    }
    handleWheelEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      this.wheelDeltaX = e.deltaX;
      this.wheelDeltaY = e.deltaY;
    }
    updatePosition(clientX, clientY) {
      let rect = this.el.getBoundingClientRect();
      const terminalAspectRatio = this.width / this.height;
      const rectAspectRatio = rect.width / rect.height;
      if (rectAspectRatio - terminalAspectRatio > 0.01) {
        const actualWidth = terminalAspectRatio * rect.height;
        const excess = rect.width - actualWidth;
        rect = new Rect(Math.floor(excess / 2), 0, actualWidth, rect.height);
      }
      if (rectAspectRatio - terminalAspectRatio < -0.01) {
        const actualHeight = rect.width / terminalAspectRatio;
        const excess = rect.height - actualHeight;
        rect = new Rect(0, Math.floor(excess / 2), rect.width, actualHeight);
      }
      this.x = this.width * (clientX - rect.left) / rect.width | 0;
      this.y = this.height * (clientY - rect.top) / rect.height | 0;
    }
    update(time) {
      this.dx = this.x - this.prevX;
      this.dy = this.y - this.prevY;
      this.prevX = this.x;
      this.prevY = this.y;
      this.buttons.updateAll(time);
    }
  };
  var Commodore64Palette = {
    BLACK: fromRgb(0, 0, 0),
    WHITE: fromRgb(255, 255, 255),
    RED: fromRgb(136, 0, 0),
    CYAN: fromRgb(170, 255, 238),
    VIOLET: fromRgb(204, 68, 204),
    GREEN: fromRgb(0, 204, 85),
    BLUE: fromRgb(0, 0, 170),
    YELLOW: fromRgb(238, 238, 119),
    ORANGE: fromRgb(221, 136, 85),
    BROWN: fromRgb(102, 68, 0),
    LIGHT_RED: fromRgb(255, 119, 119),
    DARK_GRAY: fromRgb(51, 51, 51),
    GRAY: fromRgb(119, 119, 119),
    LIGHT_GREEN: fromRgb(170, 255, 102),
    LIGHT_BLUE: fromRgb(0, 136, 255),
    LIGHT_GRAY: fromRgb(187, 187, 187)
  };
  var ColodorePalette = {
    BLACK: fromRgb(0, 0, 0),
    WHITE: fromRgb(255, 255, 255),
    RED: fromRgb(136, 0, 0),
    CYAN: fromRgb(170, 255, 238),
    VIOLET: fromRgb(204, 68, 204),
    GREEN: fromRgb(0, 204, 85),
    BLUE: fromRgb(0, 0, 170),
    YELLOW: fromRgb(238, 238, 119),
    ORANGE: fromRgb(221, 136, 85),
    BROWN: fromRgb(102, 68, 0),
    LIGHT_RED: fromRgb(255, 119, 119),
    DARK_GRAY: fromRgb(51, 51, 51),
    GRAY: fromRgb(119, 119, 119),
    LIGHT_GREEN: fromRgb(170, 255, 102),
    LIGHT_BLUE: fromRgb(0, 136, 255),
    LIGHT_GRAY: fromRgb(187, 187, 187)
  };
  var Pico8Palette = {
    BLACK: fromRgb(0, 0, 0),
    DARK_BLUE: fromRgb(29, 43, 83),
    DARK_PURPLE: fromRgb(126, 37, 83),
    DARK_GREEN: fromRgb(0, 135, 81),
    BROWN: fromRgb(171, 82, 54),
    DARK_GRAY: fromRgb(95, 87, 79),
    LIGHT_GRAY: fromRgb(194, 195, 199),
    WHITE: fromRgb(255, 241, 232),
    RED: fromRgb(255, 0, 77),
    ORANGE: fromRgb(255, 163, 0),
    YELLOW: fromRgb(255, 236, 39),
    GREEN: fromRgb(0, 228, 54),
    BLUE: fromRgb(41, 173, 255),
    LAVENDER: fromRgb(131, 118, 156),
    PINK: fromRgb(255, 119, 168),
    LIGHT_PEACH: fromRgb(255, 204, 170)
  };
  var RNG = class RNG2 {
    constructor(seed) {
      this.m = 2147483648;
      this.a = 1103515245;
      this.c = 12345;
      this.state = seed || 1;
    }
    nextInt() {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state;
    }
    nextFloat() {
      return this.nextInt() / (this.m - 1);
    }
    nextRange(start, end) {
      const rangeSize = end - start;
      const randomUnder1 = this.nextInt() / this.m;
      const result = start + (randomUnder1 * rangeSize | 0);
      if (isNaN(result)) {
        throw new Error("rand nan");
      }
      return result;
    }
    chooseIndex(chances) {
      const total = chances.reduce((a, b) => a + b);
      const roll = this.nextRange(1, total + 1);
      let runningTotal = 0;
      for (let i = 0; i < chances.length; i++) {
        runningTotal += chances[i];
        if (roll <= runningTotal) {
          return i;
        }
      }
      return chances.length - 1;
    }
    chooseKey(chancesMap) {
      const values = Object.keys(chancesMap);
      const chances = values.map((value) => chancesMap[value]);
      return values[this.chooseIndex(chances)];
    }
  };
  RNG = __decorate([
    serializable
  ], RNG);
  var VERTEX_SHADER_SOURCE = "#version 300 es\nprecision highp float;in vec2 a;in vec2 b;in vec3 c;in vec3 d;out vec2 e;out vec4 f;out vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}";
  var FRAGMENT_SHADER_SOURCE = "#version 300 es\nprecision highp float;in vec2 e;in vec4 f;in vec4 g;uniform sampler2D s;out vec4 o;void main(void){o=texture(s,e);if(o.r<0.1) {o=g;} else {o=f;}}";
  var CRT_VERTEX_SHADER_SOURCE = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main(void) {
  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;
  var CRT_FRAGMENT_SHADER_SOURCE = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_blur;
uniform float u_curvature;
uniform float u_chroma;
uniform float u_scanlineWidth;
uniform float u_scanlineIntensity;
uniform float u_vignette;
out vec4 outputColor;

vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) * u_curvature), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) * u_curvature), 2.0);
  uv /= 1.1;
  uv = (uv / 2.0) + 0.5;
  return uv;
}

void main() {
  vec2 iResolution = vec2(640.0, 360.0);
  vec2 q = v_texCoord;
  vec2 fragCoord = v_texCoord;
  vec2 uv = q;
  uv = curve(uv);

  // Outside of range is black
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec4 col;

  // Chromatic aberration
  // col = texture(u_texture, uv.xy);
  col.r = 0.7 * texture(u_texture, vec2(uv.x + 0.001 * u_chroma, uv.y + 0.001 * u_chroma)).r;
  col.g = 0.7 * texture(u_texture, vec2(uv.x + 0.000 * u_chroma, uv.y - 0.002 * u_chroma)).g;
  col.b = 0.7 * texture(u_texture, vec2(uv.x - 0.002 * u_chroma, uv.y + 0.000 * u_chroma)).b;
  
  // Blur
  col += 0.05 * texture(u_texture, vec2(uv.x - 2.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x - 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x + 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.05 * texture(u_texture, vec2(uv.x + 2.0 * u_blur / iResolution.x, uv.y));

  // Vignette
  col *= pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), u_vignette);

  // Scanlines
  col *= clamp(1.0 + u_scanlineWidth * sin(uv.y * iResolution.y * 2.0 * PI), 1.0 - u_scanlineIntensity, 1.0);

  outputColor = vec4(col.rgb, 1.0);
}`;
  function interpolate(i, max) {
    return -1 + 2 * (i / max);
  }
  var DEFAULT_OPTIONS = {
    font: DEFAULT_FONT
  };
  var Terminal = class extends Console {
    constructor(canvas, width, height, options) {
      var _a;
      super(width, height);
      options = options || DEFAULT_OPTIONS;
      this.canvas = canvas;
      this.font = options.font || DEFAULT_FONT;
      this.crt = options.crt;
      this.maxFps = options.maxFps;
      this.pixelWidth = width * this.font.charWidth;
      this.pixelHeight = height * this.font.charHeight;
      this.pixelScale = ((_a = options.crt) === null || _a === void 0 ? void 0 : _a.scale) || 1;
      canvas.width = this.pixelWidth * this.pixelScale;
      canvas.height = this.pixelHeight * this.pixelScale;
      canvas.style.imageRendering = "pixelated";
      canvas.style.outline = "none";
      canvas.tabIndex = 0;
      this.handleResize();
      window.addEventListener("resize", () => this.handleResize());
      this.keys = new Keyboard(canvas);
      this.mouse = new Mouse(this);
      const gl = canvas.getContext("webgl2", { antialias: false });
      if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser may not support it.");
      }
      const program = gl.createProgram();
      if (!program) {
        throw new Error("Unable to initialize WebGL. Your browser may not support it.");
      }
      this.gl = gl;
      this.program = program;
      gl.attachShader(program, this.buildShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE));
      gl.attachShader(program, this.buildShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE));
      gl.linkProgram(program);
      gl.useProgram(program);
      this.crtProgram = gl.createProgram();
      gl.attachShader(this.crtProgram, this.buildShader(gl.VERTEX_SHADER, CRT_VERTEX_SHADER_SOURCE));
      gl.attachShader(this.crtProgram, this.buildShader(gl.FRAGMENT_SHADER, CRT_FRAGMENT_SHADER_SOURCE));
      gl.linkProgram(this.crtProgram);
      gl.useProgram(this.crtProgram);
      this.crtBlurLocation = gl.getUniformLocation(this.crtProgram, "u_blur");
      this.crtCurvatureLocation = gl.getUniformLocation(this.crtProgram, "u_curvature");
      this.crtChromaLocation = gl.getUniformLocation(this.crtProgram, "u_chroma");
      this.crtScanlineWidthLocation = gl.getUniformLocation(this.crtProgram, "u_scanlineWidth");
      this.crtScanlineIntensityLocation = gl.getUniformLocation(this.crtProgram, "u_scanlineIntensity");
      this.crtVignetteLocation = gl.getUniformLocation(this.crtProgram, "u_vignette");
      this.crtPositionLocation = gl.getAttribLocation(this.crtProgram, "a_position");
      this.crtPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.crtPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.crtPositionLocation);
      gl.vertexAttribPointer(this.crtPositionLocation, 2, gl.FLOAT, false, 0, 0);
      this.crtTexCoordLocation = gl.getAttribLocation(this.crtProgram, "a_texCoord");
      this.crtTexCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.crtTexCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.crtTexCoordLocation);
      gl.vertexAttribPointer(this.crtTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
      this.positionAttribLocation = this.getAttribLocation("a");
      this.textureAttribLocation = this.getAttribLocation("b");
      this.fgColorAttribLocation = this.getAttribLocation("c");
      this.bgColorAttribLocation = this.getAttribLocation("d");
      const cellCount = width * height;
      this.positionsArray = new Float32Array(cellCount * 3 * 4);
      this.indexArray = new Uint16Array(cellCount * 6);
      this.textureArray = new Float32Array(cellCount * 2 * 4);
      this.foregroundUint8Array = new Uint8Array(cellCount * 4 * 4);
      this.foregroundDataView = new DataView(this.foregroundUint8Array.buffer);
      this.backgroundUint8Array = new Uint8Array(cellCount * 4 * 4);
      this.backgroundDataView = new DataView(this.backgroundUint8Array.buffer);
      this.frameBufferTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.pixelWidth, this.pixelHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.frameBuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameBufferTexture, 0);
      let i = 0;
      let j = 0;
      let k = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          this.positionsArray[i++] = interpolate(x, width);
          this.positionsArray[i++] = -interpolate(y, height);
          this.positionsArray[i++] = interpolate(x + 1, width);
          this.positionsArray[i++] = -interpolate(y, height);
          this.positionsArray[i++] = interpolate(x + 1, width);
          this.positionsArray[i++] = -interpolate(y + 1, height);
          this.positionsArray[i++] = interpolate(x, width);
          this.positionsArray[i++] = -interpolate(y + 1, height);
          this.indexArray[j++] = k + 0;
          this.indexArray[j++] = k + 1;
          this.indexArray[j++] = k + 2;
          this.indexArray[j++] = k + 0;
          this.indexArray[j++] = k + 2;
          this.indexArray[j++] = k + 3;
          k += 4;
        }
      }
      this.positionBuffer = gl.createBuffer();
      this.indexBuffer = gl.createBuffer();
      this.textureBuffer = gl.createBuffer();
      this.foregroundBuffer = gl.createBuffer();
      this.backgroundBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.positionsArray, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);
      this.texture = this.loadTexture(this.font.url);
      this.lastRenderTime = 0;
      this.renderDelta = 0;
      this.fps = 0;
      this.averageFps = 0;
      if (this.maxFps === void 0) {
        this.requestAnimationFrame();
      } else {
        window.setInterval(() => this.renderLoop(performance.now()), 1e3 / this.maxFps);
      }
    }
    handleResize() {
      const parent = this.canvas.parentElement;
      if (!parent) {
        return;
      }
      const widthFactor = parent.offsetWidth / this.pixelWidth;
      const heightFactor = parent.offsetHeight / this.pixelHeight;
      const factor = Math.min(widthFactor, heightFactor);
      const width = factor * this.pixelWidth | 0;
      const height = factor * this.pixelHeight | 0;
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
    }
    getAttribLocation(name) {
      const location = this.gl.getAttribLocation(this.program, name);
      this.gl.enableVertexAttribArray(location);
      return location;
    }
    flush() {
      let textureArrayIndex = 0;
      let colorArrayIndex = 0;
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.getCell(x, y);
          if (!cell.dirty) {
            textureArrayIndex += 8;
            colorArrayIndex += 16;
            continue;
          }
          const textureX = cell.charCode % 16;
          const textureY = cell.charCode / 16 | 0;
          this.textureArray[textureArrayIndex++] = textureX;
          this.textureArray[textureArrayIndex++] = textureY;
          this.textureArray[textureArrayIndex++] = textureX + 1;
          this.textureArray[textureArrayIndex++] = textureY;
          this.textureArray[textureArrayIndex++] = textureX + 1;
          this.textureArray[textureArrayIndex++] = textureY + 1;
          this.textureArray[textureArrayIndex++] = textureX;
          this.textureArray[textureArrayIndex++] = textureY + 1;
          for (let i = 0; i < 4; i++) {
            this.foregroundDataView.setUint32(colorArrayIndex, cell.fg, false);
            this.backgroundDataView.setUint32(colorArrayIndex, cell.bg, false);
            colorArrayIndex += 4;
          }
          cell.dirty = false;
        }
      }
    }
    isKeyDown(key) {
      return this.keys.getKey(key).down;
    }
    isKeyPressed(key) {
      return this.keys.getKey(key).isPressed();
    }
    getKeyDownCount(key) {
      return this.keys.getKey(key).downCount;
    }
    getMovementKey() {
      if (this.isKeyPressed(Key.VK_NUMPAD1) || this.isKeyPressed(Key.VK_B)) {
        return new Point(-1, 1);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD2) || this.isKeyPressed(Key.VK_J) || this.isKeyPressed(Key.VK_DOWN)) {
        return new Point(0, 1);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD3) || this.isKeyPressed(Key.VK_N)) {
        return new Point(1, 1);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD4) || this.isKeyPressed(Key.VK_H) || this.isKeyPressed(Key.VK_LEFT)) {
        return new Point(-1, 0);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD5) || this.isKeyPressed(Key.VK_PERIOD)) {
        return new Point(0, 0);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD6) || this.isKeyPressed(Key.VK_L) || this.isKeyPressed(Key.VK_RIGHT)) {
        return new Point(1, 0);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD7) || this.isKeyPressed(Key.VK_Y)) {
        return new Point(-1, -1);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD8) || this.isKeyPressed(Key.VK_K) || this.isKeyPressed(Key.VK_UP)) {
        return new Point(0, -1);
      }
      if (this.isKeyPressed(Key.VK_NUMPAD9) || this.isKeyPressed(Key.VK_U)) {
        return new Point(1, -1);
      }
      return void 0;
    }
    buildShader(type, source) {
      const gl = this.gl;
      const sh = gl.createShader(type);
      if (!sh) {
        throw new Error("An error occurred compiling the shader: ");
      }
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error("An error occurred compiling the shader: " + gl.getShaderInfoLog(sh));
      }
      return sh;
    }
    loadTexture(url) {
      const gl = this.gl;
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 0, 255]);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
      const image = new Image();
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      };
      image.src = url;
      return texture;
    }
    render() {
      const gl = this.gl;
      gl.clearColor(0, 0, 0, 1);
      gl.clearDepth(1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (this.crt) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.viewport(0, 0, this.pixelWidth, this.pixelHeight);
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttribLocation, numComponents, type, normalize, stride, offset);
      }
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureArray, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.textureAttribLocation, numComponents, type, normalize, stride, offset);
      }
      {
        const numComponents = 4;
        const type = gl.UNSIGNED_BYTE;
        const normalize = true;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.foregroundBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.foregroundUint8Array, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.fgColorAttribLocation, numComponents, type, normalize, stride, offset);
      }
      {
        const numComponents = 4;
        const type = gl.UNSIGNED_BYTE;
        const normalize = true;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.backgroundUint8Array, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.bgColorAttribLocation, numComponents, type, normalize, stride, offset);
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      {
        const vertexCount = this.width * this.height * 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
    }
    renderCrt() {
      const crt = this.crt;
      if (!crt) {
        return;
      }
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.pixelWidth * this.pixelScale, this.pixelHeight * this.pixelScale);
      gl.useProgram(this.crtProgram);
      gl.uniform1f(this.crtBlurLocation, crt.blur);
      gl.uniform1f(this.crtCurvatureLocation, crt.curvature);
      gl.uniform1f(this.crtChromaLocation, crt.chroma);
      gl.uniform1f(this.crtVignetteLocation, crt.vignette);
      gl.uniform1f(this.crtScanlineWidthLocation, crt.scanlineWidth);
      gl.uniform1f(this.crtScanlineIntensityLocation, crt.scanlineIntensity);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.crtPositionBuffer);
      gl.vertexAttribPointer(this.crtPositionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.crtTexCoordBuffer);
      gl.vertexAttribPointer(this.crtTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame() {
      window.requestAnimationFrame((t) => this.renderLoop(t));
    }
    renderLoop(time) {
      if (this.lastRenderTime === 0) {
        this.lastRenderTime = time;
        this.fps = 0;
      } else {
        this.renderDelta = time - this.lastRenderTime;
        this.lastRenderTime = time;
        this.fps = 1e3 / this.renderDelta;
        this.averageFps = 0.95 * this.averageFps + 0.05 * this.fps;
      }
      this.keys.updateKeys(time);
      this.mouse.update(time);
      if (this.update) {
        this.update();
      }
      this.flush();
      this.render();
      if (this.crt) {
        this.renderCrt();
      }
      if (this.maxFps === void 0) {
        this.requestAnimationFrame();
      }
    }
  };

  // src/RLKeyEvent.ts
  var keyChars = {
    [Key.VK_A]: "A",
    [Key.VK_B]: "B",
    [Key.VK_C]: "C",
    [Key.VK_D]: "D",
    [Key.VK_E]: "E",
    [Key.VK_F]: "F",
    [Key.VK_G]: "G",
    [Key.VK_H]: "H",
    [Key.VK_I]: "I",
    [Key.VK_J]: "J",
    [Key.VK_K]: "K",
    [Key.VK_L]: "L",
    [Key.VK_M]: "M",
    [Key.VK_N]: "N",
    [Key.VK_O]: "O",
    [Key.VK_P]: "P",
    [Key.VK_Q]: "Q",
    [Key.VK_R]: "R",
    [Key.VK_S]: "S",
    [Key.VK_T]: "T",
    [Key.VK_U]: "U",
    [Key.VK_V]: "V",
    [Key.VK_W]: "W",
    [Key.VK_X]: "X",
    [Key.VK_Y]: "Y",
    [Key.VK_Z]: "Z"
  };
  var RLKeyEvent = class {
    constructor(key, shift = false, ctrl = false, alt = false) {
      this.key = key;
      this.shift = shift;
      this.ctrl = ctrl;
      this.alt = alt;
      this.type = "KeyEvent";
      if (keyChars[key])
        this.char = keyChars[key];
    }
  };
  RLKeyEvent.type = "KeyEvent";

  // src/RLMouseEvent.ts
  var RLMouseEvent = class {
    constructor(event, x, y, button = NaN) {
      this.event = event;
      this.x = x;
      this.y = y;
      this.button = button;
      this.type = "MouseEvent";
    }
  };
  RLMouseEvent.type = "MouseEvent";

  // src/isAssignableTo.ts
  function isAssignableTo(o, type) {
    if (o.type === type)
      return true;
    if ((o.type === "component" || o.type === "tag") && o.typeName === type)
      return true;
    if (o.type === "char" && type === "str")
      return true;
    return false;
  }

  // src/Game.ts
  var metaKeys = [
    Key.VK_CONTROL_LEFT,
    Key.VK_CONTROL_RIGHT,
    Key.VK_SHIFT_LEFT,
    Key.VK_SHIFT_RIGHT,
    Key.VK_ALT_LEFT,
    Key.VK_ALT_RIGHT
  ];
  var Game = class {
    constructor(rl, canvas) {
      this.rl = rl;
      this.canvas = canvas;
      Game.instance = this;
      window.G = this;
      this.width = 80;
      this.height = 50;
      this.running = false;
      this.mouseX = NaN;
      this.mouseY = NaN;
      this.afterInit = [];
    }
    init() {
      this.afterInit = [];
      this.rl.callNamedFunction("main");
      this.terminal = new Terminal(this.canvas, this.width, this.height);
      this.terminal.update = this.terminalUpdate.bind(this);
      for (const pending of this.afterInit.splice(0))
        pending(this.terminal);
    }
    start() {
      return __async(this, null, function* () {
        let count = 0;
        this.running = true;
        const activated = /* @__PURE__ */ new Set();
        while (this.running) {
          activated.clear();
          let fired = false;
          for (const sys of this.rl.systems) {
            if (this.trySystem(sys)) {
              activated.add(sys.name);
              fired = true;
            }
          }
          if (!fired) {
            count = 0;
            const key = yield this.getKey();
            const sys = this.rl.keyHandlers.top;
            this.trySystem(sys, {
              type: "typed",
              typeName: "KeyEvent",
              value: key
            });
          } else {
            count++;
            if (count > 5e3) {
              this.running = false;
              console.warn("Suspected infinite loop.", activated);
            }
          }
        }
      });
    }
    terminalUpdate() {
      if (this.rl.mouseHandlers.empty)
        return;
      if (this.mouseX !== this.terminal.mouse.x || this.mouseY !== this.terminal.mouse.y) {
        this.mouseX = this.terminal.mouse.x;
        this.mouseY = this.terminal.mouse.y;
        const sys = this.rl.mouseHandlers.top;
        this.trySystem(sys, {
          type: "typed",
          typeName: "MouseEvent",
          value: new RLMouseEvent("move", this.mouseX, this.mouseY)
        });
      }
    }
    trySystem(sys, ...args) {
      if (!sys.enabled)
        return;
      for (const e of sys.externals) {
        if (typeof e.default !== "undefined")
          continue;
        const a = args.find(
          (a2) => a2.type === "named" && a2.name === e.name || a2.type === "typed" && isAssignableTo(a2.value, a2.typeName)
        );
        if (!a)
          return;
      }
      if (sys.params.length === 0) {
        const result = this.rl.runSystem(sys, ...args);
        return result !== false;
      }
      const hasEntityParam = sys.params.find((p) => p.typeName === "entity");
      if (hasEntityParam) {
        const matches = sys.query.get();
        if (matches.length) {
          for (const e of matches)
            this.rl.runSystem(
              sys,
              { type: "typed", typeName: "entity", value: e },
              ...args
            );
          return true;
        }
      } else {
        this.rl.runSystem(sys, ...args);
        return true;
      }
      return false;
    }
    getKey() {
      return __async(this, null, function* () {
        return new Promise((resolve) => {
          const handler = () => {
            const shift = this.terminal.isKeyDown(Key.VK_SHIFT_LEFT);
            const ctrl = this.terminal.isKeyDown(Key.VK_CONTROL_LEFT);
            const alt = this.terminal.isKeyDown(Key.VK_ALT_LEFT);
            for (const [key, input] of this.terminal.keys.keys.inputs) {
              if (metaKeys.includes(key))
                continue;
              if (input.isPressed())
                return resolve(new RLKeyEvent(key, shift, ctrl, alt));
            }
            requestAnimationFrame(handler);
          };
          requestAnimationFrame(handler);
        });
      });
    }
  };

  // src/RLQuery.ts
  var RLQuery = class {
    constructor(parent, types) {
      this.parent = parent;
      this.types = types;
    }
    get() {
      return Array.from(this.parent.entities.values()).filter(
        (e) => this.match(e)
      );
    }
    match(e) {
      for (const type of this.types) {
        if (!e.has(type))
          return false;
      }
      return true;
    }
  };

  // src/Stack.ts
  var Stack = class {
    constructor(items = []) {
      this.items = items;
    }
    get empty() {
      return this.items.length < 1;
    }
    get top() {
      if (this.items.length)
        return this.items[this.items.length - 1];
      throw new Error("Stack is empty");
    }
    push(item) {
      this.items.push(item);
    }
    pop() {
      return this.items.pop();
    }
    clear() {
      this.items.splice(0);
    }
  };

  // src/RL.ts
  var RL = class {
    constructor(lib2, ...envs) {
      this.lib = lib2;
      RL.instance = this;
      this.env = /* @__PURE__ */ new Map();
      for (const env of envs) {
        for (const [key, value] of env)
          this.env.set(key, value);
      }
      this.entities = /* @__PURE__ */ new Map();
      this.keyHandlers = new Stack();
      this.mouseHandlers = new Stack();
      this.systems = Array.from(this.env.values()).filter(
        (o) => o.type === "system"
      );
      for (const sys of this.systems)
        sys.query = this.makeQuery(sys);
    }
    makeQuery(sys) {
      return new RLQuery(this, sys.componentTypes);
    }
    callNamedFunction(name, ...args) {
      const fn = this.env.get(name);
      if (!fn)
        throw new Error(`Unknown function: ${name}`);
      if (fn.type !== "fn")
        throw new Error(`Not a function: ${name}`);
      return fn.apply(args);
    }
    runSystem(sys, ...args) {
      return sys.apply(args);
    }
  };

  // src/Serializer.ts
  var boolean = {
    ser: (b) => b ? "T" : "F",
    des: (data) => data === "T"
  };
  var object = {
    ser: (o) => Object.fromEntries(
      Object.entries(o).map(([key, val]) => [
        key,
        Serializer.instance.serialize(getTypeName(val), val)
      ])
    ),
    des: (data) => Object.fromEntries(
      Object.entries(data).map(([key, val]) => [
        key,
        Serializer.instance.deserialize(val)
      ])
    )
  };
  var string = {
    ser: (s) => s,
    des: (s) => s
  };
  var number = {
    ser: (n) => n,
    des: (n) => n
  };
  var set = {
    ser: (s) => Array.from(s).map((o) => Serializer.instance.serialize(getTypeName(o), o)),
    des: (data) => new Set(data.map((o) => Serializer.instance.deserialize(o)))
  };
  var Serializer = class {
    constructor() {
      this.entries = /* @__PURE__ */ new Map([
        ["n:boolean", boolean],
        ["n:number", number],
        ["n:object", object],
        ["n:string", string],
        ["set", set]
      ]);
    }
    add(type, ser, des) {
      this.entries.set(type, { ser, des });
    }
    alias(type, other) {
      this.entries.set(type, this.get(other));
    }
    get(type) {
      const e = this.entries.get(type);
      if (!e)
        throw new Error(`No serializer for: ${type}`);
      return e;
    }
    serialize(type, obj) {
      return [type, this.get(type).ser(obj)];
    }
    deserialize([type, data], obj) {
      return this.get(type).des(data, obj);
    }
  };
  Serializer.instance = new Serializer();
  function getTypeName(o) {
    const to = typeof o;
    if (to !== "object")
      return "n:" + to;
    if ("type" in o)
      return o.type;
    if (o instanceof Set)
      return "set";
    if (o instanceof Map)
      return "map";
    return "n:object";
  }

  // src/RLBag.ts
  var RLBag = class {
    constructor(capacity) {
      this.capacity = capacity;
      this.type = "bag";
      this.items = /* @__PURE__ */ new Map();
    }
    get count() {
      return this.items.size;
    }
    getKeyByIndex(i) {
      return String.fromCharCode(i + 65);
    }
    getFreeKey() {
      for (let i = 0; i < this.capacity; i++) {
        const key = this.getKeyByIndex(i);
        if (!this.items.has(key))
          return key;
      }
    }
    add(item) {
      const key = this.getFreeKey();
      if (key)
        this.items.set(key, item);
      return key;
    }
    get(key) {
      return this.items.get(key);
    }
    has(key) {
      return this.items.has(key);
    }
    contains(item) {
      return Array.from(this.items.values()).includes(item);
    }
    remove(key) {
      this.items.delete(key);
    }
    serialize() {
      const { capacity } = this;
      const items = [];
      for (const [key, item] of this.items)
        items.push([key, Serializer.instance.serialize(getTypeName(item), item)]);
      return { capacity, items };
    }
    static deserialize(data) {
      const b = new RLBag(data.capacity);
      b.items.clear();
      for (const [key, obj] of data.items)
        b.items.set(key, Serializer.instance.deserialize(obj));
      return b;
    }
  };
  Serializer.instance.add(
    "bag",
    (b) => b.serialize(),
    (data) => RLBag.deserialize(data)
  );

  // src/getParam.ts
  function getParam(params, predicate) {
    const i = params.findIndex(predicate);
    return [i, i < 0 ? void 0 : params[i]];
  }

  // src/isAssignableToAny.ts
  function isAssignableToAny(o, types) {
    for (const type of types) {
      if (isAssignableTo(o, type))
        return true;
    }
    return false;
  }

  // src/resolveArgs.ts
  function resolveArgs(args, params, variadic) {
    var _a;
    const results = params.map((p) => p.default);
    const filled = /* @__PURE__ */ new Set();
    const get = (predicate) => getParam(params, predicate);
    const set2 = (i, value) => {
      if (filled.has(i))
        throw new Error(`Param #${i} set twice`);
      if (i >= results.length) {
        if (variadic.length === 0)
          throw new Error(`Function only has ${results.length} params`);
        if (!isAssignableToAny(value, variadic))
          throw new Error(
            `Function variadic type is '${variadic.join("|")}', got ${value.type}`
          );
      } else if (!isAssignableTo(value, params[i].typeName))
        throw new Error(
          `Param #${i} expects type '${params[i].typeName}', got ${value.type}`
        );
      results[i] = value;
      filled.add(i);
    };
    let pos = 0;
    for (const a of args) {
      switch (a.type) {
        case "typed": {
          const [i, p] = get((p2) => p2.typeName === a.typeName);
          if (!p)
            throw new Error(`No param of type ${a.typeName}`);
          set2(i, a.value);
          break;
        }
        case "named": {
          const [i, p] = get((p2) => p2.name === a.name);
          if (!p)
            throw new Error(`No param with name ${a.name}`);
          set2(i, a.value);
          break;
        }
        case "positional": {
          set2(pos, a.value);
          pos++;
          break;
        }
      }
    }
    const entity = (_a = args.find((p) => p.value.type === "entity")) == null ? void 0 : _a.value;
    for (let i = 0; i < results.length; i++) {
      if (typeof results[i] === "undefined") {
        if (entity && entity.has(params[i].typeName)) {
          results[i] = entity.get(params[i].typeName);
          continue;
        }
        throw new Error(`Param #${i} not filled`);
      }
    }
    return results;
  }

  // src/RLFn.ts
  var RLFn = class {
    constructor(name, code, params, variadic = []) {
      this.name = name;
      this.code = code;
      this.params = params;
      this.variadic = variadic;
      this.type = "fn";
    }
    apply(args) {
      const resolved = resolveArgs(args, this.params, this.variadic);
      return this.code(...resolved);
    }
  };
  RLFn.type = "fn";

  // src/RLGrid.ts
  var import_bresenham = __toESM(require_bresenham());
  var RLGrid = class {
    constructor(width, height, empty) {
      this.width = width;
      this.height = height;
      this.empty = empty;
      this.type = "grid";
      this.contents = /* @__PURE__ */ new Map();
      this.itemType = getTypeName(empty);
    }
    tag(x, y) {
      return `${x},${y}`;
    }
    at(x, y) {
      return this.atOr(x, y, this.empty);
    }
    atOr(x, y, empty) {
      const tag = this.tag(x, y);
      const item = this.contents.get(tag);
      return typeof item === "undefined" ? empty : item;
    }
    put(x, y, item) {
      const tag = this.tag(x, y);
      if (item === this.empty)
        this.contents.delete(tag);
      else
        this.contents.set(this.tag(x, y), item);
    }
    clear() {
      this.contents.clear();
    }
    fill(item) {
      this.rect(0, 0, this.width - 1, this.height - 1, item);
    }
    rect(sx, sy, ex, ey, item) {
      for (let y = sy; y <= ey; y++) {
        for (let x = sx; x <= ex; x++) {
          this.put(x, y, item);
        }
      }
    }
    findInRegion(region, item) {
      for (let y = region.y; y <= region.y2; y++) {
        for (let x = region.x; x <= region.x2; x++) {
          if (this.at(x, y) === item)
            return true;
        }
      }
      return false;
    }
    line(x1, y1, x2, y2, item) {
      (0, import_bresenham.default)(x1, y1, x2, y2, (x, y) => this.put(x, y, item));
    }
    draw() {
      RL.instance.lib.drawGrid(this);
    }
    serialize() {
      const { width, height, itemType } = this;
      const contents = {};
      for (const [tag, item] of this.contents)
        contents[tag] = Serializer.instance.serialize(itemType, item)[1];
      return { width, height, contents };
    }
    deserialize(data) {
      this.width = data.width;
      this.height = data.height;
      this.contents.clear();
      for (const tag in data.contents) {
        this.contents.set(
          tag,
          Serializer.instance.deserialize([this.itemType, data.contents[tag]])
        );
      }
      return this;
    }
  };
  RLGrid.type = "grid";
  Serializer.instance.add(
    "grid",
    (g) => g.serialize(),
    (data, g) => g.deserialize(data)
  );

  // node_modules/tinycolor-ts/dist/module/util.js
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.includes(".") && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.includes("%");
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return Number(n) * 100 + "%";
    }
    return n;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }

  // node_modules/tinycolor-ts/dist/module/conversion.js
  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    return { h, s, l };
  }
  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
      g = l;
      b = l;
      r = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    return { h, s, v };
  }
  function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16)),
      pad2(convertDecimalToHex(a))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
  }
  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return {
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  }

  // node_modules/tinycolor-ts/dist/module/css-color-names.js
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };

  // node_modules/tinycolor-ts/dist/module/format-input.js
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }

  // node_modules/tinycolor-ts/dist/module/index.js
  var TinyColor = function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R;
      var G;
      var B;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h = Math.round(hsv.h * 360);
      var s = Math.round(hsv.s * 100);
      var v = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h = Math.round(hsl.h * 360);
      var s = Math.round(hsl.s * 100);
      var l = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r = Math.round(this.r);
      var g = Math.round(this.g);
      var b = Math.round(this.b);
      return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x) {
        return Math.round(bound01(x, 255) * 100) + "%";
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x) {
        return Math.round(bound01(x, 255) * 100);
      };
      return this.a === 1 ? "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)" : "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (hex === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format) {
      var formatSet = Boolean(format);
      format = format !== null && format !== void 0 ? format : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
      if (needsAlphaFormat) {
        if (format === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }
      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format === "name") {
        formattedString = this.toName();
      }
      if (format === "hsl") {
        formattedString = this.toHslString();
      }
      if (format === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p + rgb1.r,
        g: (rgb2.g - rgb1.g) * p + rgb1.g,
        b: (rgb2.b - rgb1.b) * p + rgb1.b,
        a: (rgb2.a - rgb1.a) * p + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h = hsv.h;
      var s = hsv.s;
      var v = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({ h, s, v }));
        v = (v + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h = hsl.h;
      return [
        this,
        new TinyColor2({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
        new TinyColor2({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
      ];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      return new TinyColor2({
        r: bg.r + (fg.r - bg.r) * fg.a,
        g: bg.g + (fg.g - bg.g) * fg.a,
        b: bg.b + (fg.b - bg.b) * fg.a
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n) {
      var hsl = this.toHsl();
      var h = hsl.h;
      var result = [this];
      var increment = 360 / n;
      for (var i = 1; i < n; i++) {
        result.push(new TinyColor2({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }();

  // src/RLMessages.ts
  var Message3 = class {
    constructor(text, fg, count = 1) {
      this.text = text;
      this.fg = fg;
      this.count = count;
    }
    get fullText() {
      if (this.count > 1)
        return `${this.text} (x${this.count})`;
      return this.text;
    }
    serialize() {
      const { text, fg, count } = this;
      return [text, fg, count];
    }
    static deserialize([text, fg, count]) {
      return new Message3(text, fg, count);
    }
  };
  var RLMessages = class {
    constructor(messages = []) {
      this.messages = messages;
      this.dirty = false;
      this.type = "messages";
    }
    get length() {
      return this.messages.length;
    }
    clear() {
      this.dirty = true;
      this.messages.splice(0);
    }
    add(text, fg = "white", stack = true) {
      const top = this.messages.at(-1);
      if (stack && (top == null ? void 0 : top.text) === text)
        top.count++;
      else
        this.messages.push(new Message3(text, fg));
      this.dirty = true;
    }
    latest(size, offset = 0) {
      const start = this.length - offset - size;
      if (start < 0)
        return this.messages.slice().reverse();
      const end = start + size;
      return this.messages.slice(start, end).reverse();
    }
    render(term, x, y, width, height, offset = 0) {
      this.dirty = false;
      term.fillRect(x, y, width, height, " ");
      let yOffset = height - 1;
      for (const msg of this.latest(height, offset)) {
        const text = wordWrap(msg.fullText, width).reverse();
        const fg = new TinyColor(msg.fg).toNumber() << 8;
        for (const line of text) {
          term.drawString(x, y + yOffset--, line, fg, 0);
          if (yOffset < 0)
            return;
        }
      }
    }
    serialize() {
      return this.messages.map((m) => m.serialize());
    }
    deserialize(data) {
      this.messages = data.map((m) => Message3.deserialize(m));
      this.dirty = true;
      return this;
    }
  };
  Serializer.instance.add(
    "messages",
    (m) => m.serialize(),
    (data, m) => m.deserialize(data)
  );

  // src/RLXY.ts
  var _RLXY = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.type = "xy";
    }
    equals(o) {
      return this.x === o.x && this.y === o.y;
    }
    plus(o) {
      return new _RLXY(this.x + o.x, this.y + o.y);
    }
  };
  var RLXY = _RLXY;
  RLXY.type = "xy";

  // src/RLRect.ts
  var RLRect = class {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.type = "rect";
    }
    get x2() {
      return this.x + this.width;
    }
    get y2() {
      return this.y + this.height;
    }
    get cx() {
      return Math.floor(this.x + this.width / 2);
    }
    get cy() {
      return Math.floor(this.y + this.height / 2);
    }
    get centre() {
      return new RLXY(this.cx, this.cy);
    }
    intersects(o) {
      return this.x <= o.x2 && this.x2 >= o.x && this.y <= o.y2 && this.y2 >= o.y;
    }
  };
  RLRect.type = "rect";

  // src/isConstraint.ts
  function isConstraint(p) {
    return [
      "Appearance",
      "OldPosition",
      "Position",
      "MoveAction",
      "MeleeAction",
      "Actor",
      "Fighter",
      "Consumable",
      "Inventory",
      "InventoryActionConfig",
      "TargetingActionConfig",
      "TargetingItemConfig",
      "ConfusedEnemy",
      "Progress",
      "IsBlocker",
      "IsPlayer",
      "RecalculateFOV",
      "RedrawMe",
      "RedrawUI",
      "MyTurn",
      "HostileEnemy",
      "WaitAction",
      "HistoryAction",
      "Item",
      "PickupAction",
      "InventoryAction",
      "DropAction",
      "LookAction",
      "QuitAction",
      "TakeStairsAction",
      "GainingLevel",
      "CharacterInfoAction"
    ].includes(p.typeName);
  }

  // src/isExternal.ts
  function isExternal(p) {
    return p.typeName !== "entity" && !isConstraint(p);
  }

  // src/RLSystem.ts
  var RLSystem = class {
    constructor(name, code, allParams, enabled = true) {
      this.name = name;
      this.code = code;
      this.allParams = allParams;
      this.enabled = enabled;
      this.type = "system";
      this.componentTypes = allParams.filter(isConstraint).map((p) => p.typeName);
      this.externals = allParams.filter(isExternal);
      this.params = allParams.filter((p) => p.type === "param");
    }
    apply(args) {
      const resolved = resolveArgs(args, this.params, []);
      return this.code(...resolved);
    }
    enable() {
      this.enabled = true;
    }
    disable() {
      this.enabled = false;
    }
  };
  RLSystem.type = "system";

  // src/RLTag.ts
  var RLTag = class {
    constructor(typeName) {
      this.typeName = typeName;
      this.type = "tag";
    }
  };
  RLTag.type = "tag";
  Serializer.instance.add(
    "tag",
    (t) => t.typeName,
    (data) => new RLTag(data)
  );

  // src/RLTile.ts
  var _RLTile = class {
    constructor(ch, walkable, transparent) {
      this.ch = ch;
      this.walkable = walkable;
      this.transparent = transparent;
      _RLTile.registry[ch] = this;
      this.type = "tile";
    }
  };
  var RLTile = _RLTile;
  RLTile.registry = {};
  RLTile.type = "tile";
  Serializer.instance.add(
    "tile",
    (t) => t.ch,
    (ch) => RLTile.registry[ch]
  );

  // src/impl.ts
  function implementation(__lib) {
    let Layer;
    ((Layer2) => {
      Layer2[Layer2["Nothing"] = 0] = "Nothing";
      Layer2[Layer2["Corpse"] = 1] = "Corpse";
      Layer2[Layer2["Item"] = 2] = "Item";
      Layer2[Layer2["Enemy"] = 3] = "Enemy";
      Layer2[Layer2["Player"] = 4] = "Player";
    })(Layer || (Layer = {}));
    const IsBlocker = new RLTag("IsBlocker");
    const IsPlayer = new RLTag("IsPlayer");
    const RecalculateFOV = new RLTag("RecalculateFOV");
    const RedrawMe = new RLTag("RedrawMe");
    const RedrawUI = new RLTag("RedrawUI");
    const MyTurn = new RLTag("MyTurn");
    const HostileEnemy = new RLTag("HostileEnemy");
    const WaitAction = new RLTag("WaitAction");
    const HistoryAction = new RLTag("HistoryAction");
    const Item = new RLTag("Item");
    const PickupAction = new RLTag("PickupAction");
    const InventoryAction = new RLTag("InventoryAction");
    const DropAction = new RLTag("DropAction");
    const LookAction = new RLTag("LookAction");
    const QuitAction = new RLTag("QuitAction");
    const TakeStairsAction = new RLTag("TakeStairsAction");
    const GainingLevel = new RLTag("GainingLevel");
    const CharacterInfoAction = new RLTag("CharacterInfoAction");
    const mkAppearance = (name, ch, fg, bg, layer) => ({
      type: "component",
      typeName: "Appearance",
      name,
      ch,
      fg,
      bg,
      layer
    });
    const mkOldPosition = (x, y) => ({
      type: "component",
      typeName: "OldPosition",
      x,
      y
    });
    const mkPosition = (x, y) => ({
      type: "component",
      typeName: "Position",
      x,
      y
    });
    const mkMoveAction = (x, y) => ({
      type: "component",
      typeName: "MoveAction",
      x,
      y
    });
    const mkMeleeAction = (target) => ({
      type: "component",
      typeName: "MeleeAction",
      target
    });
    const mkActor = (energy) => ({
      type: "component",
      typeName: "Actor",
      energy
    });
    const mkFighter = (maxHp, hp, defence, power, xp) => ({
      type: "component",
      typeName: "Fighter",
      maxHp,
      hp,
      defence,
      power,
      xp
    });
    const mkConsumable = (activate, power, range, targeted, radius) => ({
      type: "component",
      typeName: "Consumable",
      activate,
      power,
      range,
      targeted,
      radius
    });
    const mkInventory = (items) => ({
      type: "component",
      typeName: "Inventory",
      items
    });
    const mkInventoryActionConfig = (callback) => ({
      type: "component",
      typeName: "InventoryActionConfig",
      callback
    });
    const mkTargetingActionConfig = (callback, radius) => ({
      type: "component",
      typeName: "TargetingActionConfig",
      callback,
      radius
    });
    const mkTargetingItemConfig = (key, item) => ({
      type: "component",
      typeName: "TargetingItemConfig",
      key,
      item
    });
    const mkConfusedEnemy = (duration, old) => ({
      type: "component",
      typeName: "ConfusedEnemy",
      duration,
      old
    });
    const mkProgress = (floor2, level, formulaBase, formulaFactor) => ({
      type: "component",
      typeName: "Progress",
      floor: floor2,
      level,
      formulaBase,
      formulaFactor
    });
    const tmPlayer = {
      type: "template",
      name: "Player",
      get: () => [
        IsBlocker,
        IsPlayer,
        mkAppearance("player", "@", "white", "black", 4 /* Player */),
        mkFighter(30, 30, 2, 5, 0),
        mkActor(100),
        mkInventory(new RLBag(20)),
        MyTurn,
        RecalculateFOV,
        RedrawUI,
        mkProgress(1, 1, 0, 200)
      ]
    };
    const tmEnemy = {
      type: "template",
      name: "Enemy",
      get: () => [IsBlocker, HostileEnemy, mkActor(1)]
    };
    const tmOrc = {
      type: "template",
      name: "Orc",
      get: () => [
        tmEnemy,
        mkAppearance("orc", "o", "green", "black", 3 /* Enemy */),
        mkFighter(10, 10, 0, 3, 35)
      ]
    };
    const tmTroll = {
      type: "template",
      name: "Troll",
      get: () => [
        tmEnemy,
        mkAppearance("troll", "T", "lime", "black", 3 /* Enemy */),
        mkFighter(16, 16, 1, 4, 100)
      ]
    };
    const tmCorpse = {
      type: "template",
      name: "Corpse",
      get: () => [
        RedrawMe,
        mkAppearance("corpse", "%", "red", "black", 1 /* Corpse */)
      ]
    };
    const tmHealingPotion = {
      type: "template",
      name: "HealingPotion",
      get: () => [
        Item,
        mkAppearance("healing potion", "!", "purple", "black", 2 /* Item */),
        mkConsumable(healingItem, 4, 0, false, 0)
      ]
    };
    const tmLightningScroll = {
      type: "template",
      name: "LightningScroll",
      get: () => [
        Item,
        mkAppearance("lightning scroll", "~", "cyan", "black", 2 /* Item */),
        mkConsumable(zapItem, 20, 5, false, 0)
      ]
    };
    const tmConfusionScroll = {
      type: "template",
      name: "ConfusionScroll",
      get: () => [
        Item,
        mkAppearance("confusion scroll", "~", "#cf3fff", "black", 2 /* Item */),
        mkConsumable(confuseItem, 10, 100, true, 0)
      ]
    };
    const tmFireballScroll = {
      type: "template",
      name: "FireballScroll",
      get: () => [
        Item,
        mkAppearance("fireball scroll", "~", "#ff0000", "black", 2 /* Item */),
        mkConsumable(fireballItem, 12, 100, true, 3)
      ]
    };
    const Floor = new RLTile(".", true, true);
    const Wall = new RLTile("#", false, false);
    const DownStairs = new RLTile(">", true, true);
    const impossible = "#808080";
    const healed = "#00ff00";
    const playerDied = "#ff3030";
    const enemyDied = "#ffa030";
    const playerAttack = "#e0e0e0";
    const enemyAttack = "#ffc0c0";
    const welcomeText = "#20a0ff";
    const needsTarget = "#3fffff";
    const statusApplied = "#3fff3f";
    const menuTitle = "#ffff3f";
    const descended = "#9f3fff";
    const gameWidth = 80;
    const gameHeight = 50;
    const mapWidth = gameWidth;
    const mapHeight = gameHeight - 5;
    const hoverX = 0;
    const hoverY = mapHeight;
    const hpX = 0;
    const hpY = hoverY + 1;
    const hpWidth = 20;
    const xpX = hpX;
    const xpY = hpY + 1;
    const xpWidth = hpWidth;
    const floorX = hpX;
    const floorY = hpY + 2;
    const logX = hpWidth + 2;
    const logY = hpY;
    const maxEnemiesPerRoom = 2;
    const maxItemsPerRoom = 2;
    const map = new RLGrid(mapWidth, mapHeight, Wall);
    __lib.persist({ type: "str", value: "map" }, map);
    const explored = new RLGrid(mapWidth, mapHeight, false);
    __lib.persist({ type: "str", value: "explored" }, explored);
    const visible = new RLGrid(mapWidth, mapHeight, false);
    __lib.persist({ type: "str", value: "visible" }, visible);
    const log = new RLMessages();
    __lib.persist({ type: "str", value: "log" }, log);
    let targetAt = new RLXY(-1, -1);
    let targetSize = 1;
    let historyOffset = 0;
    function distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return __lib.sqrt({ type: "int", value: dx * dx + dy * dy });
    }
    const fn_distance = new RLFn("distance", distance, [
      { type: "param", name: "a", typeName: "xy" },
      { type: "param", name: "b", typeName: "xy" }
    ]);
    function healingItem(pc, item) {
      if (!pc.Fighter) {
        log.add("You can't use that.", impossible);
        return false;
      }
      if (pc.Fighter.hp >= pc.Fighter.maxHp) {
        log.add("You're already healthy.", impossible);
        return false;
      }
      const oldHp = pc.Fighter.hp;
      pc.Fighter.hp = __lib.clamp(
        { type: "int", value: oldHp + item.Consumable.power },
        { type: "int", value: 0 },
        { type: "int", value: pc.Fighter.maxHp }
      );
      const gained = pc.Fighter.hp - oldHp;
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "You healed for" },
          { type: "int", value: gained },
          { type: "str", value: "hp" }
        ),
        healed
      );
      pc.add(RedrawUI);
      return true;
    }
    const fn_healingItem = new RLFn("healingItem", healingItem, [
      { type: "param", name: "pc", typeName: "entity" },
      { type: "param", name: "item", typeName: "entity" }
    ]);
    function zapItem(pc, item) {
      let target;
      let closest = item.Consumable.range + 1;
      for (const t of new RLQuery(RL.instance, ["Position", "Fighter"]).get()) {
        const { Position: p } = t;
        if (t != pc && visible.at(p.x, p.y)) {
          const d = distance(
            new RLXY(pc.Position.x, pc.Position.y),
            new RLXY(p.x, p.y)
          );
          if (d < closest) {
            closest = d;
            target = t;
          }
        }
      }
      if (target) {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "A lightning bolt strikes" },
            { type: "str", value: target.Appearance.name },
            { type: "str", value: "for" },
            { type: "int", value: item.Consumable.power },
            { type: "str", value: "damage!" }
          )
        );
        hurt(target, item.Consumable.power, pc);
        return true;
      }
      log.add("No enemy is close enough.", impossible);
      return false;
    }
    const fn_zapItem = new RLFn("zapItem", zapItem, [
      { type: "param", name: "pc", typeName: "entity" },
      { type: "param", name: "item", typeName: "entity" }
    ]);
    function confuseItem(pc, item, target) {
      if (!visible.at(target.x, target.y)) {
        log.add("Cannot target there.", impossible);
        return false;
      }
      const victim = __lib.find(
        "Actor",
        mkPosition(target.x, target.y)
      );
      if (!victim) {
        log.add("No target.", impossible);
        return false;
      }
      if (victim == pc) {
        log.add("Cannot confuse yourself!", impossible);
        return false;
      }
      const ai = ((__match) => {
        if (__match.has(HostileEnemy.typeName))
          return HostileEnemy;
      })(victim);
      if (!ai) {
        log.add("Cannot be confused.", impossible);
        return false;
      }
      log.add(
        __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "The eyes of the" },
          { type: "str", value: getName(victim) },
          { type: "str", value: "look vacant." }
        ),
        statusApplied
      );
      victim.add(mkConfusedEnemy(item.Consumable.power, ai));
      victim.remove(ai);
      return true;
    }
    const fn_confuseItem = new RLFn("confuseItem", confuseItem, [
      { type: "param", name: "pc", typeName: "entity" },
      { type: "param", name: "item", typeName: "entity" },
      { type: "param", name: "target", typeName: "xy" }
    ]);
    function fireballItem(pc, item, target) {
      if (!visible.at(target.x, target.y)) {
        log.add("Cannot target there.", impossible);
        return false;
      }
      const damage = item.Consumable.power;
      let hit = false;
      for (const t of new RLQuery(RL.instance, ["Position", "Fighter"]).get()) {
        const { Position: p } = t;
        if (distance(target, new RLXY(p.x, p.y)) <= item.Consumable.radius) {
          log.add(
            __lib.join(
              { type: "char", value: " " },
              { type: "str", value: "The" },
              { type: "str", value: getName(t) },
              { type: "str", value: "is engulfed in fire, taking" },
              { type: "int", value: damage },
              { type: "str", value: "damage" }
            )
          );
          hurt(t, damage, pc);
          hit = true;
        }
      }
      if (!hit) {
        log.add("No targets in range.", impossible);
      }
      return hit;
    }
    const fn_fireballItem = new RLFn("fireballItem", fireballItem, [
      { type: "param", name: "pc", typeName: "entity" },
      { type: "param", name: "item", typeName: "entity" },
      { type: "param", name: "target", typeName: "xy" }
    ]);
    function redrawEverything(e) {
      __lib.clear();
      e.add(RecalculateFOV);
      e.add(RedrawUI);
      log.dirty = true;
    }
    const fn_redrawEverything = new RLFn("redrawEverything", redrawEverything, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function getKey(k) {
      return ((__match) => {
        if (__match === "ArrowUp")
          return "up";
        else if (__match === "ArrowRight")
          return "right";
        else if (__match === "ArrowDown")
          return "down";
        else if (__match === "ArrowLeft")
          return "left";
        else if (__match === "Numpad8")
          return "up";
        else if (__match === "Numpad6")
          return "right";
        else if (__match === "Numpad2")
          return "down";
        else if (__match === "Numpad4")
          return "left";
        else if (__match === "Numpad5")
          return "wait";
        else if (__match === "KeyK")
          return "up";
        else if (__match === "KeyL")
          return "right";
        else if (__match === "KeyJ")
          return "down";
        else if (__match === "KeyH")
          return "left";
        else if (__match === "Period")
          return "wait";
        else if (__match === "KeyC")
          return "character";
        else if (__match === "KeyD")
          return "drop";
        else if (__match === "KeyG")
          return "pickup";
        else if (__match === "KeyI")
          return "inventory";
        else if (__match === "KeyV")
          return "history";
        else if (__match === "Slash")
          return "look";
        else if (__match === "Enter")
          return "confirm";
        else if (__match === "NumpadEnter")
          return "confirm";
        else if (__match === "Escape")
          return "quit";
        else
          return k;
      })(k);
    }
    const fn_getKey = new RLFn("getKey", getKey, [
      { type: "param", name: "k", typeName: "str" }
    ]);
    function getNamesAtLocation(x, y) {
      let total;
      for (const _entity of new RLQuery(RL.instance, [
        "Appearance",
        "Position"
      ]).get()) {
        const { Appearance: a, Position: p } = _entity;
        if (p.x == x && p.y == y) {
          if (total) {
            total = __lib.join(
              { type: "str", value: ", " },
              { type: "str", value: total },
              { type: "str", value: a.name }
            );
          } else {
            total = a.name;
          }
        }
      }
      return total;
    }
    const fn_getNamesAtLocation = new RLFn(
      "getNamesAtLocation",
      getNamesAtLocation,
      [
        { type: "param", name: "x", typeName: "int" },
        { type: "param", name: "y", typeName: "int" }
      ]
    );
    function showNamesAt(x, y) {
      __lib.draw(
        { type: "int", value: hoverX },
        { type: "int", value: hoverY },
        {
          type: "str",
          value: __lib.repeat(
            { type: "char", value: " " },
            { type: "int", value: gameWidth }
          )
        },
        { type: "str", value: "white" },
        { type: "str", value: "black" }
      );
      if (visible.at(x, y)) {
        const names2 = getNamesAtLocation(x, y);
        if (names2) {
          __lib.draw(
            { type: "int", value: hoverX },
            { type: "int", value: hoverY },
            { type: "str", value: names2 },
            { type: "str", value: "white" }
          );
        }
      }
    }
    const fn_showNamesAt = new RLFn("showNamesAt", showNamesAt, [
      { type: "param", name: "x", typeName: "int" },
      { type: "param", name: "y", typeName: "int" }
    ]);
    function getBlockingMap() {
      const blocked = new RLGrid(mapWidth, mapHeight, false);
      for (const _entity of new RLQuery(RL.instance, [
        "Position",
        "IsBlocker"
      ]).get()) {
        const { Position: p } = _entity;
        blocked.put(p.x, p.y, true);
      }
      return blocked;
    }
    const fn_getBlockingMap = new RLFn("getBlockingMap", getBlockingMap, []);
    function getRandomMove() {
      return ((__match) => {
        if (__match === 1)
          return mkMoveAction(0, -1);
        else if (__match === 2)
          return mkMoveAction(1, 0);
        else if (__match === 3)
          return mkMoveAction(0, 1);
        else if (__match === 4)
          return mkMoveAction(-1, 0);
      })(__lib.randInt({ type: "int", value: 1 }, { type: "int", value: 4 }));
    }
    const fn_getRandomMove = new RLFn("getRandomMove", getRandomMove, []);
    function toNextLevel(e) {
      return e.Progress.formulaBase + e.Progress.level * e.Progress.formulaFactor;
    }
    const fn_toNextLevel = new RLFn("toNextLevel", toNextLevel, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function giveXp(e, xp) {
      e.Fighter.xp += xp;
      if (e.IsPlayer) {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "You gain" },
            { type: "int", value: xp },
            { type: "str", value: "experience." }
          )
        );
        e.add(RedrawUI);
        if (e.Fighter.xp >= toNextLevel(e)) {
          log.add("You are ready to gain a level.");
          e.add(GainingLevel);
        }
      }
    }
    const fn_giveXp = new RLFn("giveXp", giveXp, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "xp", typeName: "int" }
    ]);
    function hurt(e, damage, attacker) {
      e.Fighter.hp -= damage;
      if (e.Fighter.hp < 1) {
        const colour = ((__match) => {
          if (__match.has(IsPlayer.typeName))
            return playerDied;
          else
            return enemyDied;
        })(e);
        if (e.IsPlayer) {
          log.add("You died! Press Escape to leave.", colour);
        } else {
          log.add(
            __lib.join(
              { type: "char", value: " " },
              { type: "str", value: e.Appearance.name },
              { type: "str", value: "is dead!" }
            ),
            colour
          );
        }
        const corpse = __lib.spawn(
          tmCorpse,
          mkPosition(e.Position.x, e.Position.y)
        );
        corpse.Appearance.name = __lib.join(
          { type: "char", value: " " },
          { type: "str", value: "corpse of" },
          { type: "str", value: e.Appearance.name }
        );
        if (attacker.Progress) {
          giveXp(attacker, e.Fighter.xp);
        }
        if (e.IsPlayer) {
          e.add(RedrawUI);
          e.remove("Actor");
          hostileAI.disable();
          __lib.pushKeyHandler(dead_onKey);
        } else {
          __lib.remove(e);
        }
      } else {
        if (e.IsPlayer) {
          e.add(RedrawUI);
        }
      }
    }
    const fn_hurt = new RLFn("hurt", hurt, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "damage", typeName: "int" },
      { type: "param", name: "attacker", typeName: "entity" }
    ]);
    function showHistoryView() {
      __lib.drawLog(
        log,
        { type: "int", value: 0 },
        { type: "int", value: 0 },
        { type: "int", value: gameWidth },
        { type: "int", value: gameHeight },
        { type: "int", value: historyOffset }
      );
    }
    const fn_showHistoryView = new RLFn("showHistoryView", showHistoryView, []);
    function getName(e) {
      if (e.Appearance) {
        return e.Appearance.name;
      }
      return "???";
    }
    const fn_getName = new RLFn("getName", getName, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function openInventory(e, v, callback, title) {
      if (!v.items.count) {
        log.add("You're not carrying anything.", impossible);
        return;
      }
      e.add(mkInventoryActionConfig(callback));
      __lib.pushKeyHandler(inventory_onKey);
      __lib.drawBag(
        v.items,
        { type: "str", value: title },
        fn_getName,
        { type: "str", value: "white" },
        { type: "str", value: "silver" },
        { type: "str", value: "grey" },
        { type: "str", value: "black" }
      );
    }
    const fn_openInventory = new RLFn("openInventory", openInventory, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "v", typeName: "Inventory" },
      { type: "param", name: "callback", typeName: "fn" },
      { type: "param", name: "title", typeName: "str" }
    ]);
    function tcUseItem(e, target) {
      const config = e.TargetingItemConfig;
      if (config) {
        e.remove(config);
        const item = config.item;
        if (item.Consumable.activate(e, item, target)) {
          if (e.Inventory) {
            e.Inventory.items.remove(config.key);
          }
          useTurn(e);
        }
      }
    }
    const fn_tcUseItem = new RLFn("tcUseItem", tcUseItem, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "target", typeName: "xy" }
    ]);
    function icUse(e, key, item) {
      if (!item.Consumable) {
        log.add("You cannot use that.", impossible);
        return;
      }
      if (item.Consumable.targeted) {
        log.add("Select a target.", needsTarget);
        e.add(mkTargetingItemConfig(key, item));
        startTargeting(e, tcUseItem, item.Consumable.radius);
        return;
      }
      if (item.Consumable.activate(e, item)) {
        if (e.Inventory) {
          e.Inventory.items.remove(key);
        }
        useTurn(e);
      }
    }
    const fn_icUse = new RLFn("icUse", icUse, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "key", typeName: "char" },
      { type: "param", name: "item", typeName: "entity" }
    ]);
    function icDrop(e, key, item) {
      if (e.Inventory && e.Position) {
        e.Inventory.items.remove(key);
        item.add(mkPosition(e.Position.x, e.Position.y));
        useTurn(e);
        if (item.Appearance) {
          log.add(
            __lib.join(
              { type: "char", value: " " },
              { type: "str", value: "You drop the" },
              { type: "str", value: item.Appearance.name }
            )
          );
        }
      }
    }
    const fn_icDrop = new RLFn("icDrop", icDrop, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "key", typeName: "char" },
      { type: "param", name: "item", typeName: "entity" }
    ]);
    function drawTilesAt(sx, sy, width, height) {
      for (let x = sx; x <= sx + width; x++) {
        for (let y = sy; y <= sy + height; y++) {
          drawTileAt(x, y);
        }
      }
    }
    const fn_drawTilesAt = new RLFn("drawTilesAt", drawTilesAt, [
      { type: "param", name: "sx", typeName: "int" },
      { type: "param", name: "sy", typeName: "int" },
      { type: "param", name: "width", typeName: "int" },
      { type: "param", name: "height", typeName: "int" }
    ]);
    function setTargetTo(x, y, radius) {
      const oldX = targetAt.x;
      const oldY = targetAt.y;
      targetAt = new RLXY(x, y);
      targetSize = radius;
      if (radius > 0) {
        const size = radius * 2 + 1;
        drawTilesAt(oldX - radius, oldY - radius, size, size);
        drawTilesAt(x - radius, y - radius, size, size);
      } else {
        drawTileAt(oldX, oldY);
        drawTileAt(x, y);
      }
      showNamesAt(x, y);
    }
    const fn_setTargetTo = new RLFn("setTargetTo", setTargetTo, [
      { type: "param", name: "x", typeName: "int" },
      { type: "param", name: "y", typeName: "int" },
      { type: "param", name: "radius", typeName: "int" }
    ]);
    function startTargeting(e, callback, radius) {
      e.add(mkTargetingActionConfig(callback, radius));
      if (e.Position) {
        setTargetTo(e.Position.x, e.Position.y, radius);
      }
      __lib.pushKeyHandler(targeting_onKey);
      __lib.pushMouseHandler(targeting_onMouse);
    }
    const fn_startTargeting = new RLFn("startTargeting", startTargeting, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "callback", typeName: "fn" },
      { type: "param", name: "radius", typeName: "int" }
    ]);
    function stopTargeting(e) {
      setTargetTo(-1, -1, 0);
      __lib.popKeyHandler();
      __lib.popMouseHandler();
      redrawEverything(e);
    }
    const fn_stopTargeting = new RLFn("stopTargeting", stopTargeting, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function useTurn(e) {
      e.Actor.energy -= 100;
      e.remove(MyTurn);
    }
    const fn_useTurn = new RLFn("useTurn", useTurn, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function drawTileAt(x, y) {
      const highlight = distance(targetAt, new RLXY(x, y)) <= targetSize;
      let ch = " ";
      let fg = "white";
      let bg = "black";
      let layer = 0 /* Nothing */;
      if (visible.at(x, y)) {
        for (const _entity of new RLQuery(RL.instance, [
          "Appearance",
          "Position"
        ]).get()) {
          const { Appearance: a, Position: p } = _entity;
          if (p.x == x && p.y == y && a.layer > layer) {
            ch = a.ch;
            fg = a.fg;
            bg = a.bg;
            layer = a.layer;
          }
        }
      }
      if (layer == 0 /* Nothing */ && explored.at(x, y)) {
        const t = map.at(x, y);
        if (t) {
          ch = t.ch;
          if (visible.at(x, y)) {
            fg = "silver";
          } else {
            fg = "#444";
          }
        }
      }
      if (highlight) {
        bg = "#808000";
      }
      __lib.draw(
        { type: "int", value: x },
        { type: "int", value: y },
        { type: "char", value: ch },
        { type: "str", value: fg },
        { type: "str", value: bg }
      );
    }
    const fn_drawTileAt = new RLFn("drawTileAt", drawTileAt, [
      { type: "param", name: "x", typeName: "int" },
      { type: "param", name: "y", typeName: "int" }
    ]);
    function drawEntity(e) {
      if (e.Position && e.Appearance && visible.at(e.Position.x, e.Position.y)) {
        __lib.draw(
          { type: "int", value: e.Position.x },
          { type: "int", value: e.Position.y },
          { type: "char", value: e.Appearance.ch },
          { type: "str", value: e.Appearance.fg },
          { type: "str", value: e.Appearance.bg }
        );
      }
    }
    const fn_drawEntity = new RLFn("drawEntity", drawEntity, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function drawBar(x, y, value, maxValue, maxWidth, emptyColour, filledColour) {
      const barWidth = __lib.floor({
        type: "int",
        value: __lib.clamp(
          { type: "int", value },
          { type: "int", value: 0 },
          { type: "int", value: maxValue }
        ) / maxValue * maxWidth
      });
      __lib.draw(
        { type: "int", value: x },
        { type: "int", value: y },
        {
          type: "str",
          value: __lib.repeat(
            { type: "char", value: " " },
            { type: "int", value: maxWidth }
          )
        },
        { type: "str", value: "white" },
        { type: "str", value: emptyColour }
      );
      if (barWidth > 0) {
        __lib.draw(
          { type: "int", value: x },
          { type: "int", value: y },
          {
            type: "str",
            value: __lib.repeat(
              { type: "char", value: " " },
              { type: "int", value: barWidth }
            )
          },
          { type: "str", value: "white" },
          { type: "str", value: filledColour }
        );
      }
    }
    const fn_drawBar = new RLFn("drawBar", drawBar, [
      { type: "param", name: "x", typeName: "int" },
      { type: "param", name: "y", typeName: "int" },
      { type: "param", name: "value", typeName: "int" },
      { type: "param", name: "maxValue", typeName: "int" },
      { type: "param", name: "maxWidth", typeName: "int" },
      { type: "param", name: "emptyColour", typeName: "str" },
      { type: "param", name: "filledColour", typeName: "str" }
    ]);
    function clearUI() {
      __lib.draw(
        { type: "int", value: hpX },
        { type: "int", value: hpY },
        {
          type: "str",
          value: __lib.repeat(
            { type: "char", value: " " },
            { type: "int", value: hpWidth }
          )
        },
        { type: "str", value: "white" },
        { type: "str", value: "black" }
      );
      __lib.draw(
        { type: "int", value: xpX },
        { type: "int", value: xpY },
        {
          type: "str",
          value: __lib.repeat(
            { type: "char", value: " " },
            { type: "int", value: xpWidth }
          )
        },
        { type: "str", value: "white" },
        { type: "str", value: "black" }
      );
    }
    const fn_clearUI = new RLFn("clearUI", clearUI, []);
    function randomRoom() {
      const w = __lib.randInt(
        { type: "int", value: 6 },
        { type: "int", value: 14 }
      );
      const h = __lib.randInt(
        { type: "int", value: 6 },
        { type: "int", value: 14 }
      );
      const x = __lib.randInt(
        { type: "int", value: 1 },
        { type: "int", value: mapWidth - w - 1 }
      );
      const y = __lib.randInt(
        { type: "int", value: 1 },
        { type: "int", value: mapHeight - h - 1 }
      );
      return new RLRect(x, y, w, h);
    }
    const fn_randomRoom = new RLFn("randomRoom", randomRoom, []);
    function randomCorridor(x1, y1, x2, y2) {
      let cx = x2;
      let cy = y1;
      if (__lib.randInt({ type: "int", value: 0 }, { type: "int", value: 1 })) {
        cx = x1;
        cy = y2;
      }
      map.line(x1, y1, cx, cy, Floor);
      map.line(cx, cy, x2, y2, Floor);
    }
    const fn_randomCorridor = new RLFn("randomCorridor", randomCorridor, [
      { type: "param", name: "x1", typeName: "int" },
      { type: "param", name: "y1", typeName: "int" },
      { type: "param", name: "x2", typeName: "int" },
      { type: "param", name: "y2", typeName: "int" }
    ]);
    function generateDungeon() {
      for (const e of new RLQuery(RL.instance, ["Position"]).get()) {
        if (!e.IsPlayer) {
          __lib.remove(e);
        }
      }
      map.clear();
      explored.clear();
      visible.clear();
      let prev;
      let room;
      const taken = new RLGrid(mapWidth, mapHeight, false);
      let start;
      let stairs;
      for (let r = 1; r <= 30; r++) {
        room = randomRoom();
        if (!map.findInRegion(room, Floor)) {
          map.rect(room.x + 1, room.y + 1, room.x2 - 1, room.y2 - 1, Floor);
          if (prev) {
            randomCorridor(prev.cx, prev.cy, room.cx, room.cy);
            addEnemies(room, taken);
            addItems(room, taken);
          } else {
            start = room.centre;
          }
          stairs = room.centre;
          prev = room;
        }
      }
      map.put(stairs.x, stairs.y, DownStairs);
      hostileAI.enable();
      return start;
    }
    const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, []);
    function addEnemies(r, taken) {
      for (let z = 1; z <= __lib.randInt(
        { type: "int", value: 0 },
        { type: "int", value: maxEnemiesPerRoom }
      ); z++) {
        const x = __lib.randInt(
          { type: "int", value: r.x + 1 },
          { type: "int", value: r.x2 - 1 }
        );
        const y = __lib.randInt(
          { type: "int", value: r.y + 1 },
          { type: "int", value: r.y2 - 1 }
        );
        if (!taken.at(x, y)) {
          taken.put(x, y, true);
          __lib.spawn(
            ((__match) => {
              if (__match <= 80)
                return tmOrc;
              else
                return tmTroll;
            })(
              __lib.randInt(
                { type: "int", value: 1 },
                { type: "int", value: 100 }
              )
            ),
            mkPosition(x, y)
          );
        }
      }
    }
    const fn_addEnemies = new RLFn("addEnemies", addEnemies, [
      { type: "param", name: "r", typeName: "rect" },
      { type: "param", name: "taken", typeName: "grid" }
    ]);
    function addItems(r, taken) {
      for (let z = 1; z <= __lib.randInt(
        { type: "int", value: 0 },
        { type: "int", value: maxItemsPerRoom }
      ); z++) {
        const x = __lib.randInt(
          { type: "int", value: r.x + 1 },
          { type: "int", value: r.x2 - 1 }
        );
        const y = __lib.randInt(
          { type: "int", value: r.y + 1 },
          { type: "int", value: r.y2 - 1 }
        );
        if (!taken.at(x, y)) {
          taken.put(x, y, true);
          __lib.spawn(
            ((__match) => {
              if (__match <= 70)
                return tmHealingPotion;
              else if (__match <= 80)
                return tmFireballScroll;
              else if (__match <= 90)
                return tmConfusionScroll;
              else
                return tmLightningScroll;
            })(
              __lib.randInt(
                { type: "int", value: 1 },
                { type: "int", value: 100 }
              )
            ),
            mkPosition(x, y)
          );
        }
      }
    }
    const fn_addItems = new RLFn("addItems", addItems, [
      { type: "param", name: "r", typeName: "rect" },
      { type: "param", name: "taken", typeName: "grid" }
    ]);
    function nextFloor(player) {
      player.Progress.floor += 1;
      const start = generateDungeon();
      player.Position.x = start.x;
      player.Position.y = start.y;
      player.add(RecalculateFOV);
      player.add(RedrawUI);
    }
    const fn_nextFloor = new RLFn("nextFloor", nextFloor, [
      { type: "param", name: "player", typeName: "entity" }
    ]);
    function newGame() {
      const player = __lib.spawn(tmPlayer);
      const start = generateDungeon();
      player.add(mkPosition(start.x, start.y));
      log.add("Welcome to the RLscript dungeon!", welcomeText);
      __lib.pushKeyHandler(main_onKey);
      __lib.pushMouseHandler(main_onMouse);
      nextTurn.enable();
    }
    const fn_newGame = new RLFn("newGame", newGame, []);
    function mainMenu() {
      for (const e of new RLQuery(RL.instance, []).get()) {
        __lib.remove(e);
      }
      log.clear();
      __lib.clearHandlers();
      __lib.pushKeyHandler(menu_onKey);
      nextTurn.disable();
      __lib.clear();
      clearUI();
      __lib.drawCentred(
        { type: "int", value: gameWidth / 2 },
        { type: "int", value: gameHeight / 2 - 4 },
        { type: "str", value: "An Improbable Roguelike" },
        { type: "str", value: menuTitle }
      );
      __lib.drawCentred(
        { type: "int", value: gameWidth / 2 },
        { type: "int", value: gameHeight - 2 },
        { type: "str", value: "by Lag.Com" },
        { type: "str", value: menuTitle }
      );
      __lib.drawCentred(
        { type: "int", value: gameWidth / 2 },
        { type: "int", value: gameHeight / 2 - 2 },
        { type: "str", value: "[N] Play a new game" },
        { type: "str", value: "white" }
      );
      if (__lib.canLoadGame()) {
        __lib.drawCentred(
          { type: "int", value: gameWidth / 2 },
          { type: "int", value: gameHeight / 2 - 1 },
          { type: "str", value: "[C] Continue last game" },
          { type: "str", value: "white" }
        );
      }
    }
    const fn_mainMenu = new RLFn("mainMenu", mainMenu, []);
    function main() {
      __lib.setSize(
        { type: "int", value: gameWidth },
        { type: "int", value: gameHeight }
      );
      mainMenu();
    }
    const fn_main = new RLFn("main", main, []);
    function code_main_onMouse(m) {
      showNamesAt(m.x, m.y);
    }
    const main_onMouse = new RLSystem("main_onMouse", code_main_onMouse, [
      { type: "param", name: "m", typeName: "MouseEvent" }
    ]);
    function code_main_onKey(e, k) {
      e.add(
        ((__match) => {
          if (__match === "up")
            return mkMoveAction(0, -1);
          else if (__match === "right")
            return mkMoveAction(1, 0);
          else if (__match === "down")
            return mkMoveAction(0, 1);
          else if (__match === "left")
            return mkMoveAction(-1, 0);
          else if (__match === "wait")
            return WaitAction;
          else if (__match === "history")
            return HistoryAction;
          else if (__match === "pickup")
            return PickupAction;
          else if (__match === "inventory")
            return InventoryAction;
          else if (__match === "drop")
            return DropAction;
          else if (__match === "look")
            return LookAction;
          else if (__match === "confirm")
            return TakeStairsAction;
          else if (__match === "character")
            return CharacterInfoAction;
          else if (__match === "quit")
            return QuitAction;
        })(getKey(k.key))
      );
    }
    const main_onKey = new RLSystem("main_onKey", code_main_onKey, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    function code_dead_onKey(e, k) {
      if (k.key == "Escape") {
        mainMenu();
      }
    }
    const dead_onKey = new RLSystem("dead_onKey", code_dead_onKey, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    function code_confusedAI(e, a, c) {
      if (c.duration <= 0) {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "The" },
            { type: "str", value: a.name },
            { type: "str", value: "is no longer confused." }
          )
        );
        e.remove(c);
        e.add(c.old);
        return;
      }
      c.duration -= 1;
      e.add(getRandomMove());
    }
    const confusedAI = new RLSystem("confusedAI", code_confusedAI, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "a", typeName: "Appearance" },
      { type: "param", name: "c", typeName: "ConfusedEnemy" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_hostileAI(e, p) {
      if (visible.at(p.x, p.y)) {
        for (const target of new RLQuery(RL.instance, [
          "Position",
          "IsPlayer"
        ]).get()) {
          const { Position: tp } = target;
          const dx = tp.x - p.x;
          const dy = tp.y - p.y;
          const distance2 = __lib.abs({ type: "int", value: dx }) + __lib.abs({ type: "int", value: dy });
          if (distance2 < 2) {
            e.add(mkMeleeAction(target));
            return;
          }
          const step = __lib.getNextMove(
            map,
            getBlockingMap(),
            new RLXY(p.x, p.y),
            new RLXY(tp.x, tp.y)
          );
          if (step) {
            e.add(mkMoveAction(step.x - p.x, step.y - p.y));
            return;
          }
        }
      }
      e.add(WaitAction);
    }
    const hostileAI = new RLSystem("hostileAI", code_hostileAI, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "constraint", typeName: "HostileEnemy" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doMove(e, p, m) {
      const x = p.x + m.x;
      const y = p.y + m.y;
      e.remove(m);
      const t = map.at(x, y);
      if (t && t.walkable) {
        const b = __lib.find(IsBlocker, mkPosition(x, y));
        if (b) {
          if (b.Fighter) {
            e.add(mkMeleeAction(b));
          } else {
            log.add("That way is blocked.", impossible);
          }
          return;
        }
        useTurn(e);
        e.add(mkOldPosition(p.x, p.y));
        p.x = x;
        p.y = y;
        if (e.IsPlayer) {
          e.add(RecalculateFOV);
        }
      } else {
        if (e.ConfusedEnemy) {
          if (visible.at(p.x, p.y)) {
            log.add(
              __lib.join(
                { type: "char", value: " " },
                { type: "str", value: getName(e) },
                { type: "str", value: "thumps into a wall." }
              )
            );
          }
          useTurn(e);
          return;
        }
        log.add("That way is blocked.", impossible);
      }
    }
    const doMove = new RLSystem("doMove", code_doMove, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "param", name: "m", typeName: "MoveAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doMelee(e, m, a, f) {
      const target = m.target;
      e.remove(m);
      useTurn(e);
      const attack = __lib.join(
        { type: "char", value: " " },
        { type: "str", value: a.name },
        { type: "str", value: "attacks" },
        { type: "str", value: target.Appearance.name }
      );
      const damage = f.power - target.Fighter.defence;
      const colour = ((__match) => {
        if (__match.has(IsPlayer.typeName))
          return playerAttack;
        else
          return enemyAttack;
      })(e);
      if (damage > 0) {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: attack },
            { type: "str", value: "for" },
            { type: "int", value: damage },
            { type: "str", value: "hit points" }
          ),
          colour
        );
        hurt(target, damage, e);
      } else {
        log.add(
          __lib.join(
            { type: "char", value: " " },
            { type: "str", value: attack },
            { type: "str", value: "but does no damage" }
          ),
          colour
        );
      }
    }
    const doMelee = new RLSystem("doMelee", code_doMelee, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "m", typeName: "MeleeAction" },
      { type: "param", name: "a", typeName: "Appearance" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doWait(e) {
      e.remove(WaitAction);
      useTurn(e);
    }
    const doWait = new RLSystem("doWait", code_doWait, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "WaitAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_history_onMouse(m) {
    }
    const history_onMouse = new RLSystem(
      "history_onMouse",
      code_history_onMouse,
      [{ type: "param", name: "m", typeName: "MouseEvent" }]
    );
    function code_history_onKey(e, k) {
      if (k.key == "KeyV") {
        return;
      }
      const change = ((__match) => {
        if (__match === "up")
          return -1;
        else if (__match === "down")
          return 1;
        else if (__match === "PageUp")
          return -10;
        else if (__match === "PageDown")
          return 10;
        else if (__match === "Home")
          return -historyOffset - 1;
        else if (__match === "End")
          return log.length - historyOffset;
        else
          return 0;
      })(getKey(k.key));
      if (!change) {
        redrawEverything(e);
        __lib.popKeyHandler();
        __lib.popMouseHandler();
        return;
      }
      historyOffset = __lib.clamp(
        { type: "int", value: historyOffset + change },
        { type: "int", value: 0 },
        { type: "int", value: log.length - 1 }
      );
      showHistoryView();
    }
    const history_onKey = new RLSystem("history_onKey", code_history_onKey, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    function code_doHistory(e) {
      e.remove(HistoryAction);
      __lib.pushKeyHandler(history_onKey);
      __lib.pushMouseHandler(history_onMouse);
      historyOffset = 0;
      __lib.clear();
      clearUI();
      showHistoryView();
    }
    const doHistory = new RLSystem("doHistory", code_doHistory, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "HistoryAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doPickup(e, p, v) {
      e.remove(PickupAction);
      let matches = 0;
      let got = 0;
      let failed = false;
      for (const item of new RLQuery(RL.instance, [
        "Appearance",
        "Position",
        "Item"
      ]).get()) {
        const { Appearance: ia, Position: ip } = item;
        if (ip.x == p.x && ip.y == p.y) {
          matches += 1;
          const key = v.items.add(item);
          if (key) {
            got += 1;
            log.add(
              __lib.join(
                { type: "str", value: "" },
                { type: "str", value: "You got (" },
                { type: "char", value: key },
                { type: "str", value: ") " },
                { type: "str", value: ia.name }
              )
            );
            item.remove(ip);
          } else {
            failed = true;
          }
        }
      }
      if (got) {
        useTurn(e);
      }
      if (failed) {
        log.add("Can't carry any more.", impossible);
      } else {
        if (!matches) {
          log.add("Nothing here.", impossible);
        }
      }
    }
    const doPickup = new RLSystem("doPickup", code_doPickup, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "param", name: "v", typeName: "Inventory" },
      { type: "constraint", typeName: "PickupAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doInventory(e, v) {
      e.remove(InventoryAction);
      openInventory(e, v, icUse, "Use what?");
    }
    const doInventory = new RLSystem("doInventory", code_doInventory, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "v", typeName: "Inventory" },
      { type: "constraint", typeName: "InventoryAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doDrop(e, v) {
      e.remove(DropAction);
      openInventory(e, v, icDrop, "Drop what?");
    }
    const doDrop = new RLSystem("doDrop", code_doDrop, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "v", typeName: "Inventory" },
      { type: "constraint", typeName: "DropAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_inventory_onKey(e, v, config, k) {
      let closing = false;
      let firing = false;
      if (k.key == "Escape") {
        closing = true;
      }
      if (v.items.has(k.char)) {
        firing = true;
        closing = true;
      }
      if (closing) {
        e.remove(config);
        __lib.popKeyHandler();
        redrawEverything(e);
      }
      if (firing) {
        config.callback(e, k.char, v.items.get(k.char));
      }
    }
    const inventory_onKey = new RLSystem(
      "inventory_onKey",
      code_inventory_onKey,
      [
        { type: "param", name: "e", typeName: "entity" },
        { type: "param", name: "v", typeName: "Inventory" },
        { type: "param", name: "config", typeName: "InventoryActionConfig" },
        { type: "param", name: "k", typeName: "KeyEvent" }
      ]
    );
    function code_targeting_onKey(e, config, k) {
      let mul = 1;
      const key = getKey(k.key);
      const move = ((__match) => {
        if (__match === "up")
          return new RLXY(0, -1);
        else if (__match === "right")
          return new RLXY(1, 0);
        else if (__match === "down")
          return new RLXY(0, 1);
        else if (__match === "left")
          return new RLXY(-1, 0);
      })(key);
      if (move) {
        if (k.shift) {
          mul *= 5;
        }
        if (k.ctrl) {
          mul *= 10;
        }
        if (k.alt) {
          mul *= 20;
        }
        const x = targetAt.x + move.x * mul;
        const y = targetAt.y + move.y * mul;
        setTargetTo(
          __lib.clamp(
            { type: "int", value: x },
            { type: "int", value: 0 },
            { type: "int", value: mapWidth - 1 }
          ),
          __lib.clamp(
            { type: "int", value: y },
            { type: "int", value: 0 },
            { type: "int", value: mapHeight - 1 }
          ),
          config.radius
        );
        return;
      }
      if (key == "confirm") {
        config.callback(e, targetAt);
        stopTargeting(e);
      }
      if (key == "quit") {
        stopTargeting(e);
      }
    }
    const targeting_onKey = new RLSystem(
      "targeting_onKey",
      code_targeting_onKey,
      [
        { type: "param", name: "e", typeName: "entity" },
        { type: "param", name: "config", typeName: "TargetingActionConfig" },
        { type: "param", name: "k", typeName: "KeyEvent" }
      ]
    );
    function code_targeting_onMouse(e, config, m) {
      setTargetTo(m.x, m.y, config.radius);
      if (m.button == 1) {
        config.callback(e, targetAt);
        stopTargeting(e);
      }
    }
    const targeting_onMouse = new RLSystem(
      "targeting_onMouse",
      code_targeting_onMouse,
      [
        { type: "param", name: "e", typeName: "entity" },
        { type: "param", name: "config", typeName: "TargetingActionConfig" },
        { type: "param", name: "m", typeName: "MouseEvent" }
      ]
    );
    function code_doLook(e) {
      e.remove(LookAction);
      startTargeting(e, stopTargeting, 0);
    }
    const doLook = new RLSystem("doLook", code_doLook, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "LookAction" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doQuit(e) {
      e.remove(QuitAction);
      redrawEverything(e);
      __lib.saveGame();
      mainMenu();
    }
    const doQuit = new RLSystem("doQuit", code_doQuit, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "QuitAction" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_doStairs(e, p) {
      e.remove(TakeStairsAction);
      const t = map.at(p.x, p.y);
      if (t.ch == ">") {
        log.add("You descend the staircase.", descended);
        nextFloor(e);
      } else {
        log.add("There are no stairs here.", impossible);
      }
    }
    const doStairs = new RLSystem("doStairs", code_doStairs, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "constraint", typeName: "TakeStairsAction" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "constraint", typeName: "MyTurn" }
    ]);
    function code_info_onMouse(m) {
    }
    const info_onMouse = new RLSystem("info_onMouse", code_info_onMouse, [
      { type: "param", name: "m", typeName: "MouseEvent" }
    ]);
    function code_info_onKey(e, f, pr, k) {
      if (((__match) => {
        if (__match === "confirm")
          return true;
        else if (__match === "quit")
          return true;
      })(getKey(k.key))) {
        __lib.popKeyHandler();
        __lib.popMouseHandler();
        redrawEverything(e);
      }
    }
    const info_onKey = new RLSystem("info_onKey", code_info_onKey, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "param", name: "pr", typeName: "Progress" },
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    function code_doCharacterScreen(e, p, f, pr) {
      e.remove(CharacterInfoAction);
      let x = 0;
      if (p.x <= gameWidth / 2) {
        x = 40;
      }
      __lib.clearRect(
        { type: "int", value: x },
        { type: "int", value: 5 },
        { type: "int", value: 30 },
        { type: "int", value: 10 },
        { type: "str", value: "white" },
        { type: "str", value: "black" }
      );
      __lib.drawBox(
        { type: "int", value: x },
        { type: "int", value: 5 },
        { type: "int", value: 30 },
        { type: "int", value: 10 }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 7 },
        {
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "Level:" },
            { type: "int", value: pr.level }
          )
        }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 8 },
        {
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "XP:" },
            { type: "int", value: f.xp }
          )
        }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 9 },
        {
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "...next level:" },
            { type: "int", value: toNextLevel(e) }
          )
        }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 11 },
        {
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "Power:" },
            { type: "int", value: f.power }
          )
        }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 12 },
        {
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "Defence:" },
            { type: "int", value: f.defence }
          )
        }
      );
      __lib.pushKeyHandler(info_onKey);
      __lib.pushMouseHandler(info_onMouse);
    }
    const doCharacterScreen = new RLSystem(
      "doCharacterScreen",
      code_doCharacterScreen,
      [
        { type: "param", name: "e", typeName: "entity" },
        { type: "param", name: "p", typeName: "Position" },
        { type: "param", name: "f", typeName: "Fighter" },
        { type: "param", name: "pr", typeName: "Progress" },
        { type: "constraint", typeName: "CharacterInfoAction" },
        { type: "constraint", typeName: "MyTurn" }
      ]
    );
    function code_fov(e, p) {
      __lib.getFOV(
        map,
        { type: "int", value: p.x },
        { type: "int", value: p.y },
        { type: "int", value: 5 },
        visible,
        explored
      );
      e.remove(RecalculateFOV);
      for (let x = 0; x <= mapWidth - 1; x++) {
        for (let y = 0; y <= mapHeight - 1; y++) {
          drawTileAt(x, y);
        }
      }
    }
    const fov = new RLSystem("fov", code_fov, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "constraint", typeName: "RecalculateFOV" }
    ]);
    function code_drawUnderTile(e, o) {
      drawTileAt(o.x, o.y);
      e.remove(o);
      e.add(RedrawMe);
    }
    const drawUnderTile = new RLSystem("drawUnderTile", code_drawUnderTile, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "o", typeName: "OldPosition" }
    ]);
    function code_RedrawMeEntity(e, p) {
      drawTileAt(p.x, p.y);
      e.remove(RedrawMe);
    }
    const RedrawMeEntity = new RLSystem("RedrawMeEntity", code_RedrawMeEntity, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "constraint", typeName: "RedrawMe" }
    ]);
    function code_drawUI(e, f, pr) {
      e.remove(RedrawUI);
      drawBar(hpX, hpY, f.hp, f.maxHp, hpWidth, "#401010", "#006000");
      __lib.draw(
        { type: "int", value: hpX + 1 },
        { type: "int", value: hpY },
        {
          type: "str",
          value: __lib.join(
            { type: "str", value: "" },
            { type: "str", value: "HP: " },
            { type: "int", value: f.hp },
            { type: "str", value: "/" },
            { type: "int", value: f.maxHp }
          )
        }
      );
      const tnl = toNextLevel(e);
      drawBar(xpX, xpY, f.xp, tnl, xpWidth, "#600060", "#A000A0");
      __lib.draw(
        { type: "int", value: xpX + 1 },
        { type: "int", value: xpY },
        {
          type: "str",
          value: __lib.join(
            { type: "str", value: "" },
            { type: "str", value: "XP: " },
            { type: "int", value: f.xp },
            { type: "str", value: "/" },
            { type: "int", value: tnl }
          )
        }
      );
      __lib.draw(
        { type: "int", value: floorX },
        { type: "int", value: floorY },
        {
          type: "str",
          value: __lib.join(
            { type: "char", value: " " },
            { type: "str", value: "Floor:" },
            { type: "int", value: pr.floor }
          )
        }
      );
    }
    const drawUI = new RLSystem("drawUI", code_drawUI, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "param", name: "pr", typeName: "Progress" },
      { type: "constraint", typeName: "RedrawUI" }
    ]);
    function code_nextTurn() {
      let highest = -99999;
      for (const _entity of new RLQuery(RL.instance, ["Actor"]).get()) {
        const { Actor: ac } = _entity;
        if (ac.energy > highest) {
          highest = ac.energy;
        }
      }
      if (highest >= 100) {
        return false;
      }
      const elapse = 100 - highest;
      for (const e of new RLQuery(RL.instance, ["Actor"]).get()) {
        const { Actor: ac } = e;
        ac.energy += elapse;
        if (ac.energy >= 100) {
          e.add(MyTurn);
        }
      }
    }
    const nextTurn = new RLSystem("nextTurn", code_nextTurn, []);
    function code_level_onMouse(m) {
    }
    const level_onMouse = new RLSystem("level_onMouse", code_level_onMouse, [
      { type: "param", name: "m", typeName: "MouseEvent" }
    ]);
    function code_level_onKey(e, f, pr, k) {
      let done = false;
      if (k.key == "KeyC") {
        done = true;
        f.hp += 20;
        f.maxHp += 20;
        log.add("Your health improves.");
      }
      if (k.key == "KeyS") {
        done = true;
        f.power += 1;
        log.add("You feel stronger.");
      }
      if (k.key == "KeyA") {
        done = true;
        f.defence += 1;
        log.add("Your feel swifter.");
      }
      if (done) {
        f.xp -= toNextLevel(e);
        pr.level += 1;
        __lib.popKeyHandler();
        __lib.popMouseHandler();
        redrawEverything(e);
      }
    }
    const level_onKey = new RLSystem("level_onKey", code_level_onKey, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "param", name: "pr", typeName: "Progress" },
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    function code_gainLevel(e, p, f) {
      e.remove(GainingLevel);
      e.remove(RecalculateFOV);
      let x = 0;
      if (p.x <= gameWidth / 2) {
        x = 40;
      }
      __lib.clearRect(
        { type: "int", value: x },
        { type: "int", value: 5 },
        { type: "int", value: 40 },
        { type: "int", value: 10 },
        { type: "str", value: "white" },
        { type: "str", value: "black" }
      );
      __lib.drawBox(
        { type: "int", value: x },
        { type: "int", value: 5 },
        { type: "int", value: 40 },
        { type: "int", value: 10 }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 7 },
        { type: "str", value: "You gain a level." },
        { type: "str", value: "yellow" }
      );
      __lib.draw(
        { type: "int", value: x + 2 },
        { type: "int", value: 9 },
        { type: "str", value: "Choose your boon:" }
      );
      __lib.draw(
        { type: "int", value: x + 4 },
        { type: "int", value: 10 },
        {
          type: "str",
          value: __lib.join(
            { type: "str", value: "" },
            { type: "str", value: "C)onstitution (+20 hp, was " },
            { type: "int", value: f.maxHp },
            { type: "char", value: ")" }
          )
        }
      );
      __lib.draw(
        { type: "int", value: x + 4 },
        { type: "int", value: 11 },
        {
          type: "str",
          value: __lib.join(
            { type: "str", value: "" },
            { type: "str", value: "S)trength (+1 power, was " },
            { type: "int", value: f.power },
            { type: "char", value: ")" }
          )
        }
      );
      __lib.draw(
        { type: "int", value: x + 4 },
        { type: "int", value: 12 },
        {
          type: "str",
          value: __lib.join(
            { type: "str", value: "" },
            { type: "str", value: "A)gility (+1 defence, was " },
            { type: "int", value: f.defence },
            { type: "char", value: ")" }
          )
        }
      );
      __lib.pushKeyHandler(level_onKey);
      __lib.pushMouseHandler(level_onMouse);
    }
    const gainLevel = new RLSystem("gainLevel", code_gainLevel, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "p", typeName: "Position" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "constraint", typeName: "GainingLevel" }
    ]);
    function code_showLog() {
      if (log.dirty) {
        __lib.drawLog(
          log,
          { type: "int", value: logX },
          { type: "int", value: logY },
          { type: "int", value: gameWidth - logX },
          { type: "int", value: gameHeight - logY }
        );
      } else {
        return false;
      }
    }
    const showLog = new RLSystem("showLog", code_showLog, []);
    function code_menu_onKey(k) {
      if (k.key == "KeyN") {
        newGame();
        return;
      }
      if (k.key == "KeyC") {
        if (__lib.canLoadGame()) {
          __lib.clear();
          __lib.loadGame();
        }
      }
    }
    const menu_onKey = new RLSystem("menu_onKey", code_menu_onKey, [
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    return /* @__PURE__ */ new Map([
      ["distance", fn_distance],
      ["healingItem", fn_healingItem],
      ["zapItem", fn_zapItem],
      ["confuseItem", fn_confuseItem],
      ["fireballItem", fn_fireballItem],
      ["redrawEverything", fn_redrawEverything],
      ["getKey", fn_getKey],
      ["getNamesAtLocation", fn_getNamesAtLocation],
      ["showNamesAt", fn_showNamesAt],
      ["getBlockingMap", fn_getBlockingMap],
      ["getRandomMove", fn_getRandomMove],
      ["toNextLevel", fn_toNextLevel],
      ["giveXp", fn_giveXp],
      ["hurt", fn_hurt],
      ["showHistoryView", fn_showHistoryView],
      ["getName", fn_getName],
      ["openInventory", fn_openInventory],
      ["tcUseItem", fn_tcUseItem],
      ["icUse", fn_icUse],
      ["icDrop", fn_icDrop],
      ["drawTilesAt", fn_drawTilesAt],
      ["setTargetTo", fn_setTargetTo],
      ["startTargeting", fn_startTargeting],
      ["stopTargeting", fn_stopTargeting],
      ["useTurn", fn_useTurn],
      ["drawTileAt", fn_drawTileAt],
      ["drawEntity", fn_drawEntity],
      ["drawBar", fn_drawBar],
      ["clearUI", fn_clearUI],
      ["randomRoom", fn_randomRoom],
      ["randomCorridor", fn_randomCorridor],
      ["generateDungeon", fn_generateDungeon],
      ["addEnemies", fn_addEnemies],
      ["addItems", fn_addItems],
      ["nextFloor", fn_nextFloor],
      ["newGame", fn_newGame],
      ["mainMenu", fn_mainMenu],
      ["main", fn_main],
      ["main_onMouse", main_onMouse],
      ["main_onKey", main_onKey],
      ["dead_onKey", dead_onKey],
      ["confusedAI", confusedAI],
      ["hostileAI", hostileAI],
      ["doMove", doMove],
      ["doMelee", doMelee],
      ["doWait", doWait],
      ["history_onMouse", history_onMouse],
      ["history_onKey", history_onKey],
      ["doHistory", doHistory],
      ["doPickup", doPickup],
      ["doInventory", doInventory],
      ["doDrop", doDrop],
      ["inventory_onKey", inventory_onKey],
      ["targeting_onKey", targeting_onKey],
      ["targeting_onMouse", targeting_onMouse],
      ["doLook", doLook],
      ["doQuit", doQuit],
      ["doStairs", doStairs],
      ["info_onMouse", info_onMouse],
      ["info_onKey", info_onKey],
      ["doCharacterScreen", doCharacterScreen],
      ["fov", fov],
      ["drawUnderTile", drawUnderTile],
      ["RedrawMeEntity", RedrawMeEntity],
      ["drawUI", drawUI],
      ["nextTurn", nextTurn],
      ["level_onMouse", level_onMouse],
      ["level_onKey", level_onKey],
      ["gainLevel", gainLevel],
      ["showLog", showLog],
      ["menu_onKey", menu_onKey],
      ["IsBlocker", IsBlocker],
      ["IsPlayer", IsPlayer],
      ["RecalculateFOV", RecalculateFOV],
      ["RedrawMe", RedrawMe],
      ["RedrawUI", RedrawUI],
      ["MyTurn", MyTurn],
      ["HostileEnemy", HostileEnemy],
      ["WaitAction", WaitAction],
      ["HistoryAction", HistoryAction],
      ["Item", Item],
      ["PickupAction", PickupAction],
      ["InventoryAction", InventoryAction],
      ["DropAction", DropAction],
      ["LookAction", LookAction],
      ["QuitAction", QuitAction],
      ["TakeStairsAction", TakeStairsAction],
      ["GainingLevel", GainingLevel],
      ["CharacterInfoAction", CharacterInfoAction],
      ["Player", tmPlayer],
      ["Enemy", tmEnemy],
      ["Orc", tmOrc],
      ["Troll", tmTroll],
      ["Corpse", tmCorpse],
      ["HealingPotion", tmHealingPotion],
      ["LightningScroll", tmLightningScroll],
      ["ConfusionScroll", tmConfusionScroll],
      ["FireballScroll", tmFireballScroll]
    ]);
  }

  // src/RecursiveShadowCasting.ts
  var OctantTransform = class {
    constructor(xx, xy, yx, yy) {
      this.xx = xx;
      this.xy = xy;
      this.yx = yx;
      this.yy = yy;
    }
  };
  var transforms = [
    new OctantTransform(1, 0, 0, 1),
    new OctantTransform(0, 1, 1, 0),
    new OctantTransform(0, -1, 1, 0),
    new OctantTransform(-1, 0, 0, 1),
    new OctantTransform(-1, 0, 0, -1),
    new OctantTransform(0, -1, -1, 0),
    new OctantTransform(0, 1, -1, 0),
    new OctantTransform(1, 0, 0, -1)
  ];
  var ShadowCastingGrid = class {
    constructor(width, height, isOpaque) {
      this.width = width;
      this.height = height;
      this.isOpaque = isOpaque;
      this.values = /* @__PURE__ */ new Map();
    }
    light(x, y, value) {
      this.values.set({ x, y }, value);
    }
  };
  function ComputeVisibility(grid, gridPosn, viewRadius) {
    grid.light(gridPosn.x, gridPosn.y, 0);
    for (const tf of transforms)
      CastLight(grid, gridPosn, viewRadius, 1, 1, 0, tf);
  }
  function CastLight(grid, gridPosn, viewRadius, startColumn, leftViewSlope, rightViewSlope, txfrm) {
    const viewRadiusSq = viewRadius * viewRadius;
    const viewCeiling = Math.ceil(viewRadius);
    let prevWasBlocked = false;
    let savedRightSlope = -1;
    const xDim = grid.width;
    const yDim = grid.height;
    for (let currentCol = startColumn; currentCol <= viewCeiling; currentCol++) {
      const xc = currentCol;
      for (let yc = currentCol; yc >= 0; yc--) {
        const gridX = gridPosn.x + xc * txfrm.xx + yc * txfrm.xy;
        const gridY = gridPosn.y + xc * txfrm.yx + yc * txfrm.yy;
        if (gridX < 0 || gridX >= xDim || gridY < 0 || gridY >= yDim) {
          continue;
        }
        const leftBlockSlope = (yc + 0.5) / (xc - 0.5);
        const rightBlockSlope = (yc - 0.5) / (xc + 0.5);
        if (rightBlockSlope > leftViewSlope) {
          continue;
        } else if (leftBlockSlope < rightViewSlope) {
          break;
        }
        const distanceSquared = xc * xc + yc * yc;
        if (distanceSquared <= viewRadiusSq) {
          grid.light(gridX, gridY, distanceSquared);
        }
        const curBlocked = grid.isOpaque(gridX, gridY);
        if (prevWasBlocked) {
          if (curBlocked) {
            savedRightSlope = rightBlockSlope;
          } else {
            prevWasBlocked = false;
            leftViewSlope = savedRightSlope;
          }
        } else {
          if (curBlocked) {
            if (leftBlockSlope <= leftViewSlope) {
              CastLight(
                grid,
                gridPosn,
                viewRadius,
                currentCol + 1,
                leftViewSlope,
                leftBlockSlope,
                txfrm
              );
            }
            prevWasBlocked = true;
            savedRightSlope = rightBlockSlope;
          }
        }
      }
      if (prevWasBlocked) {
        break;
      }
    }
  }

  // node_modules/nanoid/index.browser.js
  var nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte > 62) {
      id += "-";
    } else {
      id += "_";
    }
    return id;
  }, "");

  // src/RLEntity.ts
  var _RLEntity = class {
    constructor() {
      this.type = "entity";
      this.id = nanoid();
      this.components = /* @__PURE__ */ new Set();
      this.templates = /* @__PURE__ */ new Set();
      this.IsBlocker = false;
      this.IsPlayer = false;
      this.RecalculateFOV = false;
      this.RedrawMe = false;
      this.RedrawUI = false;
      this.MyTurn = false;
      this.HostileEnemy = false;
      this.WaitAction = false;
      this.HistoryAction = false;
      this.Item = false;
      this.PickupAction = false;
      this.InventoryAction = false;
      this.DropAction = false;
      this.LookAction = false;
      this.QuitAction = false;
      this.TakeStairsAction = false;
      this.GainingLevel = false;
      this.CharacterInfoAction = false;
    }
    toString() {
      return `#${this.id} (${Array.from(this.templates.values()).join(" ")})`;
    }
    get [Symbol.toStringTag]() {
      return `Entity#${this.toString()}`;
    }
    has(name) {
      return this.components.has(name);
    }
    add(thing) {
      if (!thing)
        return;
      if (thing.type === "template") {
        this.templates.add(thing.name);
        for (const part of thing.get())
          this.add(part);
        return;
      }
      if (thing.type === "component") {
        this[thing.typeName] = thing;
      } else
        this[thing.typeName] = true;
      this.components.add(thing.typeName);
    }
    remove(thing) {
      if (!thing)
        return;
      if (thing.type === "component")
        delete this[thing.typeName];
      else
        this[thing.typeName] = false;
      this.components.delete(thing.typeName);
    }
    get(name) {
      if (this.components.has(name))
        return this[name];
      throw new Error(`Tried to access empty entity.${name}`);
    }
    serialize() {
      const keys = Object.keys(this).filter(
        (k) => Object.prototype.hasOwnProperty.call(this, k) && k !== "type"
      );
      const data = Object.fromEntries(keys.map((k) => [k, this[k]]));
      return Serializer.instance.serialize("n:object", data)[1];
    }
    static deserialize(data) {
      const e = new _RLEntity();
      for (const key in data) {
        const value = data[key];
        e[key] = Serializer.instance.deserialize(value);
      }
      return e;
    }
  };
  var RLEntity = _RLEntity;
  RLEntity.type = "entity";
  Serializer.instance.add(
    "entity",
    (e) => e.serialize(),
    (data) => RLEntity.deserialize(data)
  );
  Serializer.instance.alias("component", "n:object");

  // src/lib.ts
  function setSize({ value: width }, { value: height }) {
    Game.instance.width = width;
    Game.instance.height = height;
  }
  function spawn(...args) {
    const e = new RLEntity();
    for (const a of args)
      e.add(a);
    Game.instance.rl.entities.set(e.id, e);
    return e;
  }
  function pushKeyHandler(handler) {
    Game.instance.rl.keyHandlers.push(handler);
  }
  function getColour(s) {
    return s ? new TinyColor(s.value).toNumber() << 8 : void 0;
  }
  function drawable(fn) {
    if (Game.instance.terminal)
      fn(Game.instance.terminal);
    else
      Game.instance.afterInit.push(fn);
  }
  function draw({ value: x }, { value: y }, display, fg, bg) {
    drawable((term) => {
      const f = getColour(fg);
      const b = getColour(bg);
      if (display.type === "char")
        term.drawChar(x, y, display.value, f, b);
      else
        term.drawString(x, y, display.value, f, b);
    });
  }
  function drawCentred({ value: x }, y, display, fg, bg) {
    const offset = Math.floor(display.value.length / 2);
    draw({ type: "int", value: x - offset }, y, display, fg, bg);
  }
  function drawGrid(g) {
    drawable(() => {
      for (let y = 0; y < g.height; y++) {
        for (let x = 0; x < g.width; x++) {
          const t = g.at(x, y);
          if (t)
            draw(
              { type: "int", value: x },
              { type: "int", value: y },
              { type: "char", value: t.ch },
              { type: "str", value: "silver" }
            );
        }
      }
    });
  }
  function randInt({ value: min }, { value: max }) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
  function getFOV(tiles, { value: x }, { value: y }, { value: radius }, visible, explored) {
    visible.fill(visible.empty);
    const grid = new ShadowCastingGrid(
      tiles.width,
      tiles.height,
      (x2, y2) => {
        var _a;
        return !((_a = tiles.at(x2, y2)) == null ? void 0 : _a.transparent);
      }
    );
    ComputeVisibility(grid, { x, y }, radius);
    for (const pos of grid.values.keys()) {
      visible.put(pos.x, pos.y, true);
      explored.put(pos.x, pos.y, true);
    }
  }
  function add(...args) {
    for (const a of args) {
      for (const e of RL.instance.entities.values())
        e.add(a);
    }
  }
  function find(...args) {
    for (const e of RL.instance.entities.values()) {
      let success = true;
      for (const a of args) {
        if (typeof a === "string") {
          if (!e.has(a)) {
            success = false;
            break;
          }
          continue;
        }
        if (!e.has(a.typeName)) {
          success = false;
          break;
        }
        if (a.type === "component") {
          const check = e.get(a.typeName);
          for (const [key, val] of Object.entries(a)) {
            if (val !== check[key]) {
              success = false;
              break;
            }
          }
        }
      }
      if (success)
        return e;
    }
  }
  function abs(n) {
    return Math.abs(n.value);
  }
  var offsets = [
    new RLXY(1, 0),
    new RLXY(0, 1),
    new RLXY(-1, 0),
    new RLXY(0, -1)
  ];
  function getNextMove(map, blockedMap, src, dst) {
    const cost = new RLGrid(map.width, map.height, Infinity);
    const from = new RLGrid(map.width, map.height, void 0);
    cost.put(src.x, src.y, 0);
    const queue = [src];
    let best = Infinity;
    while (queue.length) {
      const centre = queue.shift();
      const newCost = cost.at(centre.x, centre.y) + 1;
      if (best < newCost)
        continue;
      for (const o of offsets) {
        const pos = centre.plus(o);
        if (pos.equals(dst)) {
          best = newCost;
          cost.put(pos.x, pos.y, newCost);
          from.put(pos.x, pos.y, centre);
          break;
        }
        const tile = map.at(pos.x, pos.y);
        const canWalk = tile == null ? void 0 : tile.walkable;
        const blocked = blockedMap.at(pos.x, pos.y);
        const oldCost = cost.at(pos.x, pos.y);
        if (canWalk && !blocked && oldCost > newCost) {
          cost.put(pos.x, pos.y, newCost);
          from.put(pos.x, pos.y, centre);
          queue.push(pos);
        }
      }
    }
    if (cost.at(dst.x, dst.y) === Infinity)
      return;
    const path = [];
    let at = dst;
    while (!at.equals(src)) {
      path.unshift(at);
      const next = from.at(at.x, at.y);
      if (!next)
        break;
      at = next;
    }
    return path[0];
  }
  function join({ value: glue }, ...parts) {
    return parts.map((p) => {
      switch (p.type) {
        case "char":
        case "str":
          return p.value;
        case "int":
          return p.value.toString();
      }
    }).join(glue);
  }
  function debug(...args) {
    console.log(
      ...args.map((arg) => {
        if (arg.type === "char" || arg.type === "float" || arg.type === "int" || arg.type === "str")
          return arg.value;
        return arg;
      })
    );
  }
  function remove(e) {
    RL.instance.entities.delete(e.id);
  }
  function floor({ value }) {
    return Math.floor(value);
  }
  function repeat({ value: ch }, { value: count }) {
    let s = "";
    for (let i = 0; i < count; i++)
      s += ch;
    return s;
  }
  function drawLog(log, { value: x }, { value: y }, { value: width }, { value: height }, offset) {
    drawable(
      (term) => log.render(term, x, y, width, height, offset ? offset.value : 0)
    );
  }
  function pushMouseHandler(handler) {
    Game.instance.rl.mouseHandlers.push(handler);
  }
  function popKeyHandler() {
    Game.instance.rl.keyHandlers.pop();
  }
  function popMouseHandler() {
    Game.instance.rl.mouseHandlers.pop();
  }
  function clamp({ value }, { value: min }, { value: max }) {
    return value < min ? min : value > max ? max : value;
  }
  function clear() {
    var _a;
    (_a = Game.instance.terminal) == null ? void 0 : _a.clear();
  }
  function drawBox({ value: x }, { value: y }, { value: width }, { value: height }, fg, bg) {
    drawable(
      (term) => term.drawSingleBox(x, y, width, height, getColour(fg), getColour(bg))
    );
  }
  function clearRect({ value: x }, { value: y }, { value: width }, { value: height }, fg, bg) {
    drawable(
      (term) => term.fillRect(x, y, width, height, " ", getColour(fg), getColour(bg))
    );
  }
  function drawBag(bag, { value: title }, getName, titleColour, itemColour, borderColour, bgColour) {
    const items = Array.from(bag.items.entries()).map(
      ([key, e]) => `(${key}) ${getName.apply([{ type: "positional", value: e }])}`
    ).sort();
    const width = Math.max(title.length, ...items.map((n) => n.length)) + 4;
    const height = items.length + 4;
    const x = Math.floor((Game.instance.width - width) / 2);
    const y = Math.floor((Game.instance.height - height) / 2);
    const tc = getColour(titleColour);
    const ic = getColour(itemColour);
    const bc = getColour(borderColour);
    const bg = getColour(bgColour);
    const term = Game.instance.terminal;
    term.fillRect(x, y, width, height, " ", ic, bg);
    term.drawSingleBox(x, y, width, height, bc);
    term.drawString(x + 2, y + 1, title, tc);
    for (let i = 0; i < items.length; i++)
      term.drawString(x + 2, y + i + 3, items[i], ic);
  }
  function sqrt({ value }) {
    return Math.sqrt(value);
  }
  function clearHandlers() {
    RL.instance.keyHandlers.clear();
    RL.instance.mouseHandlers.clear();
  }
  var saveId = "rlscript-jsdriver.save";
  var persistent = /* @__PURE__ */ new Map();
  Serializer.instance.add(
    "n:function",
    (fn) => fn.name,
    (data) => {
      const obj = RL.instance.env.get(data);
      if (!obj)
        throw new Error(`${data} does not exist`);
      if (obj.type !== "fn")
        throw new Error(`${data} is type ${obj.type}, expected fn`);
      return obj.code;
    }
  );
  function saveObj(name, obj) {
    return [name, Serializer.instance.serialize(obj.type, obj)];
  }
  function saveGame() {
    const rl = RL.instance;
    const save = {
      e: Array.from(rl.entities.values()).map((e) => e.serialize()),
      k: rl.keyHandlers.items.map((sys) => sys.name),
      m: rl.mouseHandlers.items.map((sys) => sys.name),
      s: rl.systems.filter((sys) => sys.enabled).map((sys) => sys.name),
      x: Array.from(persistent).map(([name, obj]) => saveObj(name, obj))
    };
    localStorage.setItem(saveId, JSON.stringify(save));
  }
  function loadGame() {
    const raw = localStorage.getItem(saveId);
    if (!raw)
      throw new Error("No save data.");
    const rl = RL.instance;
    const save = JSON.parse(raw);
    rl.entities.clear();
    for (const data of save.e) {
      const e = RLEntity.deserialize(data);
      rl.entities.set(e.id, e);
    }
    rl.keyHandlers.clear();
    for (const kh of save.k)
      rl.keyHandlers.push(rl.env.get(kh));
    rl.mouseHandlers.clear();
    for (const mh of save.m)
      rl.mouseHandlers.push(rl.env.get(mh));
    for (const sys of rl.systems) {
      if (save.s.includes(sys.name))
        sys.enable();
      else
        sys.disable();
    }
    for (const [name, data] of save.x) {
      const obj = persistent.get(name);
      if (obj)
        Serializer.instance.deserialize(data, obj);
    }
  }
  function canLoadGame() {
    return localStorage.getItem(saveId) !== null;
  }
  function persist({ value: name }, obj) {
    switch (obj.type) {
      case "messages":
      case "grid":
      case "tile":
        persistent.set(name, obj);
        break;
      default:
        throw new Error(`Cannot persist type: ${obj.type}`);
    }
  }
  var lib = {
    abs,
    add,
    canLoadGame,
    clamp,
    clear,
    clearHandlers,
    clearRect,
    debug,
    draw,
    drawBag,
    drawBox,
    drawCentred,
    drawLog,
    drawGrid,
    find,
    floor,
    getFOV,
    getNextMove,
    join,
    loadGame,
    persist,
    popKeyHandler,
    popMouseHandler,
    pushKeyHandler,
    pushMouseHandler,
    randInt,
    remove,
    repeat,
    saveGame,
    setSize,
    spawn,
    sqrt
  };
  var lib_default = lib;

  // src/index.ts
  window.addEventListener("load", () => {
    const main = document.getElementById("main");
    if (!main || main.tagName !== "CANVAS")
      throw new Error("Canvas #main not found.");
    const g = new Game(new RL(lib_default, implementation(lib_default)), main);
    g.init();
    void g.start();
  });
})();
//# sourceMappingURL=build.js.map
