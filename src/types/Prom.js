import jet from "../jet";

export default jet.type.define("Prom", Promise, {
    rank:-1,
    is:(x,t)=>x instanceof Promise,
    create:x=>new Promise(jet.Fce.only(x, e=>e())),
});


jet.Prom.to.define({
    eng:(prom, timeout)=>jet.eng(prom, timeout)
});
