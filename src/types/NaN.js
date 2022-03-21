import jet from "../jet";

export default jet.type.define("NaN", Number, {
    rank:-2,
    is:(x,t)=>t === "number" && isNaN(x),
    create:_=>NaN,
});


jet.NaN.to.define(_=>undefined);