var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  Arr: () => Arr_default,
  Bol: () => Bol_default,
  Complex: () => Complex2,
  Date: () => Date_default,
  Err: () => Err_default,
  Fce: () => Fce_default,
  Map: () => Map_default,
  NaN: () => NaN_default,
  Num: () => Num_default,
  Obj: () => Bol_default,
  Prom: () => Prom_default,
  RegExp: () => RegExp_default,
  Set: () => Set_default,
  Str: () => Str_default,
  Symbol: () => Symbol_default,
  default: () => src_default,
  type: () => type
});
module.exports = __toCommonJS(src_exports);

// src/Complex.js
function define(o, d, writable) {
  if (!d) {
    return;
  }
  for (let i in d) {
    if (o[i]) {
      continue;
    }
    Object.defineProperty(o, i, { value: d[i], writable, enumerable: true });
  }
}
var Complex = class extends Function {
  constructor(fce, fix, temp) {
    super();
    const self = fce ? fce.bind() : this;
    define(self, fix, false);
    define(self, temp, true);
    return Object.setPrototypeOf(self, new.target.prototype);
  }
};
var Complex_default = Complex;

// src/jet.js
var jet = {};
var magicMethod = ["only", "full", "tap", "pull", "is", "to", "copy", "rnd"];
var types = {};
var primitives = {};
function _isInstance(any) {
  const t = typeof any;
  return any != null && (t === "function" || t === "object");
}
function _isInstanceOf(constructor, any) {
  return any instanceof constructor;
}
function _isFull(any, vals) {
  if (!vals) {
    return any === false || any === 0 || !!any;
  }
  for (let v of vals(any)) {
    if (v != null) {
      return true;
    }
  }
  return false;
}
function _id(primitive, any, all, withDefinition) {
  const td = typeof any, r = all ? [] : void 0;
  const list = primitives[primitive || td];
  if (list) {
    for (let t of list) {
      if (!t.is(any, td)) {
        continue;
      }
      let n = withDefinition ? t : t.name;
      if (r) {
        r.push(n);
      } else {
        return n;
      }
    }
  }
  if (withDefinition) {
    return r;
  } else if (!r) {
    return td;
  } else {
    r.push(td);
    return r;
  }
}
function _is(name, any, inclusive) {
  const t = types[name];
  if (t) {
    return inclusive ? _id(t.primitive, any, true).includes(name) : name === _id(t.primitive, any);
  }
  return _isInstance(name) ? _isInstanceOf(name, any) : false;
}
function _factory(name, mm, ...args) {
  const n = _isInstance(name);
  const t = types[name];
  if (n && mm > 0) {
    console.warn("Unable execute '" + magicMethod[mm] + "' - unavailable for constructors");
    return;
  }
  if (name && !n && !t) {
    console.warn("Unable execute '" + magicMethod[mm] + "' - unknown type '" + name + "'");
    return;
  }
  if (!name && mm !== 1) {
    console.warn("Unable execute '" + magicMethod[mm] + "' - missing type");
    return;
  }
  for (let a of args) {
    if (!n) {
      const at = _id(t ? t.primitive : null, a, false, true);
      if ((!name || at && at.name === name) && (mm !== 1 || (at && at.full(a) || !at && _isFull(a)))) {
        return mm === 3 ? at.copy(a) : a;
      }
    } else if (_isInstanceOf(name, a)) {
      return a;
    }
  }
  if (mm > 1) {
    return t.create();
  }
}
function _copy(any, ...args) {
  const t = _id(null, any, false, true);
  if (!t) {
    console.warn("Unable execute 'copy' unknown type '" + t.name + "'");
    return;
  }
  return t.copy(any, ...args);
}
function _to(name, any, ...args) {
  const t = types[name];
  if (!t) {
    console.warn("Unable execute 'to'. Unknown type '" + name + "'");
    return;
  }
  const at = _id(null, any, false, true);
  if (!at) {
    return t.create();
  }
  if (t.name === at.name) {
    return any;
  }
  const exe = at.to[name] || at.to["*"];
  return exe ? _to(name, exe(any, ...args), ...args) : t.create(any);
}
function _toDefine(from, to, exe) {
  const tt = typeof to;
  const conv = types[from].to;
  if (tt === "function") {
    conv["*"] = to;
  } else if (tt === "object" && Array.isArray(to)) {
    for (let i in to) {
      conv[to[i]] = exe;
    }
  } else if (tt === "object") {
    for (let i in to) {
      conv[i] = to[i];
    }
  } else {
    conv[to] = exe;
  }
}
function _touch(any, op, ...args) {
  const t = _id(null, any, false, true);
  if (t && t[op]) {
    return t[op](any, ...args);
  }
}
function _rndKey(arr, min, max, sqr) {
  if (!arr) {
    return;
  }
  arr = Array.from(arr);
  const l = arr.length;
  return arr[Math.floor(jet.Num.rnd(jet.Num.frame(min || 0, 0, l), jet.Num.frame(max || l, 0, l), sqr))];
}
jet.type = new Complex_default((any) => _id(null, any), {
  all: (any) => _id(null, any, true),
  detail: (any) => jet[_id(null, any)],
  isFull: (any) => {
    const t = _id(null, any, false, true);
    return t ? t.full(any) : _isFull(any);
  },
  isMapable: (any) => {
    const t = _id(null, any, false, true);
    return t ? !!t.pairs : false;
  },
  full: (...a) => _factory(null, 1, ...a),
  copy: (any, ...a) => _copy(any, ...a),
  keys: (any) => _touch(any, "keys"),
  vals: (any) => _touch(any, "vals"),
  pairs: (any) => _touch(any, "pairs"),
  key: new Complex_default((any, key) => _touch(any, "get", key), {
    set: (any, key, val) => _touch(any, "set", key, val),
    rem: (any, key) => _touch(any, "rem", key),
    rnd: (any, min, max, sqr) => {
      const t = _id(null, any, false, true);
      if (t.vals) {
        any = t.vals(any);
      } else if (typeof any !== "string") {
        return;
      }
      return _rndKey(any, min, max, sqr);
    }
  }),
  define: (name, constructor, opt, custom8) => {
    let { rank, create, is, full, copy, rnd, keys, vals, pairs, get, set, rem } = opt || {};
    const err = "Jet type '" + name + "'";
    if (types[name]) {
      throw new Error(err + " is allready defined!!!");
    }
    if (jet[name]) {
      throw new Error(err + " is reserved!!!");
    }
    if (!constructor) {
      throw new Error(err + " missing constructor!!!");
    }
    if ((keys || vals || pairs) && !(keys && vals && pairs)) {
      throw new Error(err + " keys, vals or pairs missing!!!");
    }
    rank = rank || 0;
    create = create || ((...a) => new constructor(...a));
    is = is || ((any) => _isInstanceOf(constructor, any));
    full = full || ((any) => _isFull(any, vals));
    copy = copy || ((any) => any);
    rnd = rnd || create;
    const temp = create();
    const primitive = typeof temp;
    if (temp == null) {
      throw new Error(err + " 'create' didn't create anything");
    }
    if (!is(temp, primitive)) {
      throw new Error(err + " 'is' doesn't match the create output");
    }
    const fix = {
      is: (any, inclusive) => inclusive ? is(any, typeof any) : _is(name, any),
      isFull: (any, inclusive) => fix.is(any, inclusive) ? full(any) : false,
      to: new Complex_default((any, ...a) => _to(name, any, ...a), {
        define: (to, exe) => _toDefine(name, to, exe)
      }),
      only: (...a) => _factory(name, 0, ...a),
      full: (...a) => _factory(name, 1, ...a),
      tap: (...a) => _factory(name, 2, ...a),
      pull: (...a) => _factory(name, 3, ...a),
      copy: (any, ...a) => is(any, typeof any) ? copy(any, ...a) : void 0,
      rnd
    };
    if (pairs) {
      get = get || ((x, k) => x[k]);
      set = set || ((x, k, v) => x[k] = v);
      rem = rem || ((x, k) => delete x[k]);
      fix.keys = (any) => is(any, typeof any) ? keys(any) : void 0;
      fix.vals = (any) => is(any, typeof any) ? vals(any) : void 0;
      fix.pairs = (any) => is(any, typeof any) ? pairs(any) : void 0;
      fix.key = new Complex_default((any, key) => is(any, typeof any) ? get(any, key) : void 0, {
        set: (any, key, val) => is(any, typeof any) ? set(any, key, val) : void 0,
        rem: (any, key) => is(any, typeof any) ? rem(any, key) : void 0,
        rnd: (any, min, max, sqr) => is(any, typeof any) ? _rndKey(vals(any), min, max, sqr) : void 0
      });
    }
    const list = primitives[primitive] || (primitives[primitive] = []);
    list.push(types[name] = { rank, name, constructor, primitive, is, create, full, copy, keys, vals, pairs, get, set, rem, to: {} });
    list.sort((a, b) => b.rank - a.rank);
    return jet[name] = new Complex_default(create, fix, custom8);
  }
});
var jet_default = jet;

