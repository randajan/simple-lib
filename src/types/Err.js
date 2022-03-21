import jet from "../jet";

export default jet.type.define("Err", Error, {
    rank:-1,
    is:(x,t)=>x instanceof Error,
    rnd:(...a)=>new Error(jet.Str.rnd(...a)),
});
