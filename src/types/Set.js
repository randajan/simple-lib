import jet from "../jet";

export default jet.type.define("Set", Set, {
    rank:-1,
    is:x=>x instanceof Set,
    copy:x=>new Set(x),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    pairs:x=>x.entries(),
    get:(x,k)=>x.has(k)?k:undefined,
    set:(x,k,v)=>x.add(v)?v:undefined,
    rem:(x,k)=>x.delete(k)
});


jet.Set.to.define({
    "*":set=>Array.from(set),
    Fce:set=>_=>set,
    Bol:set=>jet.Set.isFull(set),
    Obj:set=>jet.Obj.merge(set),
    Prom:async set=>set,
});