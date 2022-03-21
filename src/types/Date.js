import jet from "../jet.js";

const custom = {
    secToTime:function(sec) {
        sec = jet.Num.to(sec); if (sec <= 0) {return "";}
        var t = Math.floor(sec), s = t % 60, m = (t-s) % 3600, h = (t-m-s)/3600; m /= 60;
        return (h ? (h+":"+(m < 10 ? "0" : "")) : "")+((h || m) ? m+":"+(s < 10 ? "0" : "") : "")+s;
    }
}

export default jet.type.define("Date", Date, {
    rank:-4,
    is:(x,t)=>x instanceof Date,
    create:x=>!x ? new Date() : new Date(x),
    rnd:(trueRatio)=>Math.random() < (trueRatio||.5),
}, custom)