// src/types/Bol.js
var Bol_default = jet_default.type.define("Bol", Boolean, {
  rank: -4,
  is: (x, t) => t === "boolean",
  create: Boolean,
  rnd: (trueRatio) => Math.random() < (trueRatio || 0.5)
});

// src/types/Num.js
var custom = {
  x: function(num1, symbol, num2) {
    const s = symbol, nums = jet_default.Num.zoomIn(num1, num2), [n, m] = nums;
    if (s === "/") {
      return n / m;
    }
    if (s === "*") {
      return n * m / Math.pow(nums.zoom, 2);
    }
    return (s === "+" ? n + m : s === "-" ? n - m : s === "%" ? n % m : NaN) / nums.zoom;
  },
  frame: function(num, min, max) {
    num = max == null ? num : Math.min(num, max);
    return min == null ? num : Math.max(num, min);
  },
  round: function(num, dec, kind) {
    const k = Math.pow(10, dec || 0);
    return Math[kind == null ? "round" : kind ? "ceil" : "floor"](num * k) / k;
  },
  len: function(num, bol) {
    const b = bol, s = jet_default.Str.to(num), l = s.length, i = s.indexOf("."), p = i >= 0;
    return b === false ? p ? l - i - 1 : 0 : !p || !b ? l : i;
  },
  period: function(val, min, max) {
    const m = max - min;
    return (m + (val - min) % m) % m + min;
  },
  toRatio: function(num, min, max) {
    const m = max - min;
    return m ? (num - min) / m : 0;
  },
  fromRatio: function(num, min, max) {
    const m = max - min;
    return num * m + min;
  },
  zoomIn: function(...nums) {
    const zoom = Math.pow(10, Math.max(...nums.map((num) => jet_default.Num.len(num, false))));
    return jet_default.Obj.prop.add(nums.map((num) => Math.round(num * zoom)), "zoom", zoom);
  },
  zoomOut: function(nums) {
    return nums.map((num) => num / nums.zoom);
  },
  diffusion: function(num, min, max, diffusion) {
    var d = num * diffusion;
    return jet_default.Num.rnd(Math.max(min, num - d), Math.min(max, num + d));
  },
  snap: function(num, step, min, max, ceil, frame) {
    var v = num, s = step, n = min, m = max, ni = n != null, mi = m != null, c = ceil, f = frame !== false;
    if (v == null || s == null || s <= 0 || !(ni || mi)) {
      return v;
    } else if (f) {
      v = jet_default.Num.frame(v, n, m);
    }
    var r = ni ? v - n : m - v;
    v = r % s ? (ni ? n : m) + jet_default.Num.round(r / s, 0, c == null ? null : c === ni) * s * (ni * 2 - 1) : v;
    return f ? jet_default.Num.frame(v, n, m) : v;
  },
  whatpow: function(num, base) {
    return Math.log(jet_default.Num.to(num)) / Math.log(jet_default.Num.to(base));
  },
  toHex: function(num) {
    var r = jet_default.Num.to(Math.round(num)).toString(16);
    return r.length === 1 ? "0" + r : r;
  },
  toLetter: function(num, letters) {
    letters = jet_default.Str.to(letters) || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const len = letters.length;
    return (num >= len ? jet_default.Num.toLetter(Math.floor(num / len) - 1) : "") + letters[num % len];
  }
};
var Num_default = jet_default.type.define("Num", Number, {
  rank: -4,
  is: (x, t) => t === "number",
  create: Number,
  rnd: (min, max, sqr) => {
    var r = Math.random();
    if (sqr) {
      r = Math.pow(r, 2);
    } else if (sqr === false) {
      r = Math.sqrt(r);
    }
    return jet_default.Num.fromRatio(r, min || 0, max || min * 2 || 1);
  }
}, custom);

