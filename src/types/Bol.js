import jet from "../jet";

export default jet.type.define("Bol", Boolean, {
    rank:-4,
    is:(x,t)=>t === "boolean",
    create:Boolean,
    rnd:(trueRatio)=>Math.random() < (trueRatio||.5),
});