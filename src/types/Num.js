import jet from "../jet.js";

const custom = {
    x: function (num1, symbol, num2) {
        const s = symbol, nums = jet.Num.zoomIn(num1, num2), [n, m] = nums;
        if (s === "/") { return n/m; }
        if (s === "*") { return n*m/Math.pow(nums.zoom, 2); }
        return (s === "+" ? n + m : s === "-" ? n - m : s === "%" ? n % m : NaN) / nums.zoom;
    },
    frame: function (num, min, max) { num = max == null ? num : Math.min(num, max); return min == null ? num : Math.max(num, min); },
    round: function (num, dec, kind) { const k = Math.pow(10, dec || 0); return Math[kind == null ? "round" : kind ? "ceil" : "floor"](num * k) / k; },
    len: function (num, bol) { const b = bol, s = jet.Str.to(num), l = s.length, i = s.indexOf("."), p = (i >= 0); return (b === false ? (p ? l - i - 1 : 0) : ((!p || !b) ? l : i)); },
    period: function (val, min, max) { const m = max - min; return (m + (val - min) % m) % m + min; },
    toRatio: function (num, min, max) { const m = max - min; return m ? (num - min) / m : 0; },
    fromRatio: function (num, min, max) { const m = max - min; return num * m + min; },
    zoomIn: function (...nums) {
        const zoom = Math.pow(10, Math.max(...nums.map(num => jet.Num.len(num, false))));
        return jet.Obj.prop.add(nums.map(num => Math.round(num * zoom)), "zoom", zoom);
    },
    zoomOut: function (nums) { return nums.map(num => num / nums.zoom); },
    diffusion: function (num, min, max, diffusion) { var d = num * diffusion; return jet.Num.rnd(Math.max(min, num - d), Math.min(max, num + d)); },
    snap: function (num, step, min, max, ceil, frame) {
        var v = num, s = step, n = min, m = max, ni = (n != null), mi = (m != null), c = ceil, f = (frame !== false);
        if (v == null || s == null || s <= 0 || !(ni || mi)) { return v; } else if (f) { v = jet.Num.frame(v, n, m); }
        var r = ni ? v - n : m - v; v = (r % s) ? ((ni ? n : m) + (jet.Num.round(r / s, 0, c == null ? null : c === ni) * s * (ni * 2 - 1))) : v; //snap
        return (f ? (jet.Num.frame(v, n, m)) : v); //frame
    },
    whatpow: function(num, base) { return Math.log(jet.Num.to(num))/Math.log(jet.Num.to(base)); },
    toHex: function (num) { var r = jet.Num.to(Math.round(num)).toString(16); return r.length === 1 ? "0" + r : r; },
    toLetter: function(num, letters) {
        letters = jet.Str.to(letters) || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const len = letters.length;
        return (num >= len ? jet.Num.toLetter(Math.floor(num / len) -1) : '') + letters[num % len];
    }
}


export default jet.type.define("Num", Number, {
    rank:-4,
    is:(x,t)=>t === "number",
    create:Number,
    rnd:(min, max, sqr)=>{
        var r = Math.random(); if (sqr) { r = Math.pow(r, 2); } else if (sqr === false) { r = Math.sqrt(r); }
        return jet.Num.fromRatio(r, min||0, max||min*2||1);
    },
}, custom);

jet.Num.to.define({
    Fce:num=>_=>num,
    Bol:num=>!!num,
    Arr:(num, comma)=>comma?[num]:Array(num),
    Prom:async num=>num,
    Str:num=>String(num)
});