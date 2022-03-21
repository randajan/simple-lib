import jet from "../jet";

const custom = {
    prop:{
        add:function(obj, property, val, writable, enumerable, overwrite) { 
            overwrite = jet.Bol.tap(overwrite, true);
            if (jet.type.isMapable(property)) {
                jet.Map.it(property, (f, i)=>{
                    const n = jet.Str.isNumeric(i);
                    jet.Obj.prop.add(obj, n ? f : i, n ? val : f, writable, enumerable, overwrite)
                });
            } else if (!obj[property] || overwrite) {
                Object.defineProperty(obj, property, {value:val, writable:!!writable, configurable:!!writable, enumerable:!!enumerable});
            }
            return obj;
        },
        get:function(obj, property) {
            if (!property) { property = Array.from(Object.getOwnPropertyNames(obj)); }
            if (!jet.type.isMapable(property)) { return obj[property]; }
            const props = {};
            jet.Map.it(property, k=>props[k]=obj[k]);
            return props;
        }
    },
    json:{
        from:function(json, throwErr) {
            if (jet.type.isMapable(json)) { return json; }
            try { return JSON.parse(jet.Str.to(json)); } catch(e) { if (throwErr === true) { throw e } }
        },
        to:function(obj, prettyPrint) {
            const spacing = jet.Num.only(prettyPrint === true ? 2 : prettyPrint);
            return JSON.stringify(jet.type.isMapable(obj) ? obj : {}, null, spacing);
        }
    }
}

export default jet.type.define("Obj", Object, {
    rank:-6, //because lot of things are objects
    is:(x,t)=>t === "object",
    copy:x=>Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys:x=>Object.keys(x),
    vals:x=>Object.values(x),
    pairs:x=>Object.entries(x)
}, custom);


jet.Obj.to.define({
    Fce:obj=>_=>obj,
    Symbol:obj=>Symbol(jet.Obj.json.to(obj)),
    Bol:obj=>jet.Obj.isFull(obj),
    Num:obj=>Object.values(obj),
    Arr:obj=>Object.values(obj),
    Str:obj=>jet.Obj.json.to(obj),
    Prom:async obj=>obj,
    Err:obj=>jet.Obj.json.to(obj),
    RegExp:(obj, comma)=>jet.Map.melt(obj, comma != null ? comma : "|")
});