// src/types/Str.js
var custom2 = {
  isNumeric: function(str) {
    return !isNaN(Number(str));
  },
  lower: function(str) {
    return jet_default.Str.to(str).toLowerCase();
  },
  upper: function(str) {
    return jet_default.Str.to(str).toUpperCase();
  },
  capitalize: function(str) {
    str = jet_default.Str.to(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  delone: function(str) {
    let r = "", to = "aacdeeillnooorstuuuyrzAACDEEILLNOOORSTUUUYRZ", from = "\xE1\xE4\u010D\u010F\xE9\u011B\xED\u013A\u013E\u0148\xF3\xF4\xF6\u0155\u0161\u0165\xFA\u016F\xFC\xFD\u0159\u017E\xC1\xC4\u010C\u010E\xC9\u011A\xCD\u0139\u013D\u0147\xD3\xD4\xD6\u0154\u0160\u0164\xDA\u016E\xDC\xDD\u0158\u017D";
    for (let v of jet_default.Str.to(str)) {
      let x = from.indexOf(v);
      r += x >= 0 ? to[x] : v;
    }
    return r;
  },
  efface: function(str, remove) {
    return jet_default.Str.to(str).replace(remove, "").replace(/[\s\n\r]+/g, " ").trim();
  },
  simplify: function(str, remove) {
    return jet_default.Str.delone(jet_default.Str.efface(jet_default.Str.to(str), remove).toLowerCase());
  },
  sort: function(...strs) {
    return strs.map((v) => {
      const s = jet_default.Str.to(v), d = jet_default.Str.delone(s), l = d.toLowerCase();
      return { l, d, s };
    }).sort((m1, m2) => {
      for (let i = 0; true; i++) {
        for (let k in m1) {
          let c1 = m1[k].charCodeAt(i) || 0, c2 = m2[k].charCodeAt(i) || 0;
          if (c1 !== c2 || !c1) {
            return c1 - c2;
          }
        }
      }
    }).map((m) => m.s);
  },
  fight: function(...strs) {
    return jet_default.Str.sort(...strs)[0];
  },
  carret: function(str, pos) {
    const l = jet_default.Str.to(str).length;
    return jet_default.Num.frame(jet_default.Num.tap(pos, l), 0, l);
  },
  splice: function(str, index, howmany, ...strs) {
    str = jet_default.Str.to(str);
    const s = jet_default.Str.carret(str, index), m = jet_default.Num.frame(howmany, 0, str.length - s);
    return str.slice(0, s) + jet_default.Map.melt(strs, "") + str.slice(s + m);
  },
  hide: new Complex_default((str, pat, whitespace) => {
    if (!str) {
      return str;
    }
    var r = "", s = str, p = jet_default.Str.hide[pat] || pat || "\u2022", w = whitespace === false;
    for (var i = 0; i < str.length; i++) {
      r += w && (s[i] === "\n" || s[i] === " ") ? s[i] : p.length - 1 ? jet_default.type.key.rnd(p) : p;
    }
    return r;
  }, {
    point: "\u2022",
    cross: "\xD7",
    flake: "\u2600",
    draft: "\u232D",
    power: "\u26A1",
    star: "\u2605",
    skull: "\u2620",
    card: "\u2660\u2665\u2666\u2663",
    notes: "\u2669\u266A\u266B\u266C\u266D\u266E\u266F",
    chess: "\u2654\u2655\u2656\u2657\u2658\u2659\u265A\u265B\u265C\u265D\u265E\u265F",
    block: "\u2596\u2597\u2598\u2599\u259A\u259B\u259C\u259D\u259E\u259F",
    bar: "\u2502\u2551 \u258C\u2590\u2588",
    iting: "\u2630\u2631\u2632\u2633\u2634\u2635\u2636\u2637",
    astro: "\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653",
    die: "\u2680\u2681\u2682\u2683\u2684\u2685",
    runic: "\u16A0\u16A1\u16A2\u16A3\u16A4\u16A5\u16A6\u16A7\u16A8\u16A9\u16AA\u16AB\u16AC\u16AD\u16AE\u16AF\u16B0\u16B1\u16B3\u16B4\u16B5\u16B6\u16B7\u16B8\u16B9\u16BA\u16BB\u16BC\u16BD\u16BE\u16BF\u16C0\u16C1\u16C2\u16C3\u16C4\u16C5\u16C6\u16C7\u16C8\u16C9\u16CA\u16CB\u16CF\u16D0\u16D1\u16D2\u16D3\u16D4\u16D5\u16D6\u16D7\u16D8\u16D9\u16DA\u16DB\u16DC\u16DD\u16DE\u16DF\u16E0\u16E1\u16E2\u16E3\u16E4\u16E5\u16E6\u16E8\u16E9\u16EA\u16EE\u16EF\u16F0",
    dots: "\u2800\u2801\u2802\u2803\u2804\u2805\u2806\u2807\u2808\u2809\u280A\u280B\u280C\u280D\u280E\u280F\u2810\u2811\u2812\u2813\u2814\u2815\u2816\u2817\u2818\u2819\u281A\u281B\u281C\u281D\u281E\u281F\u2820\u2821\u2822\u2823\u2824\u2825\u2826\u2827\u2828\u2829\u282A\u282B\u282C\u282D\u282E\u282F\u2830\u2831\u2832\u2833\u2834\u2835\u2836\u2837\u2838\u2839\u283A\u283B\u283C\u283D\u283E\u283F\u2840\u2841\u2842\u2843\u2844\u2845\u2846\u2847\u2848\u2849\u284A\u284B\u284C\u284D\u284E\u284F\u2850\u2851\u2852\u2853\u2854\u2855\u2856\u2857\u2858\u2859\u285A\u285B\u285C\u285D\u285E\u285F\u2860\u2861\u2862\u2863\u2864\u2865\u2866\u2867\u2868\u2869\u286A\u286B\u286C\u286D\u286E\u286F\u2870\u2871\u2872\u2873\u2874\u2875\u2876\u2877\u2878\u2879\u287A\u287B\u287C\u287D\u287E\u287F\u2880\u2881\u2882\u2883\u2884\u2885\u2886\u2887\u2888\u2889\u288A\u288B\u288C\u288D\u288E\u288F\u2890\u2891\u2892\u2893\u2894\u2895\u2896\u2897\u2898\u2899\u289A\u289B\u289C\u289D\u289E\u289F\u28A0\u28A1\u28A2\u28A3\u28A4\u28A5\u28A6\u28A7\u28A8\u28A9\u28AA\u28AB\u28AC\u28AD\u28AE\u28AF\u28B0\u28B1\u28B2\u28B3\u28B4\u28B5\u28B6\u28B7\u28B8\u28B9\u28BA\u28BB\u28BC\u28BD\u28BE\u28BF\u28C0\u28C1\u28C2\u28C3\u28C4\u28C5\u28C6\u28C7\u28C8\u28C9\u28CA\u28CB\u28CC\u28CD\u28CE\u28CF\u28D0\u28D1\u28D2\u28D3\u28D4\u28D5\u28D6\u28D7\u28D8\u28D9\u28DA\u28DB\u28DC\u28DD\u28DE\u28DF\u28E0\u28E1\u28E2\u28E3\u28E4\u28E5\u28E6\u28E7\u28E8\u28E9\u28EA\u28EB\u28EC\u28ED\u28EE\u28EF\u28F0\u28F1\u28F2\u28F3\u28F4\u28F5\u28F6\u28F7\u28F8\u28F9\u28FA\u28FB\u28FC\u28FD\u28FE\u28FF"
  }),
  levenshtein: function(s0, s1, blend) {
    var s = blend === false ? [s0, s1] : [jet_default.Str.simplify(s0, blend), jet_default.Str.simplify(s1, blend)];
    if (s[0] === s[1]) {
      return 1;
    } else if (!s[0] || !s[1]) {
      return 0;
    }
    var l = [s[0].length, s[1].length], c = [];
    if (l[1] > l[0]) {
      l.reverse();
      s.reverse();
    }
    for (var i = 0; i <= l[0]; i++) {
      var oV = i;
      for (var j = 0; j <= l[1]; j++) {
        if (i === 0) {
          c[j] = j;
        } else if (j > 0) {
          var nV = c[j - 1];
          if (s[0].charAt(i - 1) !== s[1].charAt(j - 1)) {
            nV = Math.min(Math.min(nV, oV), c[j]) + 1;
          }
          c[j - 1] = oV;
          oV = nV;
        }
      }
      if (i > 0) {
        c[l[1]] = oV;
      }
    }
    return (l[0] - c[l[1]]) / parseFloat(l[0]);
  },
  mutate: function(str, factor) {
    var r = [], n = str.length / 2, m = str.length * 2, f = Math.abs(1e3 * (factor || 1));
    while (r.length < f) {
      var s = jet_default.Str.rnd(n, m);
      r.push([s, jet_default.Str.levenshtein(s, str)]);
    }
    return r.sort(function(a, b) {
      return b[1] - a[1];
    })[0][0];
  }
};
var Str_default = jet_default.type.define("Str", String, {
  rank: -4,
  is: (x, t) => t === "string",
  create: (any) => any == null ? "" : String(any),
  rnd: (min, max, sqr) => {
    const c = ["bcdfghjklmnpqrstvwxz", "aeiouy"], p = c[0].length / (c[0].length + c[1].length);
    const l = jet_default.Num.rnd(Math.max(min, 2), max, sqr);
    let s = jet_default.Bol.rnd(p), r = "";
    while (r.length < l) {
      r += jet_default.type.key.rnd(c[+(s = !s)]);
    }
    return r;
  }
}, custom2);

// src/types/Symbol.js
var Symbol_default = jet_default.type.define("Symbol", Symbol, {
  rank: -4,
  is: (x, t) => t === "symbol",
  create: Symbol,
  rnd: (...a) => Symbol(jet_default.Str.rnd(...a))
});

// src/types/Fce.js
var custom3 = {
  run: function(any, ...args) {
    if (jet_default.Fce.is(any)) {
      return any(...args);
    }
    return jet_default.Map.of(any, (f) => jet_default.Fce.run(f, ...args));
  },
  measure: function(fces, args, repeat) {
    const rep = repeat || 100, ladder = [], statis = {};
    for (var i = 1; i <= rep; i++) {
      for (let fce of fces) {
        let stat = statis[fce.name];
        if (!stat) {
          statis[fce.name] = stat = { fce: fce.name, runtimeAvg: 0, runtimeSum: 0 };
          ladder.push(stat);
        }
        ;
        let now = performance.now();
        let result = fce.apply(this, args);
        let runtime = performance.now() - now;
        stat.runtimeSum += runtime;
        stat.runtimeAvg = stat.runtimeSum / i;
      }
      ;
    }
    ;
    ladder.sort((a, b) => a.runtimeSum - b.runtimeSum);
    const best = ladder[0];
    for (let stat of ladder) {
      let factor = stat.runtimeSum / best.runtimeSum - 1;
      if (factor > 0) {
        stat.slowFactor = "+" + Math.round(factor * 1e4) / 100 + "%";
      }
    }
    return { repeated: rep, ladder };
  }
};
var Fce_default = jet_default.type.define("Fce", Function, {
  rank: -4,
  is: (x, t) => t === "function",
  create: Function,
  copy: (x) => Object.defineProperties({ [x.name]: (...a) => x(...a) }[x.name], Object.getOwnPropertyDescriptors(x))
}, custom3);

// src/types/RegExp.js
var custom4 = {
  lib: {
    line: /[^\n\r]+/g,
    number: /[0-9.,-]+/g,
    word: /[^\s\n\r]+/g,
    num: /-?[0-9]*[.,]?[0-9]+/,
    email: /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    ip: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/i,
    domain: /([a-z0-9]+\.)+(cz|de|sk|au|com|eu|info|org|[a-z]+)/i,
    hexadecimal: /[0-9a-fA-F]{6,6}/
  },
  strip(regex) {
    return regex.toString().slice(1, -1);
  }
};
var RegExp_default = jet_default.type.define("RegExp", RegExp, {
  rank: -4,
  is: (x, t) => x instanceof RegExp,
  create: RegExp,
  copy: (_) => RegExp(_.source)
}, custom4);

// src/types/Date.js
var custom5 = {
  secToTime: function(sec) {
    sec = jet_default.Num.to(sec);
    if (sec <= 0) {
      return "";
    }
    var t = Math.floor(sec), s = t % 60, m = (t - s) % 3600, h = (t - m - s) / 3600;
    m /= 60;
    return (h ? h + ":" + (m < 10 ? "0" : "") : "") + (h || m ? m + ":" + (s < 10 ? "0" : "") : "") + s;
  }
};
var Date_default = jet_default.type.define("Date", Date, {
  rank: -4,
  is: (x, t) => x instanceof Date,
  create: (x) => !x ? new Date() : new Date(x),
  rnd: (trueRatio) => Math.random() < (trueRatio || 0.5)
}, custom5);

// src/types/NaN.js
var NaN_default = jet_default.type.define("NaN", Number, {
  rank: -2,
  is: (x, t) => t === "number" && isNaN(x),
  create: (_) => NaN
});

// src/types/Err.js
var Err_default = jet_default.type.define("Err", Error, {
  rank: -1,
  is: (x, t) => x instanceof Error,
  rnd: (...a) => new Error(jet_default.Str.rnd(...a))
});

// src/types/Prom.js
var Prom_default = jet_default.type.define("Prom", Promise, {
  rank: -1,
  is: (x, t) => x instanceof Promise,
  create: (x) => new Promise(jet_default.Fce.only(x, (e) => e()))
});

// src/types/Arr.js
var custom6 = {
  swap: function(arr, to, from) {
    arr = jet_default.Arr.tap(arr);
    arr[to] = arr.splice(from, 1, arr[to])[0];
    return arr;
  },
  shuffle: function(arr) {
    arr = jet_default.Arr.tap(arr);
    for (var i = arr.length - 1; i > 0; i--) {
      jet_default.Arr.swap(arr, Math.floor(Math.random() * (i + 1)), i);
    }
    return arr;
  },
  clean: function(arr, rekey, handler) {
    arr = jet_default.Arr.tap(arr);
    handler = jet_default.Fce.tap(handler, (v) => v != null ? v : void 0);
    return rekey !== false ? arr.filter(handler) : jet_default.Map.of(arr, handler);
  }
};
var Arr_default = jet_default.type.define("Arr", Array, {
  rank: -1,
  is: Array.isArray,
  copy: (x) => Array.from(x),
  keys: (x) => x.keys(),
  vals: (x) => x.values(),
  pairs: (x) => x.entries()
}, custom6);

// src/types/Set.js
var Set_default = jet_default.type.define("Set", Set, {
  rank: -1,
  is: (x) => x instanceof Set,
  copy: (x) => new Set(x),
  keys: (x) => x.keys(),
  vals: (x) => x.values(),
  pairs: (x) => x.entries(),
  get: (x, k) => x.has(k) ? k : void 0,
  set: (x, k, v) => x.add(v) ? v : void 0,
  rem: (x, k) => x.delete(k)
});

// src/types/Map.js
function getForKey(any, key) {
  return jet_default.type.isMapable(any) ? any : jet_default.Str.isNumeric(key) ? [] : {};
}
function _map(any, fce, deep, flat, path) {
  const t = jet_default.type.detail(any);
  flat = flat ? jet_default.Arr.tap(flat) : null;
  if (!t || !t.pairs) {
    return flat || any;
  }
  fce = jet_default.Fce.tap(fce);
  path = jet_default.Arr.to(path, ".");
  const dd = jet_default.Fce.is(deep);
  const level = path.length;
  const res = flat || t();
  for (let [key, val] of t.pairs(any)) {
    path[level] = key;
    const pkey = path.join(".");
    const dp = deep && jet_default.type.isMapable(val);
    val = dp ? _map(val, fce, deep, flat, pkey) : fce(val, pkey);
    if (dp && dd) {
      val = deep(val, pkey);
    }
    if (val === void 0) {
      continue;
    }
    if (!flat) {
      t.key.set(res, key, val);
    } else if (!dp) {
      flat.push(val);
    }
  }
  ;
  return res;
}
function _audit(includeMapable, ...any) {
  const audit = /* @__PURE__ */ new Set();
  any.map((a) => jet_default.Map.it(a, (v, p) => audit.add(p), includeMapable ? (v, p) => audit.add(p) : true));
  return Array.from(audit).sort((a, b) => b.localeCompare(a));
}
var custom7 = {
  it: (any, fce, deep) => _map(any, fce, deep, true),
  of: (any, fce, deep) => _map(any, fce, deep),
  dig: function(any, path, def) {
    const pa = jet_default.Str.to(path, ".").split(".");
    for (let p of pa) {
      if ((any = jet_default.type.key(any, p)) == null) {
        return def;
      }
    }
    return any;
  },
  put: function(any, path, val, force) {
    force = jet_default.Bol.tap(force, true);
    const pa = jet_default.Str.to(path, ".").split("."), pb = [];
    const r = any = getForKey(any, pa[0]);
    for (let [i, p] of pa.entries()) {
      if (val == null) {
        pb[pa.length - 1 - i] = [any, p];
      }
      if (!force && any[p] != null && !jet_default.type.isMapable(any[p])) {
        return r;
      } else if (i !== pa.length - 1) {
        any = jet_default.type.key.set(any, p, getForKey(any[p], pa[i + 1]));
      } else if (val == null) {
        jet_default.type.key.rem(any, p);
      } else {
        jet_default.type.key.set(any, p, val);
      }
    }
    ;
    for (let [any2, p] of pb) {
      if (jet_default.type.isFull(any2[p])) {
        break;
      } else {
        jet_default.type.key.rem(any2, p);
      }
    }
    ;
    return r;
  },
  deflate: function(...any) {
    const result = {};
    any.map((a) => jet_default.Map.it(a, (v, p) => result[p] = v, true));
    return result;
  },
  inflate: function(any) {
    const result = {};
    jet_default.Map.it(any, (v, p) => jet_default.Map.put(result, p, v, true));
    return result;
  },
  merge: function(...any) {
    return jet_default.Map.inflate(jet_default.Map.deflate(...any));
  },
  clone: function(any, deep) {
    return jet_default.Map.of(any, (_) => _, deep);
  },
  audit: new Complex_default((...any) => _audit(false, ...any), {
    full: (...any) => _audit(true, ...any)
  }),
  match: function(to, from, fce) {
    fce = jet_default.Fce.tap(fce);
    _audit(true, to, from).map((path) => {
      jet_default.Map.put(to, path, fce(jet_default.Map.dig(to, path), jet_default.Map.dig(from, path), path), true);
    });
    return to;
  },
  compare: function(...any) {
    const res = /* @__PURE__ */ new Set();
    _audit(false, ...any).map((path) => {
      if (new Set(any.map((a) => jet_default.Map.dig(a, path))).size > 1) {
        const parr = path.split(".");
        parr.map((v, k) => res.add(parr.slice(0, k + 1).join(".")));
      }
    });
    return Array.from(res);
  },
  melt(any, comma) {
    let j = "", c = jet_default.Str.to(comma);
    if (!jet_default.type.isMapable(any)) {
      return jet_default.Str.to(any, c);
    }
    jet_default.Map.it(any, (v) => {
      v = jet_default.Map.melt(v, c);
      j += v ? (j ? c : "") + v : "";
    });
    return j;
  }
};
var Map_default = jet_default.type.define("Map", Map, {
  rank: -1,
  is: (x) => x instanceof Map,
  copy: (x) => new Map(x),
  keys: (x) => x.keys(),
  vals: (x) => x.values(),
  pairs: (x) => x.entries(),
  get: (x, k) => x.get(k),
  set: (x, k, v) => x.set(k, v),
  rem: (x, k) => x.delete(k)
}, custom7);

// src/index.js
var type = jet_default.type;
var Complex2 = jet_default.type.define("Complex", Complex_default);
jet_default.Str.to.define({
  Fce: (str) => (_) => str,
  Bol: (str) => !["0", "false", "null", "undefined", "NaN"].includes(str.toLowerCase()),
  Arr: (str, comma) => str.split(comma),
  Num: (str, strict) => Number(strict ? str : (str.match(jet_default.RegExp.lib.num) || []).join("").replace(",", ".")),
  Obj: (str) => jet_default.Obj.json.from(str),
  Prom: async (str) => str
});
jet_default.Num.to.define({
  Fce: (num) => (_) => num,
  Bol: (num) => !!num,
  Arr: (num, comma) => comma ? [num] : Array(num),
  Prom: async (num) => num,
  Str: (num) => String(num)
});
jet_default.Obj.to.define({
  Fce: (obj) => (_) => obj,
  Symbol: (obj) => Symbol_default(jet_default.Obj.json.to(obj)),
  Bol: (obj) => jet_default.Obj.isFull(obj),
  Num: (obj) => Object.values(obj),
  Arr: (obj) => Object.values(obj),
  Str: (obj) => jet_default.Obj.json.to(obj),
  Prom: async (obj) => obj,
  Err: (obj) => jet_default.Obj.json.to(obj),
  RegExp: (obj, comma) => jet_default.Map.melt(obj, comma != null ? comma : "|")
});
jet_default.Arr.to.define({
  Fce: (arr) => (_) => arr,
  Bol: (arr) => jet_default.Arr.isFull(arr),
  Num: (arr) => arr.length,
  Str: (arr, comma) => jet_default.Map.melt(arr, comma),
  Obj: (arr) => Object.assign({}, arr),
  Prom: async (arr) => arr,
  Err: (arr, comma) => jet_default.Map.melt(arr, comma != null ? comma : " "),
  RegExp: (arr, comma) => jet_default.Map.melt(arr, comma != null ? comma : "|")
});
jet_default.Set.to.define({
  "*": (set) => Array.from(set),
  Fce: (set) => (_) => set,
  Bol: (set) => jet_default.Set.isFull(set),
  Obj: (set) => jet_default.Obj.merge(set),
  Prom: async (set) => set
});
jet_default.Prom.to.define({
  eng: (prom, timeout) => jet_default.eng(prom, timeout)
});
jet_default.Fce.to.define({
  "*": (fce, ...args) => fce(...args),
  Prom: async (fce, ...args) => await fce(...args)
});
jet_default.NaN.to.define((_) => void 0);
var src_default = jet_default;
//# sourceMappingURL=index.cjs.js.map
