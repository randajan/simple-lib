import jet from "../jet";

export default jet.type.define("Symbol", Symbol, {
    rank:-4,
    is:(x,t)=>t === "symbol",
    create:Symbol,
    rnd:(...a)=>Symbol(jet.Str.rnd(...a)),
});