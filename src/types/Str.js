
import jet from "../jet";
import Complex from "../Complex";

const custom = {
    isNumeric: function(str) { return !isNaN(Number(str)); },
    lower: function (str) { return jet.Str.to(str).toLowerCase() },
    upper: function (str) { return jet.Str.to(str).toUpperCase() },
    capitalize: function (str) { str = jet.Str.to(str); return str.charAt(0).toUpperCase() + str.slice(1); }, //first letter upcase,
    delone: function (str) {
        let r = "", to = "aacdeeillnooorstuuuyrzAACDEEILLNOOORSTUUUYRZ", from = "áäčďéěíĺľňóôöŕšťúůüýřžÁÄČĎÉĚÍĹĽŇÓÔÖŔŠŤÚŮÜÝŘŽ";
        for (let v of jet.Str.to(str)) { let x = from.indexOf(v); r += (x >= 0 ? to[x] : v); }
        return r;
    },
    efface: function (str, remove) { return jet.Str.to(str).replace(remove, "").replace(/[\s\n\r]+/g, " ").trim(); },
    simplify: function (str, remove) { return jet.Str.delone(jet.Str.efface(jet.Str.to(str), remove).toLowerCase()); },
    sort: function (...strs) {
        return strs.map(v => { const s = jet.Str.to(v), d = jet.Str.delone(s), l = d.toLowerCase(); return {l, d, s} })
            .sort((m1, m2) => {
                for (let i=0; true; i++) {
                    for (let k in m1) {
                        let c1 = m1[k].charCodeAt(i) || 0, c2 = m2[k].charCodeAt(i) || 0;
                        if (c1 !== c2 || !c1) { return c1 - c2; }
                    }
                }
            })
            .map(m=>m.s);
    },
    fight: function(...strs) {return jet.Str.sort(...strs)[0];},
    carret: function (str, pos) { const l = jet.Str.to(str).length; return jet.Num.frame(jet.Num.tap(pos, l), 0, l); },
    splice: function (str, index, howmany, ...strs) {
        str = jet.Str.to(str);
        const s = jet.Str.carret(str, index), m = jet.Num.frame(howmany, 0, str.length-s); 
        return str.slice(0, s) + jet.Map.melt(strs, "") + str.slice(s+m);
    },
    hide: new Complex((str, pat, whitespace)=>{
        if (!str) { return str; } var r = "", s = str, p = jet.Str.hide[pat] || pat || "•", w = (whitespace === false);
        for (var i = 0; i < str.length; i++) { r += (w && (s[i] === "\n" || s[i] === " ")) ? s[i] : p.length - 1 ? jet.type.key.rnd(p) : p; } return r;
    }, {
        point:"•", cross:"×", flake:"☀", draft:"⌭", power:"⚡", star:"★", skull:"☠", card:"♠♥♦♣", notes:"♩♪♫♬♭♮♯", chess:"♔♕♖♗♘♙♚♛♜♝♞♟",
        block:"▖▗▘▙▚▛▜▝▞▟", bar:"│║ ▌▐█", iting:"☰☱☲☳☴☵☶☷", astro:"♈♉♊♋♌♍♎♏♐♑♒♓", die:"⚀⚁⚂⚃⚄⚅",
        runic:"ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛠᛡᛢᛣᛤᛥᛦᛨᛩᛪᛮᛯᛰ",
        dots:"⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿"
    }),
    levenshtein: function (s0, s1, blend) {
        var s = ((blend === false) ? [s0, s1] : [jet.Str.simplify(s0, blend), jet.Str.simplify(s1, blend)]);
        if (s[0] === s[1]) { return 1; } else if (!s[0] || !s[1]) { return 0; }
        var l = [s[0].length, s[1].length], c = []; if (l[1] > l[0]) { l.reverse(); s.reverse(); }
        for (var i = 0; i <= l[0]; i++) {
            var oV = i; for (var j = 0; j <= l[1]; j++) {
                if (i === 0) { c[j] = j; } else if (j > 0) {
                    var nV = c[j - 1];
                    if (s[0].charAt(i - 1) !== s[1].charAt(j - 1)) { nV = Math.min(Math.min(nV, oV), c[j]) + 1; } c[j - 1] = oV; oV = nV;
                }
            } if (i > 0) { c[l[1]] = oV; }
        }
        return (l[0] - c[l[1]]) / parseFloat(l[0]);
    },
    mutate: function (str, factor) {
        var r = [], n = str.length / 2, m = str.length * 2, f = Math.abs(1000 * (factor || 1));
        while (r.length < f) { var s = jet.Str.rnd(n, m); r.push([s, jet.Str.levenshtein(s, str)]); }
        return r.sort(function (a, b) { return b[1] - a[1]; })[0][0];
    },
}

export default jet.type.define("Str", String, {
    rank:-4,
    is:(x,t)=>t === "string",
    create:any=>any == null ? "" : String(any),
    rnd:(min, max, sqr)=>{ //HOW TO GENERATE GREAT RANDOM STRING???
        const c = ["bcdfghjklmnpqrstvwxz", "aeiouy"], p = c[0].length/(c[0].length+c[1].length);
        const l = jet.Num.rnd(Math.max(min, 2), max, sqr);
        let s = jet.Bol.rnd(p), r = "";
        while (r.length < l) {r += jet.type.key.rnd(c[+(s = !s)]);}
        return r;
    }
}, custom);


jet.Str.to.define({
    Fce:str=>_=>str,
    Bol:str=>!["0", "false", "null", "undefined", "NaN"].includes(str.toLowerCase()),
    Arr:(str, comma)=>str.split(comma),
    Num:(str, strict)=>Number(strict ? str : ((str.match(jet.RegExp.lib.num) || []).join("")).replace(",", ".")),
    Obj:str=>jet.Obj.json.from(str),
    Prom:async str=>str,
});