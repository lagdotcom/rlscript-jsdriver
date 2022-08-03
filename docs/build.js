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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
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

  // node_modules/wglt/dist/wglt.js
  var require_wglt = __commonJS({
    "node_modules/wglt/dist/wglt.js"(exports, module) {
      !function(t, i) {
        typeof exports === "object" && typeof module === "object" ? module.exports = i() : typeof define === "function" && define.amd ? define([], i) : typeof exports === "object" ? exports.wglt = i() : t.wglt = i();
      }(globalThis, () => (() => {
        "use strict";
        var t = { d: (i2, e2) => {
          for (var s2 in e2)
            t.o(e2, s2) && !t.o(i2, s2) && Object.defineProperty(i2, s2, { enumerable: true, get: e2[s2] });
        }, o: (t2, i2) => Object.prototype.hasOwnProperty.call(t2, i2), r: (t2) => {
          typeof Symbol !== "undefined" && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        } }, i = {};
        let e;
        t.r(i), t.d(i, { BlendMode: () => e, Cell: () => l, Chars: () => E, Colors: () => d, Console: () => u, DEFAULT_FONT: () => O, DefaultDialogRenderer: () => S, Dialog: () => p, DialogState: () => U, Font: () => T, FovOctants: () => V, FovQuadrants: () => g, GUI: () => B, Keyboard: () => m, Keys: () => x, MessageDialog: () => P, Mouse: () => j, Point: () => f, RNG: () => rt, Rect: () => D, SelectDialog: () => F, Terminal: () => _t, computePath: () => tt, fixBoxCells: () => n, fromHsv: () => a, fromRgb: () => _, getFovQuadrant: () => L, loadImage: () => G, loadImage2x: () => X }), function(t2) {
          t2[t2.None = 0] = "None", t2[t2.Blend = 1] = "Blend", t2[t2.Add = 2] = "Add";
        }(e || (e = {}));
        const s = [[1, 0, 1, 0], [1, 0, 1, 1], [1, 0, 1, 2], [2, 0, 2, 1], [0, 0, 2, 1], [0, 0, 1, 2], [2, 0, 2, 2], [2, 0, 2, 0], [0, 0, 2, 2], [2, 0, 0, 2], [2, 0, 0, 1], [1, 0, 0, 2], [0, 0, 1, 1], [1, 1, 0, 0], [1, 1, 0, 1], [0, 1, 1, 1], [1, 1, 1, 0], [0, 1, 0, 1], [1, 1, 1, 1], [1, 2, 1, 0], [2, 1, 2, 0], [2, 2, 0, 0], [0, 2, 2, 0], [2, 2, 0, 2], [0, 2, 2, 2], [2, 2, 2, 0], [0, 2, 0, 2], [2, 2, 2, 2], [1, 2, 0, 2], [2, 1, 0, 1], [0, 2, 1, 2], [0, 1, 2, 1], [2, 1, 0, 0], [1, 2, 0, 0], [0, 2, 1, 0], [0, 1, 2, 0], [2, 1, 2, 1], [1, 2, 1, 2], [1, 0, 0, 1], [0, 1, 1, 0]];
        function r(t2, i2, e2) {
          const s2 = t2.getCharCode(i2, e2);
          return s2 !== void 0 && s2 >= 179 && s2 <= 218;
        }
        function h(t2, i2, e2, r2) {
          if (i2 < 0 || e2 < 0 || i2 >= t2.width || e2 >= t2.height)
            return 0;
          const h2 = t2.getCharCode(i2, e2);
          return h2 === void 0 || h2 < 179 || h2 > 218 ? 0 : s[h2 - 179][r2];
        }
        function o(t2, i2, e2, r2) {
          for (let h2 = 0; h2 < s.length; h2++) {
            const o2 = s[h2];
            if (o2[0] === t2 && o2[1] === i2 && o2[2] === e2 && o2[3] === r2)
              return 179 + h2;
          }
          return 0;
        }
        function n(t2) {
          for (let i2 = 0; i2 < t2.height; i2++)
            for (let e2 = 0; e2 < t2.width; e2++)
              if (r(t2, e2, i2)) {
                let s2 = h(t2, e2, i2 - 1, 2), r2 = h(t2, e2 + 1, i2, 3), n2 = h(t2, e2, i2 + 1, 0), _2 = h(t2, e2 - 1, i2, 1);
                s2 > 0 && r2 === 0 && n2 === 0 && _2 === 0 ? n2 = s2 : s2 === 0 && r2 > 0 && n2 === 0 && _2 === 0 ? _2 = r2 : s2 === 0 && r2 === 0 && n2 > 0 && _2 === 0 ? s2 = n2 : s2 === 0 && r2 === 0 && n2 === 0 && _2 > 0 && (r2 = _2), _2 > 0 && r2 > 0 && (_2 = r2 = Math.max(_2, r2)), s2 > 0 && n2 > 0 && (s2 = n2 = Math.max(s2, n2));
                const a2 = o(s2, r2, n2, _2);
                if ((s2 || r2 || n2 || _2) && !(a2 >= 179 && a2 <= 218))
                  throw new Error("invalid char code! (up=" + s2 + ", right=" + r2 + ", down=" + n2 + ", left=" + _2 + ")");
                t2.drawChar(e2, i2, a2);
              }
        }
        function _(t2, i2, e2, s2) {
          return s2 === void 0 && (s2 = 255), (t2 << 24) + (i2 << 16) + (e2 << 8) + s2;
        }
        function a(t2, i2, e2, s2) {
          const r2 = 6 * t2 | 0, h2 = 6 * t2 - r2, o2 = e2 * (1 - i2), n2 = e2 * (1 - h2 * i2), a2 = e2 * (1 - (1 - h2) * i2);
          let d2, A2, l2;
          switch (r2 % 6) {
            case 0:
              d2 = e2, A2 = a2, l2 = o2;
              break;
            case 1:
              d2 = n2, A2 = e2, l2 = o2;
              break;
            case 2:
              d2 = o2, A2 = e2, l2 = a2;
              break;
            case 3:
              d2 = o2, A2 = n2, l2 = e2;
              break;
            case 4:
              d2 = a2, A2 = o2, l2 = e2;
              break;
            case 5:
              d2 = e2, A2 = o2, l2 = n2;
              break;
            default:
              d2 = 0, A2 = 0, l2 = 0;
          }
          return s2 === void 0 && (s2 = 1), _(255 * d2 | 0, 255 * A2 | 0, 255 * l2 | 0, 255 * s2 | 0);
        }
        const d = { BLACK: _(0, 0, 0), WHITE: _(255, 255, 255), LIGHT_GRAY: _(170, 170, 170), DARK_GRAY: _(85, 85, 85), YELLOW: _(255, 255, 85), BROWN: _(170, 85, 0), LIGHT_RED: _(255, 85, 85), DARK_RED: _(170, 0, 0), LIGHT_GREEN: _(85, 255, 85), DARK_GREEN: _(0, 170, 0), LIGHT_CYAN: _(85, 255, 255), DARK_CYAN: _(0, 170, 170), LIGHT_BLUE: _(85, 85, 255), DARK_BLUE: _(0, 0, 170), LIGHT_MAGENTA: _(255, 85, 255), DARK_MAGENTA: _(170, 0, 170), ORANGE: _(255, 136, 0) };
        function A(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class l {
          constructor(t2, i2, e2, s2, r2) {
            A(this, "x", void 0), A(this, "y", void 0), A(this, "charCode", void 0), A(this, "fg", void 0), A(this, "bg", void 0), A(this, "dirty", void 0), A(this, "blocked", void 0), A(this, "blockedSight", void 0), A(this, "explored", void 0), A(this, "visible", void 0), A(this, "pathId", void 0), A(this, "g", void 0), A(this, "h", void 0), A(this, "prev", void 0), this.x = t2, this.y = i2, this.charCode = e2 !== void 0 ? function(t3) {
              return typeof t3 === "string" && t3.length > 0 ? t3.charCodeAt(0) : t3;
            }(e2) : " ".charCodeAt(0), this.fg = s2 !== void 0 ? s2 : d.WHITE, this.bg = r2 !== void 0 ? r2 : d.BLACK, this.dirty = true, this.blocked = false, this.blockedSight = false, this.explored = false, this.visible = false, this.pathId = -1, this.g = 0, this.h = 0, this.prev = null;
          }
          setCharCode(t2) {
            this.charCode !== t2 && (this.charCode = t2, this.dirty = true);
          }
          setForeground(t2) {
            t2 !== void 0 && t2 !== null && t2 !== this.fg && (this.fg = t2, this.dirty = true);
          }
          setBackground(t2) {
            t2 !== void 0 && t2 !== null && t2 !== this.bg && (this.bg = t2, this.dirty = true);
          }
          setValue(t2, i2, s2) {
            return typeof t2 === "string" && (t2 = t2.charCodeAt(0)), typeof t2 === "number" ? (this.setCharCode(t2), i2 !== void 0 && this.setForeground(i2), s2 !== void 0 && this.setBackground(s2)) : this.drawCell(t2, e.None), this.dirty;
          }
          drawCell(t2, i2) {
            const s2 = 255 & t2.bg;
            i2 === e.None || t2.charCode > 0 ? (this.setCharCode(t2.charCode), this.setForeground(t2.fg)) : s2 > 0 && s2 < 255 && this.setForeground(this.blendColors(this.fg, t2.bg, i2)), i2 === e.None || s2 === 255 ? this.setBackground(t2.bg) : s2 > 0 && this.setBackground(this.blendColors(this.bg, t2.bg, i2));
          }
          blendColors(t2, i2, s2) {
            const r2 = (255 - (255 & i2)) / 255, h2 = 1 - r2, o2 = t2 >> 24 & 255, n2 = t2 >> 16 & 255, a2 = t2 >> 8 & 255, d2 = i2 >> 24 & 255, A2 = i2 >> 16 & 255, l2 = i2 >> 8 & 255;
            switch (s2) {
              case e.Blend:
                return _(r2 * o2 + h2 * d2 | 0, r2 * n2 + h2 * A2 | 0, r2 * a2 + h2 * l2 | 0);
              case e.Add:
                return _(this.clamp(o2 + h2 * d2 | 0), this.clamp(n2 + h2 * A2 | 0), this.clamp(a2 + h2 * l2 | 0));
              default:
                return i2;
            }
          }
          clamp(t2) {
            return Math.min(255, t2);
          }
        }
        let E;
        function c(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        !function(t2) {
          t2[t2.SMILEY = 1] = "SMILEY", t2[t2.INVERSE_SMILEY = 2] = "INVERSE_SMILEY", t2[t2.HEART = 3] = "HEART", t2[t2.DIAMOND = 4] = "DIAMOND", t2[t2.CLUB = 5] = "CLUB", t2[t2.SPADE = 6] = "SPADE", t2[t2.BULLET = 7] = "BULLET", t2[t2.INVERSE_BULLET = 8] = "INVERSE_BULLET", t2[t2.LIGHT_SHADE = 176] = "LIGHT_SHADE", t2[t2.MEDIUM_SHADE = 177] = "MEDIUM_SHADE", t2[t2.DARK_SHADE = 178] = "DARK_SHADE", t2[t2.BOX_SINGLE_VERTICAL = 179] = "BOX_SINGLE_VERTICAL", t2[t2.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT = 180] = "BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT", t2[t2.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT = 185] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT", t2[t2.BOX_DOUBLE_VERTICAL = 186] = "BOX_DOUBLE_VERTICAL", t2[t2.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT = 187] = "BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT", t2[t2.BOX_DOUBLE_UP_AND_DOUBLE_LEFT = 188] = "BOX_DOUBLE_UP_AND_DOUBLE_LEFT", t2[t2.BOX_SINGLE_DOWN_AND_SINGLE_LEFT = 191] = "BOX_SINGLE_DOWN_AND_SINGLE_LEFT", t2[t2.BOX_SINGLE_UP_AND_SINGLE_RIGHT = 192] = "BOX_SINGLE_UP_AND_SINGLE_RIGHT", t2[t2.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP = 193] = "BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP", t2[t2.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN = 194] = "BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN", t2[t2.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT = 195] = "BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT", t2[t2.BOX_SINGLE_HORIZONTAL = 196] = "BOX_SINGLE_HORIZONTAL", t2[t2.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL = 197] = "BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL", t2[t2.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT = 200] = "BOX_DOUBLE_UP_AND_DOUBLE_RIGHT", t2[t2.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT = 201] = "BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT", t2[t2.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP = 202] = "BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP", t2[t2.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN = 203] = "BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN", t2[t2.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT = 204] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT", t2[t2.BOX_DOUBLE_HORIZONTAL = 205] = "BOX_DOUBLE_HORIZONTAL", t2[t2.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL = 206] = "BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL", t2[t2.BOX_SINGLE_UP_AND_SINGLE_LEFT = 217] = "BOX_SINGLE_UP_AND_SINGLE_LEFT", t2[t2.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT = 218] = "BOX_SINGLE_DOWN_AND_SINGLE_RIGHT", t2[t2.BLOCK_FULL = 219] = "BLOCK_FULL", t2[t2.BLOCK_BOTTOM_HALF = 220] = "BLOCK_BOTTOM_HALF", t2[t2.BLOCK_LEFT_HALF = 221] = "BLOCK_LEFT_HALF", t2[t2.BLOCK_RIGHT_HALF = 222] = "BLOCK_RIGHT_HALF", t2[t2.BLOCK_TOP_HALF = 223] = "BLOCK_TOP_HALF";
        }(E || (E = {}));
        class u {
          constructor(t2, i2, e2) {
            c(this, "width", void 0), c(this, "height", void 0), c(this, "grid", void 0), c(this, "originX", void 0), c(this, "originY", void 0), c(this, "minX", void 0), c(this, "maxX", void 0), c(this, "minY", void 0), c(this, "maxY", void 0), c(this, "radius", void 0), this.width = t2, this.height = i2, this.grid = [], this.originX = 0, this.originY = 0, this.minX = 0, this.maxX = 0, this.minY = 0, this.maxY = 0, this.radius = 0;
            for (let e3 = 0; e3 < i2; e3++) {
              const i3 = [];
              for (let s2 = 0; s2 < t2; s2++)
                i3.push(new l(s2, e3));
              this.grid.push(i3);
            }
            if (this.clear(), e2)
              for (let s2 = 0; s2 < i2; s2++)
                for (let i3 = 0; i3 < t2; i3++)
                  this.grid[s2][i3].blocked = this.grid[s2][i3].blockedSight = e2(i3, s2);
          }
          clear() {
            for (let t2 = 0; t2 < this.height; t2++)
              for (let i2 = 0; i2 < this.width; i2++)
                this.drawChar(i2, t2, 0);
          }
          getCell(t2, i2) {
            if (!(t2 < 0 || i2 < 0 || t2 >= this.width || i2 >= this.height))
              return this.grid[i2][t2];
          }
          getCharCode(t2, i2) {
            if (!(t2 < 0 || i2 < 0 || t2 >= this.width || i2 >= this.height))
              return this.grid[i2][t2].charCode;
          }
          drawChar(t2, i2, e2, s2, r2) {
            t2 >= 0 && t2 < this.width && i2 >= 0 && i2 < this.height && this.grid[0 | i2][0 | t2].setValue(e2, s2, r2);
          }
          drawString(t2, i2, e2, s2, r2) {
            const h2 = e2.split("\n");
            for (let e3 = 0; e3 < h2.length; e3++) {
              const o2 = h2[e3];
              for (let h3 = 0; h3 < o2.length; h3++)
                this.drawChar(t2 + h3, i2 + e3, o2.charCodeAt(h3), s2, r2);
            }
          }
          drawCenteredString(t2, i2, e2, s2, r2) {
            this.drawString(t2 - Math.floor(e2.length / 2), i2, e2, s2, r2);
          }
          drawHLine(t2, i2, e2, s2, r2, h2) {
            for (let o2 = t2; o2 < t2 + e2; o2++)
              this.drawChar(o2, i2, s2, r2, h2);
          }
          drawVLine(t2, i2, e2, s2, r2, h2) {
            for (let o2 = i2; o2 < i2 + e2; o2++)
              this.drawChar(t2, o2, s2, r2, h2);
          }
          drawRect(t2, i2, e2, s2, r2, h2, o2) {
            this.drawHLine(t2, i2, e2, r2, h2, o2), this.drawHLine(t2, i2 + s2 - 1, e2, r2, h2, o2), this.drawVLine(t2, i2, s2, r2, h2, o2), this.drawVLine(t2 + e2 - 1, i2, s2, r2, h2, o2);
          }
          drawBox(t2, i2, e2, s2, r2, h2, o2, n2, _2, a2, d2, A2, l2, E2) {
            this.fillRect(t2, i2, e2, s2, 0, l2, E2), this.drawHLine(t2, i2, e2, r2), this.drawHLine(t2, i2 + s2 - 1, e2, o2), this.drawVLine(t2, i2, s2, n2), this.drawVLine(t2 + e2 - 1, i2, s2, h2), this.drawChar(t2, i2, _2), this.drawChar(t2 + e2 - 1, i2, a2), this.drawChar(t2, i2 + s2 - 1, A2), this.drawChar(t2 + e2 - 1, i2 + s2 - 1, d2);
          }
          drawSingleBox(t2, i2, e2, s2, r2, h2) {
            this.drawBox(t2, i2, e2, s2, E.BOX_SINGLE_HORIZONTAL, E.BOX_SINGLE_VERTICAL, E.BOX_SINGLE_HORIZONTAL, E.BOX_SINGLE_VERTICAL, E.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT, E.BOX_SINGLE_DOWN_AND_SINGLE_LEFT, E.BOX_SINGLE_UP_AND_SINGLE_LEFT, E.BOX_SINGLE_UP_AND_SINGLE_RIGHT, r2, h2);
          }
          drawDoubleBox(t2, i2, e2, s2, r2, h2) {
            this.drawBox(t2, i2, e2, s2, E.BOX_DOUBLE_HORIZONTAL, E.BOX_DOUBLE_VERTICAL, E.BOX_DOUBLE_HORIZONTAL, E.BOX_DOUBLE_VERTICAL, E.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT, E.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT, E.BOX_DOUBLE_UP_AND_DOUBLE_LEFT, E.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, r2, h2);
          }
          fillRect(t2, i2, e2, s2, r2, h2, o2) {
            for (let n2 = i2; n2 < i2 + s2; n2++)
              this.drawHLine(t2, n2, e2, r2, h2, o2);
          }
          drawConsole(t2, i2, s2, r2, h2, o2, n2, _2) {
            _2 = _2 || e.None;
            for (let e2 = 0; e2 < n2; e2++)
              for (let n3 = 0; n3 < o2; n3++) {
                const o3 = s2.getCell(r2 + n3, h2 + e2);
                o3 && this.drawCell(t2 + n3, i2 + e2, o3, _2);
              }
          }
          drawCell(t2, i2, e2, s2) {
            t2 >= 0 && t2 < this.width && i2 >= 0 && i2 < this.height && this.grid[i2][t2].drawCell(e2, s2);
          }
          setBlocked(t2, i2, e2) {
            t2 >= 0 && t2 < this.width && i2 >= 0 && i2 < this.height && (this.grid[i2][t2].blocked = e2);
          }
          setBlockedSight(t2, i2, e2) {
            t2 >= 0 && t2 < this.width && i2 >= 0 && i2 < this.height && (this.grid[i2][t2].blockedSight = e2);
          }
          isVisible(t2, i2) {
            return !(t2 < this.minX || t2 > this.maxX || i2 < this.minY || i2 > this.maxY) && this.grid[i2][t2].visible;
          }
          isBlocked(t2, i2) {
            return t2 < 0 || t2 > this.width || i2 < 0 || i2 > this.height || this.grid[i2][t2].blocked;
          }
          isBlockedSight(t2, i2) {
            return t2 < 0 || t2 > this.width || i2 < 0 || i2 > this.height || this.grid[i2][t2].blockedSight;
          }
          computeOctantY(t2, i2) {
            const e2 = [], s2 = [];
            let r2, h2, o2, n2, _2, a2, d2, A2, l2, E2, c2 = 1, u2 = 0, K2 = 0, T2 = 0;
            for (h2 = this.originY + i2; h2 >= this.minY && h2 <= this.maxY; h2 += i2, K2 = u2, ++c2)
              for (o2 = 0.5 / c2, E2 = -1, n2 = Math.floor(T2 * c2 + 0.5), r2 = this.originX + n2 * t2; n2 <= c2 && r2 >= this.minX && r2 <= this.maxX; r2 += t2, ++n2, E2 = l2) {
                if (_2 = true, a2 = false, d2 = n2 / c2, A2 = E2, l2 = d2 + o2, K2 > 0)
                  if (this.grid[h2 - i2][r2].visible && !this.grid[h2 - i2][r2].blockedSight || this.grid[h2 - i2][r2 - t2].visible && !this.grid[h2 - i2][r2 - t2].blockedSight) {
                    for (let t3 = 0; t3 < K2 && _2; ++t3)
                      if (A2 <= s2[t3] && l2 >= e2[t3]) {
                        if (this.grid[h2][r2].blockedSight) {
                          if (A2 >= e2[t3] && l2 <= s2[t3]) {
                            _2 = false;
                            break;
                          }
                          e2[t3] = Math.min(e2[t3], A2), s2[t3] = Math.max(s2[t3], l2), a2 = true;
                        } else if (d2 > e2[t3] && d2 < s2[t3]) {
                          _2 = false;
                          break;
                        }
                      }
                  } else
                    _2 = false;
                _2 && (this.grid[h2][r2].visible = true, this.grid[h2][r2].blockedSight && (T2 >= A2 ? T2 = l2 : a2 || (e2[u2] = A2, s2[u2++] = l2)));
              }
          }
          computeOctantX(t2, i2) {
            const e2 = [], s2 = [];
            let r2, h2, o2, n2, _2, a2, d2, A2, l2, E2, c2 = 1, u2 = 0, K2 = 0, T2 = 0;
            for (r2 = this.originX + t2; r2 >= this.minX && r2 <= this.maxX; r2 += t2, K2 = u2, ++c2)
              for (o2 = 0.5 / c2, E2 = -1, n2 = Math.floor(T2 * c2 + 0.5), h2 = this.originY + n2 * i2; n2 <= c2 && h2 >= this.minY && h2 <= this.maxY; h2 += i2, ++n2, E2 = l2) {
                if (_2 = true, a2 = false, d2 = n2 / c2, A2 = E2, l2 = d2 + o2, K2 > 0)
                  if (this.grid[h2][r2 - t2].visible && !this.grid[h2][r2 - t2].blockedSight || this.grid[h2 - i2][r2 - t2].visible && !this.grid[h2 - i2][r2 - t2].blockedSight) {
                    for (let t3 = 0; t3 < K2 && _2; ++t3)
                      if (A2 <= s2[t3] && l2 >= e2[t3]) {
                        if (this.grid[h2][r2].blockedSight) {
                          if (A2 >= e2[t3] && l2 <= s2[t3]) {
                            _2 = false;
                            break;
                          }
                          e2[t3] = Math.min(e2[t3], A2), s2[t3] = Math.max(s2[t3], l2), a2 = true;
                        } else if (d2 > e2[t3] && d2 < s2[t3]) {
                          _2 = false;
                          break;
                        }
                      }
                  } else
                    _2 = false;
                _2 && (this.grid[h2][r2].visible = true, this.grid[h2][r2].blockedSight && (T2 >= A2 ? T2 = l2 : a2 || (e2[u2] = A2, s2[u2++] = l2)));
              }
          }
          computeFov(t2, i2, e2, s2, r2) {
            if (this.originX = t2, this.originY = i2, this.radius = e2, s2)
              this.minX = Math.min(this.minX, Math.max(0, t2 - e2)), this.minY = Math.min(this.minY, Math.max(0, i2 - e2)), this.maxX = Math.max(this.maxX, Math.min(this.width - 1, t2 + e2)), this.maxY = Math.max(this.maxY, Math.min(this.height - 1, i2 + e2));
            else {
              this.minX = Math.max(0, t2 - e2), this.minY = Math.max(0, i2 - e2), this.maxX = Math.min(this.width - 1, t2 + e2), this.maxY = Math.min(this.height - 1, i2 + e2);
              for (let t3 = this.minY; t3 <= this.maxY; t3++)
                for (let i3 = this.minX; i3 <= this.maxX; i3++)
                  this.grid[t3][i3].visible = false;
            }
            this.grid[i2][t2].visible = true, r2 === void 0 ? (this.computeOctantY(1, 1), this.computeOctantX(1, 1), this.computeOctantX(1, -1), this.computeOctantY(1, -1), this.computeOctantY(-1, -1), this.computeOctantX(-1, -1), this.computeOctantX(-1, 1), this.computeOctantY(-1, 1)) : (1 & r2 && this.computeOctantY(1, 1), 2 & r2 && this.computeOctantX(1, 1), 4 & r2 && this.computeOctantX(1, -1), 8 & r2 && this.computeOctantY(1, -1), 16 & r2 && this.computeOctantY(-1, -1), 32 & r2 && this.computeOctantX(-1, -1), 64 & r2 && this.computeOctantX(-1, 1), 128 & r2 && this.computeOctantY(-1, 1));
          }
          updateExplored() {
            for (let t2 = this.minY; t2 <= this.maxY; t2++)
              for (let i2 = this.minX; i2 <= this.maxX; i2++) {
                const e2 = this.grid[t2][i2];
                e2.explored = e2.explored || e2.visible;
              }
          }
        }
        function K(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class T {
          constructor(t2, i2, e2, s2, r2) {
            K(this, "url", void 0), K(this, "charWidth", void 0), K(this, "charHeight", void 0), K(this, "scale", void 0), K(this, "graphical", void 0), this.url = t2, this.charWidth = i2, this.charHeight = e2, this.scale = s2 || 1, this.graphical = !!r2;
          }
        }
        const O = new T("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eICJsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBqucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqhJRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvhA1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIzCAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsWIE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBWl5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtLji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2fotTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZUghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2GAzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJG199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJIlipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC", 8, 8);
        let V, g;
        function L(t2, i2) {
          return t2 > 0 ? i2 > 0 ? g.QUADRANT_SOUTHEAST : i2 === 0 ? g.QUADRANT_EAST : g.QUADRANT_NORTHEAST : t2 < 0 ? i2 > 0 ? g.QUADRANT_SOUTHWEST : i2 === 0 ? g.QUADRANT_WEST : g.QUADRANT_NORTHWEST : i2 > 0 ? g.QUADRANT_SOUTH : g.QUADRANT_NORTH;
        }
        function N(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        !function(t2) {
          t2[t2.OCTANT_SOUTH_SOUTHEAST = 1] = "OCTANT_SOUTH_SOUTHEAST", t2[t2.OCTANT_EAST_SOUTHEAST = 2] = "OCTANT_EAST_SOUTHEAST", t2[t2.OCTANT_EAST_NORTHTHEAST = 4] = "OCTANT_EAST_NORTHTHEAST", t2[t2.OCTANT_NORTH_NORTHEAST = 8] = "OCTANT_NORTH_NORTHEAST", t2[t2.OCTANT_NORTH_NORTHWEST = 16] = "OCTANT_NORTH_NORTHWEST", t2[t2.OCTANT_WEST_NORTHEAST = 32] = "OCTANT_WEST_NORTHEAST", t2[t2.OCTANT_WEST_SOUTHWEST = 64] = "OCTANT_WEST_SOUTHWEST", t2[t2.OCTANT_SOUTH_SOUTHWEST = 128] = "OCTANT_SOUTH_SOUTHWEST";
        }(V || (V = {})), function(t2) {
          t2[t2.QUADRANT_SOUTHEAST = 3] = "QUADRANT_SOUTHEAST", t2[t2.QUADRANT_EAST = 6] = "QUADRANT_EAST", t2[t2.QUADRANT_NORTHEAST = 12] = "QUADRANT_NORTHEAST", t2[t2.QUADRANT_NORTH = 24] = "QUADRANT_NORTH", t2[t2.QUADRANT_NORTHWEST = 48] = "QUADRANT_NORTHWEST", t2[t2.QUADRANT_WEST = 96] = "QUADRANT_WEST", t2[t2.QUADRANT_SOUTHWEST = 192] = "QUADRANT_SOUTHWEST", t2[t2.QUADRANT_SOUTH = 129] = "QUADRANT_SOUTH";
        }(g || (g = {}));
        class f {
          constructor(t2, i2) {
            N(this, "x", void 0), N(this, "y", void 0), this.x = t2, this.y = i2;
          }
        }
        function R(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class D {
          constructor(t2, i2, e2, s2) {
            R(this, "x", void 0), R(this, "y", void 0), R(this, "width", void 0), R(this, "height", void 0), R(this, "left", void 0), R(this, "top", void 0), R(this, "x2", void 0), R(this, "y2", void 0), this.x = this.left = t2, this.y = this.top = i2, this.width = e2, this.height = s2, this.x2 = t2 + e2, this.y2 = i2 + s2;
          }
          getCenter() {
            return new f(this.x + this.width / 2 | 0, this.y + this.height / 2 | 0);
          }
          intersects(t2) {
            return this.x <= t2.x2 && this.x2 >= t2.x && this.y <= t2.y2 && this.y2 >= t2.y;
          }
          contains(t2) {
            return t2.x >= this.x && t2.x < this.x2 && t2.y >= this.y && t2.y < this.y2;
          }
        }
        function C(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class U {
          constructor(t2, i2, e2) {
            C(this, "dialog", void 0), C(this, "rect", void 0), C(this, "contentsOffset", void 0), C(this, "open", void 0), C(this, "count", void 0), C(this, "buffer", void 0), this.dialog = t2, this.rect = i2, this.contentsOffset = e2, this.open = false, this.count = 0;
          }
        }
        class S {
          getState(t2, i2) {
            const e2 = i2.contentsRect.width + 4, s2 = i2.contentsRect.height + 4, r2 = (t2.width - e2) / 2 | 0, h2 = (t2.height - s2) / 2 | 0;
            return new U(i2, new D(r2, h2, e2, s2), new f(r2 + 2, h2 + 2));
          }
          draw(t2, i2) {
            const e2 = i2.dialog, { x: s2, y: r2, width: h2, height: o2 } = i2.rect;
            t2.fillRect(s2, r2, h2, o2, 0, d.WHITE, d.BLACK), t2.drawSingleBox(s2, r2, h2, o2), t2.drawCenteredString(s2 + h2 / 2 | 0, r2, " " + e2.title + " "), e2.drawContents(t2, i2.contentsOffset);
          }
        }
        function v(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class B {
          constructor(t2, i2) {
            v(this, "terminal", void 0), v(this, "renderer", void 0), v(this, "dialogs", void 0), this.terminal = t2, this.renderer = i2 || new S(), this.dialogs = [];
          }
          add(t2) {
            this.dialogs.push(this.renderer.getState(this.terminal, t2));
          }
          handleInput() {
            if (this.dialogs.length === 0)
              return false;
            const t2 = this.dialogs.length - 1, i2 = this.dialogs[this.dialogs.length - 1];
            return i2.dialog.handleInput(this.terminal, i2.contentsOffset) && this.dialogs.splice(t2, 1), true;
          }
          draw() {
            for (let t2 = 0; t2 < this.dialogs.length; t2++)
              this.renderer.draw(this.terminal, this.dialogs[t2]);
          }
        }
        function I(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class p {
          constructor(t2, i2) {
            I(this, "contentsRect", void 0), I(this, "title", void 0), this.contentsRect = t2, this.title = i2;
          }
        }
        function b(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class w {
          constructor() {
            b(this, "down", void 0), b(this, "downTime", void 0), b(this, "repeat", void 0), b(this, "repeatTime", void 0), b(this, "downCount", void 0), b(this, "upCount", void 0), this.down = false, this.downTime = 0, this.repeat = false, this.repeatTime = 0, this.downCount = 0, this.upCount = 100;
          }
          setDown(t2) {
            this.down !== t2 && (this.down = t2, this.repeat = false, this.downTime = this.repeatTime = performance.now());
          }
          update(t2) {
            this.repeat = false, this.down ? (this.downCount++, this.upCount = 0, t2 - this.downTime >= 200 && t2 - this.repeatTime >= 66.66666666666667 && (this.repeat = true, this.repeatTime = t2)) : (this.downCount = 0, this.upCount++);
          }
          isPressed() {
            return this.downCount === 1 || this.repeat;
          }
          isClicked() {
            return this.upCount === 1;
          }
        }
        const y = 256;
        class m {
          constructor(t2) {
            var i2, e2, s2;
            s2 = void 0, (e2 = "keys") in (i2 = this) ? Object.defineProperty(i2, e2, { value: s2, enumerable: true, configurable: true, writable: true }) : i2[e2] = s2, this.keys = new Array(y);
            for (let t3 = 0; t3 < y; t3++)
              this.keys[t3] = new w();
            t2.addEventListener("keydown", (t3) => this.setKey(t3, true)), t2.addEventListener("keyup", (t3) => this.setKey(t3, false));
          }
          setKey(t2, i2) {
            const e2 = t2.keyCode;
            e2 !== x.VK_F11 && (t2.stopPropagation(), t2.preventDefault(), e2 >= 0 && e2 < y && this.keys[e2].setDown(i2));
          }
          updateKeys(t2) {
            for (let i2 = 0; i2 < y; i2++)
              this.keys[i2].update(t2);
          }
          getKey(t2) {
            return t2 >= 0 && t2 < y ? this.keys[t2] : null;
          }
        }
        let x;
        !function(t2) {
          t2[t2.VK_CANCEL = 3] = "VK_CANCEL", t2[t2.VK_HELP = 6] = "VK_HELP", t2[t2.VK_BACK_SPACE = 8] = "VK_BACK_SPACE", t2[t2.VK_TAB = 9] = "VK_TAB", t2[t2.VK_CLEAR = 12] = "VK_CLEAR", t2[t2.VK_ENTER = 13] = "VK_ENTER", t2[t2.VK_SHIFT = 16] = "VK_SHIFT", t2[t2.VK_CONTROL = 17] = "VK_CONTROL", t2[t2.VK_ALT = 18] = "VK_ALT", t2[t2.VK_PAUSE = 19] = "VK_PAUSE", t2[t2.VK_CAPS_LOCK = 20] = "VK_CAPS_LOCK", t2[t2.VK_ESCAPE = 27] = "VK_ESCAPE", t2[t2.VK_SPACE = 32] = "VK_SPACE", t2[t2.VK_PAGE_UP = 33] = "VK_PAGE_UP", t2[t2.VK_PAGE_DOWN = 34] = "VK_PAGE_DOWN", t2[t2.VK_END = 35] = "VK_END", t2[t2.VK_HOME = 36] = "VK_HOME", t2[t2.VK_LEFT = 37] = "VK_LEFT", t2[t2.VK_UP = 38] = "VK_UP", t2[t2.VK_RIGHT = 39] = "VK_RIGHT", t2[t2.VK_DOWN = 40] = "VK_DOWN", t2[t2.VK_PRINTSCREEN = 44] = "VK_PRINTSCREEN", t2[t2.VK_INSERT = 45] = "VK_INSERT", t2[t2.VK_DELETE = 46] = "VK_DELETE", t2[t2.VK_0 = 48] = "VK_0", t2[t2.VK_1 = 49] = "VK_1", t2[t2.VK_2 = 50] = "VK_2", t2[t2.VK_3 = 51] = "VK_3", t2[t2.VK_4 = 52] = "VK_4", t2[t2.VK_5 = 53] = "VK_5", t2[t2.VK_6 = 54] = "VK_6", t2[t2.VK_7 = 55] = "VK_7", t2[t2.VK_8 = 56] = "VK_8", t2[t2.VK_9 = 57] = "VK_9", t2[t2.VK_COLON = 58] = "VK_COLON", t2[t2.VK_SEMICOLON = 59] = "VK_SEMICOLON", t2[t2.VK_LESS_THAN = 60] = "VK_LESS_THAN", t2[t2.VK_EQUALS = 61] = "VK_EQUALS", t2[t2.VK_GREATER_THAN = 62] = "VK_GREATER_THAN", t2[t2.VK_QUESTION_MARK = 63] = "VK_QUESTION_MARK", t2[t2.VK_AT = 64] = "VK_AT", t2[t2.VK_A = 65] = "VK_A", t2[t2.VK_B = 66] = "VK_B", t2[t2.VK_C = 67] = "VK_C", t2[t2.VK_D = 68] = "VK_D", t2[t2.VK_E = 69] = "VK_E", t2[t2.VK_F = 70] = "VK_F", t2[t2.VK_G = 71] = "VK_G", t2[t2.VK_H = 72] = "VK_H", t2[t2.VK_I = 73] = "VK_I", t2[t2.VK_J = 74] = "VK_J", t2[t2.VK_K = 75] = "VK_K", t2[t2.VK_L = 76] = "VK_L", t2[t2.VK_M = 77] = "VK_M", t2[t2.VK_N = 78] = "VK_N", t2[t2.VK_O = 79] = "VK_O", t2[t2.VK_P = 80] = "VK_P", t2[t2.VK_Q = 81] = "VK_Q", t2[t2.VK_R = 82] = "VK_R", t2[t2.VK_S = 83] = "VK_S", t2[t2.VK_T = 84] = "VK_T", t2[t2.VK_U = 85] = "VK_U", t2[t2.VK_V = 86] = "VK_V", t2[t2.VK_W = 87] = "VK_W", t2[t2.VK_X = 88] = "VK_X", t2[t2.VK_Y = 89] = "VK_Y", t2[t2.VK_Z = 90] = "VK_Z", t2[t2.VK_CONTEXT_MENU = 93] = "VK_CONTEXT_MENU", t2[t2.VK_NUMPAD0 = 96] = "VK_NUMPAD0", t2[t2.VK_NUMPAD1 = 97] = "VK_NUMPAD1", t2[t2.VK_NUMPAD2 = 98] = "VK_NUMPAD2", t2[t2.VK_NUMPAD3 = 99] = "VK_NUMPAD3", t2[t2.VK_NUMPAD4 = 100] = "VK_NUMPAD4", t2[t2.VK_NUMPAD5 = 101] = "VK_NUMPAD5", t2[t2.VK_NUMPAD6 = 102] = "VK_NUMPAD6", t2[t2.VK_NUMPAD7 = 103] = "VK_NUMPAD7", t2[t2.VK_NUMPAD8 = 104] = "VK_NUMPAD8", t2[t2.VK_NUMPAD9 = 105] = "VK_NUMPAD9", t2[t2.VK_MULTIPLY = 106] = "VK_MULTIPLY", t2[t2.VK_ADD = 107] = "VK_ADD", t2[t2.VK_SEPARATOR = 108] = "VK_SEPARATOR", t2[t2.VK_SUBTRACT = 109] = "VK_SUBTRACT", t2[t2.VK_DECIMAL = 110] = "VK_DECIMAL", t2[t2.VK_DIVIDE = 111] = "VK_DIVIDE", t2[t2.VK_F1 = 112] = "VK_F1", t2[t2.VK_F2 = 113] = "VK_F2", t2[t2.VK_F3 = 114] = "VK_F3", t2[t2.VK_F4 = 115] = "VK_F4", t2[t2.VK_F5 = 116] = "VK_F5", t2[t2.VK_F6 = 117] = "VK_F6", t2[t2.VK_F7 = 118] = "VK_F7", t2[t2.VK_F8 = 119] = "VK_F8", t2[t2.VK_F9 = 120] = "VK_F9", t2[t2.VK_F10 = 121] = "VK_F10", t2[t2.VK_F11 = 122] = "VK_F11", t2[t2.VK_F12 = 123] = "VK_F12", t2[t2.VK_F13 = 124] = "VK_F13", t2[t2.VK_F14 = 125] = "VK_F14", t2[t2.VK_F15 = 126] = "VK_F15", t2[t2.VK_F16 = 127] = "VK_F16", t2[t2.VK_F17 = 128] = "VK_F17", t2[t2.VK_F18 = 129] = "VK_F18", t2[t2.VK_F19 = 130] = "VK_F19", t2[t2.VK_F20 = 131] = "VK_F20", t2[t2.VK_F21 = 132] = "VK_F21", t2[t2.VK_F22 = 133] = "VK_F22", t2[t2.VK_F23 = 134] = "VK_F23", t2[t2.VK_F24 = 135] = "VK_F24", t2[t2.VK_NUM_LOCK = 144] = "VK_NUM_LOCK", t2[t2.VK_SCROLL_LOCK = 145] = "VK_SCROLL_LOCK", t2[t2.VK_CIRCUMFLEX = 160] = "VK_CIRCUMFLEX", t2[t2.VK_EXCLAMATION = 161] = "VK_EXCLAMATION", t2[t2.VK_DOUBLE_QUOTE = 162] = "VK_DOUBLE_QUOTE", t2[t2.VK_HASH = 163] = "VK_HASH", t2[t2.VK_DOLLAR = 164] = "VK_DOLLAR", t2[t2.VK_PERCENT = 165] = "VK_PERCENT", t2[t2.VK_AMPERSAND = 166] = "VK_AMPERSAND", t2[t2.VK_UNDERSCORE = 167] = "VK_UNDERSCORE", t2[t2.VK_OPEN_PAREN = 168] = "VK_OPEN_PAREN", t2[t2.VK_CLOSE_PAREN = 169] = "VK_CLOSE_PAREN", t2[t2.VK_ASTERISK = 170] = "VK_ASTERISK", t2[t2.VK_PLUS = 171] = "VK_PLUS", t2[t2.VK_PIPE = 172] = "VK_PIPE", t2[t2.VK_HYPHEN_MINUS = 173] = "VK_HYPHEN_MINUS", t2[t2.VK_OPEN_CURLY_BRACKET = 174] = "VK_OPEN_CURLY_BRACKET", t2[t2.VK_CLOSE_CURLY_BRACKET = 175] = "VK_CLOSE_CURLY_BRACKET", t2[t2.VK_TILDE = 176] = "VK_TILDE", t2[t2.VK_COMMA = 188] = "VK_COMMA", t2[t2.VK_PERIOD = 190] = "VK_PERIOD", t2[t2.VK_SLASH = 191] = "VK_SLASH", t2[t2.VK_BACK_QUOTE = 192] = "VK_BACK_QUOTE", t2[t2.VK_OPEN_BRACKET = 219] = "VK_OPEN_BRACKET", t2[t2.VK_BACK_SLASH = 220] = "VK_BACK_SLASH", t2[t2.VK_CLOSE_BRACKET = 221] = "VK_CLOSE_BRACKET", t2[t2.VK_QUOTE = 222] = "VK_QUOTE", t2[t2.VK_META = 224] = "VK_META", t2[t2.VK_ALTGR = 225] = "VK_ALTGR", t2[t2.VK_WIN = 91] = "VK_WIN", t2[t2.VK_KANA = 21] = "VK_KANA", t2[t2.VK_HANGUL = 21] = "VK_HANGUL", t2[t2.VK_EISU = 22] = "VK_EISU", t2[t2.VK_JUNJA = 23] = "VK_JUNJA", t2[t2.VK_FINAL = 24] = "VK_FINAL", t2[t2.VK_HANJA = 25] = "VK_HANJA", t2[t2.VK_KANJI = 25] = "VK_KANJI", t2[t2.VK_CONVERT = 28] = "VK_CONVERT", t2[t2.VK_NONCONVERT = 29] = "VK_NONCONVERT", t2[t2.VK_ACCEPT = 30] = "VK_ACCEPT", t2[t2.VK_MODECHANGE = 31] = "VK_MODECHANGE", t2[t2.VK_SELECT = 41] = "VK_SELECT", t2[t2.VK_PRINT = 42] = "VK_PRINT", t2[t2.VK_EXECUTE = 43] = "VK_EXECUTE", t2[t2.VK_SLEEP = 95] = "VK_SLEEP";
        }(x || (x = {}));
        class P extends p {
          constructor(t2, i2) {
            const e2 = i2.split("\n");
            let s2 = t2.length;
            for (let t3 = 0; t3 < e2.length; t3++)
              s2 = Math.max(s2, e2[t3].length);
            const r2 = e2.length;
            var h2, o2, n2;
            super(new D(0, 0, s2, r2), t2), n2 = void 0, (o2 = "lines") in (h2 = this) ? Object.defineProperty(h2, o2, { value: n2, enumerable: true, configurable: true, writable: true }) : h2[o2] = n2, this.lines = e2;
          }
          drawContents(t2, i2) {
            for (let e2 = 0; e2 < this.lines.length; e2++)
              t2.drawString(i2.x, i2.y + e2, this.lines[e2]);
          }
          handleInput(t2, i2) {
            return t2.isKeyPressed(x.VK_ESCAPE);
          }
        }
        function H(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class F extends p {
          constructor(t2, i2, e2) {
            let s2 = t2.length;
            for (let t3 = 0; t3 < i2.length; t3++)
              s2 = Math.max(s2, i2[t3].length + 4);
            const r2 = i2.length;
            super(new D(0, 0, s2, r2), t2), H(this, "options", void 0), H(this, "callback", void 0), H(this, "hoverIndex", void 0), this.options = i2, this.callback = e2, this.hoverIndex = -1;
          }
          drawContents(t2, i2) {
            for (let e2 = 0; e2 < this.options.length; e2++) {
              const s2 = String.fromCharCode(65 + e2) + " - " + this.options[e2];
              e2 === this.hoverIndex ? t2.drawString(i2.x, i2.y + e2, s2, d.BLACK, d.WHITE) : t2.drawString(i2.x, i2.y + e2, s2, d.WHITE, d.BLACK);
            }
          }
          handleInput(t2, i2) {
            if (this.hoverIndex = -1, t2.mouse.x >= i2.x && t2.mouse.x < i2.x + this.contentsRect.width && t2.mouse.y >= i2.y && t2.mouse.y < i2.y + this.contentsRect.height && (this.hoverIndex = t2.mouse.y - i2.y, t2.mouse.buttons[0].upCount === 1))
              return this.callback(this.hoverIndex), true;
            for (let i3 = 0; i3 < this.options.length; i3++)
              if (t2.isKeyPressed(x.VK_A + i3))
                return this.callback(i3), true;
            return t2.isKeyPressed(x.VK_ESCAPE);
          }
          isMouseOverOption(t2, i2, e2) {
            return t2.mouse.x >= i2.x && t2.mouse.x < i2.x + this.contentsRect.width && t2.mouse.y === i2.y + e2;
          }
        }
        const M = [{ charCode: E.BLOCK_TOP_HALF, active: [1, 1, 0, 0] }, { charCode: E.BLOCK_RIGHT_HALF, active: [0, 1, 0, 1] }];
        function G(t2, i2) {
          const e2 = new Image();
          e2.onload = () => {
            const t3 = e2.width, s2 = e2.height, r2 = Y(e2), h2 = new u(t3, s2);
            let o2 = 0;
            for (let i3 = 0; i3 < s2; i3++)
              for (let e3 = 0; e3 < t3; e3++) {
                h2.getCell(e3, i3).setBackground(_(r2[o2++], r2[o2++], r2[o2++], r2[o2++]));
              }
            i2(h2);
          }, e2.src = t2;
        }
        function X(t2, i2) {
          const e2 = new Image();
          e2.onload = () => {
            const t3 = e2.width, s2 = e2.height, r2 = Y(e2), h2 = new u(t3 / 2, s2 / 2);
            for (let i3 = 0; i3 < s2; i3 += 2)
              for (let e3 = 0; e3 < t3; e3 += 2)
                W(h2, r2, e3, i3, t3);
            i2(h2);
          }, e2.src = t2;
        }
        function Y(t2) {
          const i2 = document.createElement("canvas");
          i2.width = t2.width, i2.height = t2.height;
          const e2 = i2.getContext("2d");
          return e2.drawImage(t2, 0, 0), e2.getImageData(0, 0, t2.width, t2.height).data;
        }
        function W(t2, i2, e2, s2, r2) {
          const h2 = 4 * (s2 * r2 + e2), o2 = 4 * (s2 * r2 + e2 + 1), n2 = 4 * ((s2 + 1) * r2 + e2), _2 = 4 * ((s2 + 1) * r2 + e2 + 1), a2 = [[i2[h2], i2[h2 + 1], i2[h2 + 2]], [i2[o2], i2[o2 + 1], i2[o2 + 2]], [i2[n2], i2[n2 + 1], i2[n2 + 2]], [i2[_2], i2[_2 + 1], i2[_2 + 2]]];
          let d2 = Number.MAX_VALUE, A2 = 0, l2 = null, E2 = null;
          for (let t3 = 0; t3 < M.length; t3++) {
            const i3 = M[t3], e3 = k(i3.active, a2);
            e3.error < d2 && (d2 = e3.error, A2 = i3.charCode, l2 = e3.bg, E2 = e3.fg);
          }
          t2.drawChar(e2 / 2, s2 / 2, A2, Q(E2), Q(l2));
        }
        function k(t2, i2) {
          const e2 = [[0, 0, 0], [0, 0, 0]], s2 = [[0, 0, 0], [0, 0, 0]], r2 = [0, 0];
          for (let s3 = 0; s3 < 4; s3++) {
            for (let r3 = 0; r3 < 3; r3++)
              e2[t2[s3]][r3] += i2[s3][r3];
            r2[t2[s3]]++;
          }
          for (let t3 = 0; t3 < 2; t3++)
            for (let i3 = 0; i3 < 3; i3++)
              s2[t3][i3] = e2[t3][i3] / r2[t3];
          let h2 = 0;
          for (let e3 = 0; e3 < 4; e3++) {
            let r3 = 0;
            for (let h3 = 0; h3 < 3; h3++) {
              const o2 = i2[e3][h3] - s2[t2[e3]][h3];
              r3 += o2 * o2;
            }
            h2 += Math.sqrt(r3);
          }
          return { bg: s2[0], fg: s2[1], error: h2 };
        }
        function Q(t2) {
          return _(t2[0], t2[1], t2[2]);
        }
        function z(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class j {
          constructor(t2) {
            z(this, "el", void 0), z(this, "width", void 0), z(this, "height", void 0), z(this, "prevX", void 0), z(this, "prevY", void 0), z(this, "x", void 0), z(this, "y", void 0), z(this, "dx", void 0), z(this, "dy", void 0), z(this, "buttons", void 0), this.el = t2.canvas, this.width = t2.width, this.height = t2.height, this.prevX = 0, this.prevY = 0, this.x = 0, this.y = 0, this.dx = 0, this.dy = 0, this.buttons = [new w(), new w(), new w()];
            const i2 = this.el;
            i2.addEventListener("mousedown", (t3) => this.handleEvent(t3)), i2.addEventListener("mouseup", (t3) => this.handleEvent(t3)), i2.addEventListener("mousemove", (t3) => this.handleEvent(t3)), i2.addEventListener("contextmenu", (t3) => this.handleEvent(t3));
            const e2 = this.handleTouchEvent.bind(this);
            i2.addEventListener("touchstart", e2), i2.addEventListener("touchend", e2), i2.addEventListener("touchcancel", e2), i2.addEventListener("touchmove", e2);
          }
          handleTouchEvent(t2) {
            if (t2.stopPropagation(), t2.preventDefault(), t2.touches.length > 0) {
              const i2 = t2.touches[0];
              this.updatePosition(i2.clientX, i2.clientY), this.buttons[0].setDown(true);
            } else
              this.buttons[0].setDown(false);
          }
          handleEvent(t2) {
            t2.stopPropagation(), t2.preventDefault(), this.updatePosition(t2.clientX, t2.clientY), t2.type === "mousedown" && (this.buttons[t2.button].setDown(true), this.el.focus()), t2.type === "mouseup" && this.buttons[t2.button].setDown(false);
          }
          updatePosition(t2, i2) {
            let e2 = this.el.getBoundingClientRect();
            const s2 = this.width / this.height, r2 = e2.width / e2.height;
            if (r2 - s2 > 0.01) {
              const t3 = s2 * e2.height, i3 = e2.width - t3;
              e2 = new D(Math.floor(i3 / 2), 0, t3, e2.height);
            }
            if (r2 - s2 < -0.01) {
              const t3 = e2.width / s2, i3 = e2.height - t3;
              e2 = new D(0, Math.floor(i3 / 2), e2.width, t3);
            }
            this.x = this.width * (t2 - e2.left) / e2.width | 0, this.y = this.height * (i2 - e2.top) / e2.height | 0;
          }
          update(t2) {
            this.dx = this.x - this.prevX, this.dy = this.y - this.prevY, this.prevX = this.x, this.prevY = this.y;
            for (let i2 = 0; i2 < this.buttons.length; i2++)
              this.buttons[i2].update(t2);
          }
        }
        const Z = [-1, 0, 1, -1, 1, -1, 0, 1], J = [-1, -1, -1, 0, 0, 1, 1, 1], q = [1.4, 1, 1.4, 1, 1, 1.4, 1, 1.4];
        let $ = 0;
        function tt(t2, i2, e2, s2) {
          $++;
          const r2 = t2.grid[i2.y][i2.x];
          r2.pathId = $, r2.g = 0, r2.h = Math.hypot(i2.x - e2.x, i2.y - e2.y), r2.prev = null;
          const h2 = new et([r2]);
          for (; h2.size() > 0; ) {
            const i3 = h2.pop();
            if (i3.x === e2.x && i3.y === e2.y)
              return it(i3);
            for (let r3 = 0; r3 < Z.length; r3++) {
              const o2 = i3.x + Z[r3], n2 = i3.y + J[r3];
              if (o2 >= 0 && o2 < t2.width && n2 >= 0 && n2 < t2.height) {
                const _2 = t2.grid[n2][o2];
                if (_2.blocked && _2.explored && (o2 !== e2.x || n2 !== e2.y))
                  continue;
                _2.pathId !== $ && (_2.pathId = $, _2.g = 1 / 0, _2.h = Math.hypot(o2 - e2.x, n2 - e2.y), _2.prev = null);
                const a2 = i3.g + q[r3];
                a2 < _2.g && a2 <= s2 && (_2.g = a2, _2.prev = i3, h2.insert(_2));
              }
            }
          }
        }
        function it(t2) {
          const i2 = [];
          let e2 = t2;
          for (; e2; )
            i2.push(e2), e2 = e2.prev;
          return i2.reverse(), i2;
        }
        class et {
          constructor(t2) {
            var i2, e2, s2;
            s2 = void 0, (e2 = "values") in (i2 = this) ? Object.defineProperty(i2, e2, { value: s2, enumerable: true, configurable: true, writable: true }) : i2[e2] = s2, this.values = t2;
          }
          insert(t2) {
            const i2 = this.values;
            let e2 = 0, s2 = i2.length, r2 = 0;
            for (; e2 < s2; ) {
              const h2 = e2 + s2 >>> 1, o2 = i2[h2];
              o2.g + o2.h > t2.g + t2.h ? (e2 = h2 + 1, r2 = e2) : (s2 = h2, r2 = s2);
            }
            i2.splice(r2, 0, t2);
          }
          pop() {
            return this.values.pop();
          }
          size() {
            return this.values.length;
          }
        }
        function st(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        class rt {
          constructor(t2) {
            st(this, "m", void 0), st(this, "a", void 0), st(this, "c", void 0), st(this, "state", void 0), this.m = 2147483648, this.a = 1103515245, this.c = 12345, this.state = t2 || 1;
          }
          nextInt() {
            return this.state = (this.a * this.state + this.c) % this.m, this.state;
          }
          nextFloat() {
            return this.nextInt() / (this.m - 1);
          }
          nextRange(t2, i2) {
            const e2 = i2 - t2, s2 = t2 + (this.nextInt() / this.m * e2 | 0);
            if (isNaN(s2))
              throw new Error("rand nan");
            return s2;
          }
          chooseIndex(t2) {
            const i2 = t2.reduce((t3, i3) => t3 + i3), e2 = this.nextRange(1, i2 + 1);
            let s2 = 0;
            for (let i3 = 0; i3 < t2.length; i3++)
              if (s2 += t2[i3], e2 <= s2)
                return i3;
            return t2.length - 1;
          }
          chooseKey(t2) {
            const i2 = Object.keys(t2), e2 = i2.map((i3) => t2[i3]);
            return i2[this.chooseIndex(e2)];
          }
        }
        function ht(t2, i2, e2) {
          return i2 in t2 ? Object.defineProperty(t2, i2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[i2] = e2, t2;
        }
        function ot(t2, i2) {
          return t2 / i2 * 2 - 1;
        }
        const nt = { font: O };
        class _t extends u {
          constructor(t2, i2, e2, s2) {
            super(i2, e2), ht(this, "canvas", void 0), ht(this, "font", void 0), ht(this, "pixelWidth", void 0), ht(this, "pixelHeight", void 0), ht(this, "keys", void 0), ht(this, "mouse", void 0), ht(this, "gl", void 0), ht(this, "program", void 0), ht(this, "positionAttribLocation", void 0), ht(this, "textureAttribLocation", void 0), ht(this, "fgColorAttribLocation", void 0), ht(this, "bgColorAttribLocation", void 0), ht(this, "positionsArray", void 0), ht(this, "indexArray", void 0), ht(this, "textureArray", void 0), ht(this, "foregroundUint8Array", void 0), ht(this, "foregroundDataView", void 0), ht(this, "backgroundUint8Array", void 0), ht(this, "backgroundDataView", void 0), ht(this, "positionBuffer", void 0), ht(this, "indexBuffer", void 0), ht(this, "textureBuffer", void 0), ht(this, "foregroundBuffer", void 0), ht(this, "backgroundBuffer", void 0), ht(this, "texture", void 0), ht(this, "lastRenderTime", void 0), ht(this, "renderDelta", void 0), ht(this, "fps", void 0), ht(this, "averageFps", void 0), ht(this, "update", void 0), s2 = s2 || nt, this.canvas = t2, this.font = s2.font || O, this.pixelWidth = i2 * this.font.charWidth, this.pixelHeight = e2 * this.font.charHeight, t2.width = this.pixelWidth, t2.height = this.pixelHeight, t2.style.imageRendering = "pixelated", t2.style.outline = "none", t2.tabIndex = 0, this.handleResize(), window.addEventListener("resize", () => this.handleResize()), this.keys = new m(t2), this.mouse = new j(this);
            const r2 = t2.getContext("webgl", { antialias: false });
            if (!r2)
              throw new Error("Unable to initialize WebGL. Your browser may not support it.");
            const h2 = r2.createProgram();
            if (!h2)
              throw new Error("Unable to initialize WebGL. Your browser may not support it.");
            this.gl = r2, this.program = h2, r2.attachShader(h2, this.buildShader(r2.VERTEX_SHADER, "attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}")), r2.attachShader(h2, this.buildShader(r2.FRAGMENT_SHADER, "varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform bool h;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(h){if(gl_FragColor.a<0.1){gl_FragColor=texture2D(s,g.rg*16.0+fract(e*16.0)/16.0);}}else{if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}}")), r2.linkProgram(h2), r2.useProgram(h2), this.font.graphical && r2.uniform1i(r2.getUniformLocation(h2, "h"), 1), this.positionAttribLocation = this.getAttribLocation("a"), this.textureAttribLocation = this.getAttribLocation("b"), this.fgColorAttribLocation = this.getAttribLocation("c"), this.bgColorAttribLocation = this.getAttribLocation("d");
            const o2 = i2 * e2;
            this.positionsArray = new Float32Array(3 * o2 * 4), this.indexArray = new Uint16Array(6 * o2), this.textureArray = new Float32Array(2 * o2 * 4), this.foregroundUint8Array = new Uint8Array(4 * o2 * 4), this.foregroundDataView = new DataView(this.foregroundUint8Array.buffer), this.backgroundUint8Array = new Uint8Array(4 * o2 * 4), this.backgroundDataView = new DataView(this.backgroundUint8Array.buffer);
            let n2 = 0, _2 = 0, a2 = 0;
            for (let t3 = 0; t3 < e2; t3++)
              for (let s3 = 0; s3 < i2; s3++)
                this.positionsArray[n2++] = ot(s3, i2), this.positionsArray[n2++] = -ot(t3, e2), this.positionsArray[n2++] = ot(s3 + 1, i2), this.positionsArray[n2++] = -ot(t3, e2), this.positionsArray[n2++] = ot(s3 + 1, i2), this.positionsArray[n2++] = -ot(t3 + 1, e2), this.positionsArray[n2++] = ot(s3, i2), this.positionsArray[n2++] = -ot(t3 + 1, e2), this.indexArray[_2++] = a2 + 0, this.indexArray[_2++] = a2 + 1, this.indexArray[_2++] = a2 + 2, this.indexArray[_2++] = a2 + 0, this.indexArray[_2++] = a2 + 2, this.indexArray[_2++] = a2 + 3, a2 += 4;
            this.positionBuffer = r2.createBuffer(), this.indexBuffer = r2.createBuffer(), this.textureBuffer = r2.createBuffer(), this.foregroundBuffer = r2.createBuffer(), this.backgroundBuffer = r2.createBuffer(), r2.bindBuffer(r2.ARRAY_BUFFER, this.positionBuffer), r2.bufferData(r2.ARRAY_BUFFER, this.positionsArray, r2.STATIC_DRAW), r2.bindBuffer(r2.ELEMENT_ARRAY_BUFFER, this.indexBuffer), r2.bufferData(r2.ELEMENT_ARRAY_BUFFER, this.indexArray, r2.STATIC_DRAW), this.texture = this.loadTexture(this.font.url), this.lastRenderTime = 0, this.renderDelta = 0, this.fps = 0, this.averageFps = 0, this.requestAnimationFrame();
          }
          handleResize() {
            const t2 = this.canvas.parentElement;
            if (!t2)
              return;
            const i2 = t2.offsetWidth / this.pixelWidth, e2 = t2.offsetHeight / this.pixelHeight, s2 = Math.min(i2, e2), r2 = s2 * this.pixelWidth | 0, h2 = s2 * this.pixelHeight | 0;
            this.canvas.style.width = r2 + "px", this.canvas.style.height = h2 + "px";
          }
          getAttribLocation(t2) {
            const i2 = this.gl.getAttribLocation(this.program, t2);
            return this.gl.enableVertexAttribArray(i2), i2;
          }
          flush() {
            let t2 = 0, i2 = 0;
            for (let e2 = 0; e2 < this.height; e2++)
              for (let s2 = 0; s2 < this.width; s2++) {
                const r2 = this.getCell(s2, e2);
                if (!r2.dirty) {
                  t2 += 8, i2 += 16;
                  continue;
                }
                const h2 = r2.charCode % 16, o2 = r2.charCode / 16 | 0;
                this.textureArray[t2++] = h2, this.textureArray[t2++] = o2, this.textureArray[t2++] = h2 + 1, this.textureArray[t2++] = o2, this.textureArray[t2++] = h2 + 1, this.textureArray[t2++] = o2 + 1, this.textureArray[t2++] = h2, this.textureArray[t2++] = o2 + 1;
                for (let t3 = 0; t3 < 4; t3++)
                  this.foregroundDataView.setUint32(i2, r2.fg, false), this.backgroundDataView.setUint32(i2, r2.bg, false), i2 += 4;
                r2.dirty = false;
              }
          }
          isKeyDown(t2) {
            const i2 = this.keys.getKey(t2);
            return !!i2 && i2.down;
          }
          isKeyPressed(t2) {
            const i2 = this.keys.getKey(t2);
            return !!i2 && i2.isPressed();
          }
          getKeyDownCount(t2) {
            const i2 = this.keys.getKey(t2);
            return i2 ? i2.downCount : 0;
          }
          getMovementKey() {
            return this.isKeyPressed(x.VK_NUMPAD1) || this.isKeyPressed(x.VK_B) ? new f(-1, 1) : this.isKeyPressed(x.VK_NUMPAD2) || this.isKeyPressed(x.VK_J) || this.isKeyPressed(x.VK_DOWN) ? new f(0, 1) : this.isKeyPressed(x.VK_NUMPAD3) || this.isKeyPressed(x.VK_N) ? new f(1, 1) : this.isKeyPressed(x.VK_NUMPAD4) || this.isKeyPressed(x.VK_H) || this.isKeyPressed(x.VK_LEFT) ? new f(-1, 0) : this.isKeyPressed(x.VK_NUMPAD5) || this.isKeyPressed(x.VK_PERIOD) ? new f(0, 0) : this.isKeyPressed(x.VK_NUMPAD6) || this.isKeyPressed(x.VK_L) || this.isKeyPressed(x.VK_RIGHT) ? new f(1, 0) : this.isKeyPressed(x.VK_NUMPAD7) || this.isKeyPressed(x.VK_Y) ? new f(-1, -1) : this.isKeyPressed(x.VK_NUMPAD8) || this.isKeyPressed(x.VK_K) || this.isKeyPressed(x.VK_UP) ? new f(0, -1) : this.isKeyPressed(x.VK_NUMPAD9) || this.isKeyPressed(x.VK_U) ? new f(1, -1) : void 0;
          }
          buildShader(t2, i2) {
            const e2 = this.gl, s2 = e2.createShader(t2);
            if (!s2)
              throw new Error("An error occurred compiling the shader: ");
            if (e2.shaderSource(s2, i2), e2.compileShader(s2), !e2.getShaderParameter(s2, e2.COMPILE_STATUS))
              throw new Error("An error occurred compiling the shader: " + e2.getShaderInfoLog(s2));
            return s2;
          }
          loadTexture(t2) {
            const i2 = this.gl, e2 = i2.createTexture();
            i2.bindTexture(i2.TEXTURE_2D, e2);
            const s2 = i2.RGBA, r2 = i2.RGBA, h2 = i2.UNSIGNED_BYTE, o2 = new Uint8Array([0, 0, 0, 255]);
            i2.texImage2D(i2.TEXTURE_2D, 0, s2, 1, 1, 0, r2, h2, o2);
            const n2 = new Image();
            return n2.onload = () => {
              i2.bindTexture(i2.TEXTURE_2D, e2), i2.texImage2D(i2.TEXTURE_2D, 0, s2, r2, h2, n2), i2.texParameteri(i2.TEXTURE_2D, i2.TEXTURE_WRAP_S, i2.CLAMP_TO_EDGE), i2.texParameteri(i2.TEXTURE_2D, i2.TEXTURE_WRAP_T, i2.CLAMP_TO_EDGE), i2.texParameteri(i2.TEXTURE_2D, i2.TEXTURE_MAG_FILTER, i2.LINEAR), i2.texParameteri(i2.TEXTURE_2D, i2.TEXTURE_MIN_FILTER, i2.LINEAR);
            }, n2.src = t2, e2;
          }
          render() {
            const t2 = this.gl;
            t2.clearColor(0, 0, 0, 1), t2.clearDepth(1), t2.clear(t2.COLOR_BUFFER_BIT | t2.DEPTH_BUFFER_BIT), t2.viewport(0, 0, this.pixelWidth, this.pixelHeight);
            {
              const i2 = 2, e2 = t2.FLOAT, s2 = false, r2 = 0, h2 = 0;
              t2.bindBuffer(t2.ARRAY_BUFFER, this.positionBuffer), t2.vertexAttribPointer(this.positionAttribLocation, i2, e2, s2, r2, h2);
            }
            {
              const i2 = 2, e2 = t2.FLOAT, s2 = false, r2 = 0, h2 = 0;
              t2.bindBuffer(t2.ARRAY_BUFFER, this.textureBuffer), t2.bufferData(t2.ARRAY_BUFFER, this.textureArray, t2.DYNAMIC_DRAW), t2.vertexAttribPointer(this.textureAttribLocation, i2, e2, s2, r2, h2);
            }
            {
              const i2 = 4, e2 = t2.UNSIGNED_BYTE, s2 = true, r2 = 0, h2 = 0;
              t2.bindBuffer(t2.ARRAY_BUFFER, this.foregroundBuffer), t2.bufferData(t2.ARRAY_BUFFER, this.foregroundUint8Array, t2.DYNAMIC_DRAW), t2.vertexAttribPointer(this.fgColorAttribLocation, i2, e2, s2, r2, h2);
            }
            {
              const i2 = 4, e2 = t2.UNSIGNED_BYTE, s2 = true, r2 = 0, h2 = 0;
              t2.bindBuffer(t2.ARRAY_BUFFER, this.backgroundBuffer), t2.bufferData(t2.ARRAY_BUFFER, this.backgroundUint8Array, t2.DYNAMIC_DRAW), t2.vertexAttribPointer(this.bgColorAttribLocation, i2, e2, s2, r2, h2);
            }
            t2.bindBuffer(t2.ELEMENT_ARRAY_BUFFER, this.indexBuffer), t2.useProgram(this.program), t2.activeTexture(t2.TEXTURE0), t2.bindTexture(t2.TEXTURE_2D, this.texture);
            {
              const i2 = this.width * this.height * 6, e2 = t2.UNSIGNED_SHORT, s2 = 0;
              t2.drawElements(t2.TRIANGLES, i2, e2, s2);
            }
          }
          requestAnimationFrame() {
            window.requestAnimationFrame((t2) => this.renderLoop(t2));
          }
          renderLoop(t2) {
            this.lastRenderTime === 0 ? (this.lastRenderTime = t2, this.fps = 0) : (this.renderDelta = t2 - this.lastRenderTime, this.lastRenderTime = t2, this.fps = 1e3 / this.renderDelta, this.averageFps = 0.95 * this.averageFps + 0.05 * this.fps), this.keys.updateKeys(t2), this.mouse.update(t2), this.update && this.update(), this.flush(), this.render(), this.requestAnimationFrame();
          }
        }
        return i;
      })());
    }
  });

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

  // src/Game.ts
  var import_wglt = __toESM(require_wglt());

  // src/RLKeyEvent.ts
  var RLKeyEvent = class {
    constructor(key) {
      this.key = key;
      this.type = "KeyEvent";
    }
  };
  RLKeyEvent.type = "KeyEvent";

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
  var keyEvents = /* @__PURE__ */ new Map([
    [import_wglt.Keys.VK_UP, "up"],
    [import_wglt.Keys.VK_RIGHT, "right"],
    [import_wglt.Keys.VK_DOWN, "down"],
    [import_wglt.Keys.VK_LEFT, "left"],
    [import_wglt.Keys.VK_HOME, "up-left"],
    [import_wglt.Keys.VK_END, "down-left"],
    [import_wglt.Keys.VK_PAGE_UP, "up-right"],
    [import_wglt.Keys.VK_PAGE_DOWN, "down-right"],
    [import_wglt.Keys.VK_CLEAR, "wait"],
    [import_wglt.Keys.VK_NUMPAD8, "up"],
    [import_wglt.Keys.VK_NUMPAD6, "right"],
    [import_wglt.Keys.VK_NUMPAD2, "down"],
    [import_wglt.Keys.VK_NUMPAD4, "left"],
    [import_wglt.Keys.VK_NUMPAD7, "up-left"],
    [import_wglt.Keys.VK_NUMPAD1, "down-left"],
    [import_wglt.Keys.VK_NUMPAD9, "up-right"],
    [import_wglt.Keys.VK_NUMPAD3, "down-right"],
    [import_wglt.Keys.VK_NUMPAD5, "wait"],
    [import_wglt.Keys.VK_K, "up"],
    [import_wglt.Keys.VK_L, "right"],
    [import_wglt.Keys.VK_J, "down"],
    [import_wglt.Keys.VK_H, "left"],
    [import_wglt.Keys.VK_Y, "up-left"],
    [import_wglt.Keys.VK_B, "down-left"],
    [import_wglt.Keys.VK_U, "up-right"],
    [import_wglt.Keys.VK_N, "down-right"],
    [import_wglt.Keys.VK_PERIOD, "wait"]
  ]);
  var Game = class {
    constructor(rl, canvas) {
      this.rl = rl;
      this.canvas = canvas;
      Game.instance = this;
      window.G = this;
      this.width = 80;
      this.height = 50;
      this.running = false;
    }
    init() {
      return __async(this, null, function* () {
        this.rl.callNamedFunction("main");
        this.terminal = new import_wglt.Terminal(this.canvas, this.width, this.height);
        let count = 0;
        this.running = true;
        while (this.running) {
          let fired = false;
          for (const sys of this.rl.systems.filter((s) => s.enabled)) {
            if (this.trySystem(sys))
              fired = true;
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
              console.warn("Suspected infinite loop.");
            }
          }
        }
      });
    }
    trySystem(sys, ...args) {
      for (const e of sys.externals) {
        if (typeof e.default !== "undefined")
          continue;
        const a = args.find((a2) => a2.type === "named" && a2.name === e.name || a2.type === "typed" && isAssignableTo(a2.value, a2.typeName));
        if (!a)
          return;
      }
      if (sys.params.length === 0) {
        const result = this.rl.runSystem(sys, ...args);
        return result !== false;
      }
      const matches = sys.query.get();
      if (matches.length) {
        for (const e of matches)
          this.rl.runSystem(sys, { type: "typed", typeName: "entity", value: e }, ...args);
        return true;
      }
      return false;
    }
    getKey() {
      return __async(this, null, function* () {
        return new Promise((resolve) => {
          const handler = () => {
            for (const [key, name] of keyEvents) {
              if (this.terminal.isKeyPressed(key))
                return resolve(new RLKeyEvent(name));
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
      return Array.from(this.parent.entities.values()).filter((e) => this.match(e));
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
      this.systems = Array.from(this.env.values()).filter((o) => o.type === "system");
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

  // src/MessageLog.ts
  var Message = class {
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
  };
  var MessageLog = class {
    constructor(messages = []) {
      this.messages = messages;
      this.dirty = false;
    }
    add(text, fg = "white", stack = true) {
      const top = this.messages.at(-1);
      if (stack && (top == null ? void 0 : top.text) === text)
        top.count++;
      else
        this.messages.push(new Message(text, fg));
      this.dirty = true;
    }
    render(term, x, y, width, height) {
      let offset = height - 1;
      term.fillRect(x, y, width, height, " ");
      for (const msg of this.messages.slice(-height).reverse()) {
        const text = msg.fullText;
        const fg = new TinyColor(msg.fg).toNumber() << 8;
        term.drawString(x, y + offset--, text, fg);
      }
      this.dirty = false;
    }
  };

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
    const set = (i, value) => {
      if (filled.has(i))
        throw new Error(`Param #${i} set twice`);
      if (i >= results.length) {
        if (variadic.length === 0)
          throw new Error(`Function only has ${results.length} params`);
        if (!isAssignableToAny(value, variadic))
          throw new Error(`Function variadic type is '${variadic.join("|")}', got ${value.type}`);
      } else if (!isAssignableTo(value, params[i].typeName))
        throw new Error(`Param #${i} expects type '${params[i].typeName}', got ${value.type}`);
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
          set(i, a.value);
          break;
        }
        case "named": {
          const [i, p] = get((p2) => p2.name === a.name);
          if (!p)
            throw new Error(`No param with name ${a.name}`);
          set(i, a.value);
          break;
        }
        case "positional": {
          set(pos, a.value);
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
  };
  RLGrid.type = "grid";

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
      "IsBlocker",
      "IsPlayer",
      "RecalculateFOV",
      "RedrawMe",
      "RedrawUI",
      "MyTurn",
      "BaseAI",
      "HostileEnemy",
      "WaitAction"
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

  // src/RLTile.ts
  var RLTile = class {
    constructor(ch, walkable, transparent) {
      this.ch = ch;
      this.walkable = walkable;
      this.transparent = transparent;
      this.type = "tile";
    }
  };
  RLTile.type = "tile";

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

  // src/impl.ts
  function implementation(__lib) {
    let Layer;
    ((Layer2) => {
      Layer2[Layer2["Nothing"] = 0] = "Nothing";
      Layer2[Layer2["Corpse"] = 1] = "Corpse";
      Layer2[Layer2["Enemy"] = 2] = "Enemy";
      Layer2[Layer2["Player"] = 3] = "Player";
    })(Layer || (Layer = {}));
    const IsBlocker = new RLTag("IsBlocker");
    const IsPlayer = new RLTag("IsPlayer");
    const RecalculateFOV = new RLTag("RecalculateFOV");
    const RedrawMe = new RLTag("RedrawMe");
    const RedrawUI = new RLTag("RedrawUI");
    const MyTurn = new RLTag("MyTurn");
    const BaseAI = new RLTag("BaseAI");
    const HostileEnemy = new RLTag("HostileEnemy");
    const WaitAction = new RLTag("WaitAction");
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
    const mkFighter = (maxHp, hp, defence, power) => ({
      type: "component",
      typeName: "Fighter",
      maxHp,
      hp,
      defence,
      power
    });
    const tmPlayer = {
      type: "template",
      name: "Player",
      get: () => [
        IsBlocker,
        IsPlayer,
        mkAppearance("player", "@", "white", "black", 3 /* Player */),
        mkFighter(30, 30, 2, 5),
        mkActor(100),
        MyTurn,
        RecalculateFOV,
        RedrawUI
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
        mkAppearance("orc", "o", "green", "black", 2 /* Enemy */),
        mkFighter(10, 10, 0, 3)
      ]
    };
    const tmTroll = {
      type: "template",
      name: "Troll",
      get: () => [
        tmEnemy,
        mkAppearance("troll", "T", "lime", "black", 2 /* Enemy */),
        mkFighter(16, 16, 1, 4)
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
    const Floor = new RLTile(".", true, true);
    const Wall = new RLTile("#", false, false);
    const gameWidth = 80;
    const gameHeight = 50;
    const mapWidth = gameWidth;
    const mapHeight = gameHeight - 4;
    const hpX = 0;
    const hpY = mapHeight;
    const hpWidth = 20;
    const logX = hpWidth + 2;
    const logY = hpY;
    const map = new RLGrid(mapWidth, mapHeight, Wall);
    const explored = new RLGrid(mapWidth, mapHeight, false);
    const visible = new RLGrid(mapWidth, mapHeight, false);
    const log = new MessageLog();
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
    function hurt(e, damage) {
      e.Fighter.hp -= damage;
      if (e.Fighter.hp < 1) {
        const colour = ((__match) => {
          if (__match.has(IsPlayer.typeName))
            return "red";
          else
            return "orange";
        })(e);
        if (e.IsPlayer) {
          log.add("You died!", colour);
        } else {
          log.add(__lib.join({ type: "char", value: " " }, { type: "str", value: e.Appearance.name }, { type: "str", value: "is dead!" }), colour);
        }
        const corpse = __lib.spawn(tmCorpse, mkPosition(e.Position.x, e.Position.y));
        corpse.Appearance.name = __lib.join({ type: "char", value: " " }, { type: "str", value: "corpse of" }, { type: "str", value: e.Appearance.name });
        if (e.IsPlayer) {
          e.add(RedrawUI);
          e.remove("Actor");
          hostileAI.disable();
          __lib.pushKeyHandler(onKeyWhenDead);
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
      { type: "param", name: "damage", typeName: "int" }
    ]);
    function useTurn(e) {
      e.Actor.energy -= 100;
      e.remove(MyTurn);
    }
    const fn_useTurn = new RLFn("useTurn", useTurn, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function drawTileAt(x, y) {
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
      __lib.draw({ type: "int", value: x }, { type: "int", value: y }, { type: "char", value: ch }, { type: "str", value: fg }, { type: "str", value: bg });
    }
    const fn_drawTileAt = new RLFn("drawTileAt", drawTileAt, [
      { type: "param", name: "x", typeName: "int" },
      { type: "param", name: "y", typeName: "int" }
    ]);
    function drawEntity(e) {
      if (e.Position && e.Appearance && visible.at(e.Position.x, e.Position.y)) {
        __lib.draw({ type: "int", value: e.Position.x }, { type: "int", value: e.Position.y }, { type: "char", value: e.Appearance.ch }, { type: "str", value: e.Appearance.fg }, { type: "str", value: e.Appearance.bg });
      }
    }
    const fn_drawEntity = new RLFn("drawEntity", drawEntity, [
      { type: "param", name: "e", typeName: "entity" }
    ]);
    function drawBar(x, y, value, maxValue, maxWidth, emptyColour, filledColour) {
      const barWidth = __lib.floor({
        type: "int",
        value: value / maxValue * maxWidth
      });
      __lib.draw({ type: "int", value: x }, { type: "int", value: y }, {
        type: "str",
        value: __lib.repeat({ type: "char", value: " " }, { type: "int", value: maxWidth })
      }, { type: "str", value: "white" }, { type: "str", value: emptyColour });
      if (barWidth > 0) {
        __lib.draw({ type: "int", value: x }, { type: "int", value: y }, {
          type: "str",
          value: __lib.repeat({ type: "char", value: " " }, { type: "int", value: barWidth })
        }, { type: "str", value: "white" }, { type: "str", value: filledColour });
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
    function randomRoom() {
      const w = __lib.randInt({ type: "int", value: 6 }, { type: "int", value: 14 });
      const h = __lib.randInt({ type: "int", value: 6 }, { type: "int", value: 14 });
      const x = __lib.randInt({ type: "int", value: 1 }, { type: "int", value: mapWidth - w - 1 });
      const y = __lib.randInt({ type: "int", value: 1 }, { type: "int", value: mapHeight - h - 1 });
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
      map.clear();
      explored.clear();
      visible.clear();
      let prev;
      let room;
      const taken = new RLGrid(mapWidth, mapHeight, false);
      for (let r = 1; r <= 30; r++) {
        room = randomRoom();
        if (!map.findInRegion(room, Floor)) {
          map.rect(room.x + 1, room.y + 1, room.x2 - 1, room.y2 - 1, Floor);
          if (prev) {
            randomCorridor(prev.cx, prev.cy, room.cx, room.cy);
            addEnemies(room, taken);
          } else {
            __lib.spawn(tmPlayer, mkPosition(room.cx, room.cy));
          }
          prev = room;
        }
      }
      hostileAI.enable();
      log.add("Welcome to the RLscript dungeon!", "skyblue");
    }
    const fn_generateDungeon = new RLFn("generateDungeon", generateDungeon, []);
    function addEnemies(r, taken) {
      for (let z = 1; z <= __lib.randInt({ type: "int", value: 0 }, { type: "int", value: 2 }); z++) {
        const x = __lib.randInt({ type: "int", value: r.x + 1 }, { type: "int", value: r.x2 - 1 });
        const y = __lib.randInt({ type: "int", value: r.y + 1 }, { type: "int", value: r.y2 - 1 });
        if (!taken.at(x, y)) {
          taken.put(x, y, true);
          if (__lib.randInt({ type: "int", value: 1 }, { type: "int", value: 100 }) < 80) {
            __lib.spawn(tmOrc, mkPosition(x, y));
          } else {
            __lib.spawn(tmTroll, mkPosition(x, y));
          }
        }
      }
    }
    const fn_addEnemies = new RLFn("addEnemies", addEnemies, [
      { type: "param", name: "r", typeName: "rect" },
      { type: "param", name: "taken", typeName: "grid" }
    ]);
    function main() {
      __lib.setSize({ type: "int", value: gameWidth }, { type: "int", value: gameHeight });
      generateDungeon();
      __lib.pushKeyHandler(onKeyInDungeon);
    }
    const fn_main = new RLFn("main", main, []);
    function code_onKeyInDungeon(e, k) {
      e.add(((__match) => {
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
      })(k.key));
    }
    const onKeyInDungeon = new RLSystem("onKeyInDungeon", code_onKeyInDungeon, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "param", name: "k", typeName: "KeyEvent" }
    ]);
    function code_onKeyWhenDead(e, k) {
    }
    const onKeyWhenDead = new RLSystem("onKeyWhenDead", code_onKeyWhenDead, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "constraint", typeName: "IsPlayer" },
      { type: "param", name: "k", typeName: "KeyEvent" }
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
          const distance = __lib.abs({ type: "int", value: dx }) + __lib.abs({ type: "int", value: dy });
          if (distance < 2) {
            e.add(mkMeleeAction(target));
            return;
          }
          const step = __lib.getNextMove(map, getBlockingMap(), new RLXY(p.x, p.y), new RLXY(tp.x, tp.y));
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
        if (b && b.has("Fighter")) {
          e.add(mkMeleeAction(b));
          return;
        }
        useTurn(e);
        e.add(mkOldPosition(p.x, p.y));
        p.x = x;
        p.y = y;
        if (e.IsPlayer) {
          e.add(RecalculateFOV);
        }
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
      const attack = __lib.join({ type: "char", value: " " }, { type: "str", value: a.name }, { type: "str", value: "attacks" }, { type: "str", value: target.Appearance.name });
      const damage = f.power - target.Fighter.defence;
      const colour = ((__match) => {
        if (__match.has(IsPlayer.typeName))
          return "white";
        else
          return "red";
      })(e);
      if (damage > 0) {
        log.add(__lib.join({ type: "char", value: " " }, { type: "str", value: attack }, { type: "str", value: "for" }, { type: "int", value: damage }, { type: "str", value: "hit points" }), colour);
        hurt(target, damage);
      } else {
        log.add(__lib.join({ type: "char", value: " " }, { type: "str", value: attack }, { type: "str", value: "but does no damage" }), colour);
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
    function code_fov(e, p) {
      __lib.getFOV(map, { type: "int", value: p.x }, { type: "int", value: p.y }, { type: "int", value: 5 }, visible, explored);
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
    function code_drawUI(e, f) {
      e.remove(RedrawUI);
      drawBar(hpX, hpY, f.hp, f.maxHp, hpWidth, "red", "green");
      __lib.draw({ type: "int", value: hpX + 1 }, { type: "int", value: hpY }, {
        type: "str",
        value: __lib.join({ type: "str", value: "" }, { type: "str", value: "HP: " }, { type: "int", value: f.hp }, { type: "str", value: "/" }, { type: "int", value: f.maxHp })
      });
    }
    const drawUI = new RLSystem("drawUI", code_drawUI, [
      { type: "param", name: "e", typeName: "entity" },
      { type: "param", name: "f", typeName: "Fighter" },
      { type: "constraint", typeName: "RedrawUI" }
    ]);
    function code_nextTurn() {
      let highest = -99999;
      for (const _entity of new RLQuery(RL.instance, ["Actor"]).get()) {
        const { Actor: a } = _entity;
        if (a.energy > highest) {
          highest = a.energy;
        }
      }
      if (highest >= 100) {
        return false;
      }
      const elapse = 100 - highest;
      for (const e of new RLQuery(RL.instance, ["Actor"]).get()) {
        const { Actor: a } = e;
        a.energy += elapse;
        if (a.energy >= 100) {
          e.add(MyTurn);
        }
      }
    }
    const nextTurn = new RLSystem("nextTurn", code_nextTurn, []);
    function code_showLog() {
      if (log.dirty) {
        __lib.drawLog(log, { type: "int", value: logX }, { type: "int", value: logY }, { type: "int", value: gameWidth - logX }, { type: "int", value: gameHeight - logY });
      } else {
        return false;
      }
    }
    const showLog = new RLSystem("showLog", code_showLog, []);
    return /* @__PURE__ */ new Map([
      ["getBlockingMap", fn_getBlockingMap],
      ["hurt", fn_hurt],
      ["useTurn", fn_useTurn],
      ["drawTileAt", fn_drawTileAt],
      ["drawEntity", fn_drawEntity],
      ["drawBar", fn_drawBar],
      ["randomRoom", fn_randomRoom],
      ["randomCorridor", fn_randomCorridor],
      ["generateDungeon", fn_generateDungeon],
      ["addEnemies", fn_addEnemies],
      ["main", fn_main],
      ["onKeyInDungeon", onKeyInDungeon],
      ["onKeyWhenDead", onKeyWhenDead],
      ["hostileAI", hostileAI],
      ["doMove", doMove],
      ["doMelee", doMelee],
      ["doWait", doWait],
      ["fov", fov],
      ["drawUnderTile", drawUnderTile],
      ["RedrawMeEntity", RedrawMeEntity],
      ["drawUI", drawUI],
      ["nextTurn", nextTurn],
      ["showLog", showLog],
      ["IsBlocker", IsBlocker],
      ["IsPlayer", IsPlayer],
      ["RecalculateFOV", RecalculateFOV],
      ["RedrawMe", RedrawMe],
      ["RedrawUI", RedrawUI],
      ["MyTurn", MyTurn],
      ["BaseAI", BaseAI],
      ["HostileEnemy", HostileEnemy],
      ["WaitAction", WaitAction],
      ["Player", tmPlayer],
      ["Enemy", tmEnemy],
      ["Orc", tmOrc],
      ["Troll", tmTroll],
      ["Corpse", tmCorpse]
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
              CastLight(grid, gridPosn, viewRadius, currentCol + 1, leftViewSlope, leftBlockSlope, txfrm);
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
  var RLEntity = class {
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
      this.BaseAI = false;
      this.HostileEnemy = false;
      this.WaitAction = false;
    }
    toString() {
      return `#${this.id} (${Array.from(this.templates.values()).join(" ")})`;
    }
    get [Symbol.toStringTag]() {
      return `Entity#${this.toString()})`;
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
  };
  RLEntity.type = "entity";

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
  function draw({ value: x }, { value: y }, display, fg, bg) {
    const f = fg ? new TinyColor(fg.value).toNumber() << 8 : void 0;
    const b = bg ? new TinyColor(bg.value).toNumber() << 8 : void 0;
    if (display.type === "char")
      Game.instance.terminal.drawChar(x, y, display.value, f, b);
    else
      Game.instance.terminal.drawString(x, y, display.value, f, b);
  }
  function drawGrid(g) {
    for (let y = 0; y < g.height; y++) {
      for (let x = 0; x < g.width; x++) {
        const t = g.at(x, y);
        if (t)
          draw({ type: "int", value: x }, { type: "int", value: y }, { type: "char", value: t.ch }, { type: "str", value: "silver" });
      }
    }
  }
  function randInt({ value: min }, { value: max }) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
  function getFOV(tiles, { value: x }, { value: y }, { value: radius }, visible, explored) {
    visible.fill(visible.empty);
    const grid = new ShadowCastingGrid(tiles.width, tiles.height, (x2, y2) => {
      var _a;
      return !((_a = tiles.at(x2, y2)) == null ? void 0 : _a.transparent);
    });
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
  function debug({ value: message }) {
    console.log(message);
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
  function drawLog(log, { value: x }, { value: y }, { value: width }, { value: height }) {
    log.render(Game.instance.terminal, x, y, width, height);
  }
  var lib = {
    abs,
    add,
    debug,
    draw,
    drawLog,
    drawGrid,
    find,
    floor,
    getFOV,
    getNextMove,
    join,
    pushKeyHandler,
    randInt,
    remove,
    repeat,
    setSize,
    spawn
  };
  var lib_default = lib;

  // src/index.ts
  window.addEventListener("load", () => {
    const main = document.getElementById("main");
    if (!main || main.tagName !== "CANVAS")
      throw new Error("Canvas #main not found.");
    const g = new Game(new RL(lib_default, implementation(lib_default)), main);
    void g.init();
  });
})();
//# sourceMappingURL=build.js.map
