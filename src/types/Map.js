import jet from "../jet.js";

import Complex from "../Complex";

function getForKey(any, key) { return jet.type.isMapable(any) ? any : jet.Str.isNumeric(key) ? [] : {}; }

function _map(any, fce, deep, flat, path) {
    const t = jet.type.detail(any);
    flat = flat ? jet.Arr.tap(flat) : null;
    if (!t || !t.pairs) { return flat || any; }

    fce = jet.Fce.tap(fce);
    path = jet.Arr.to(path, ".");
    const dd = jet.Fce.is(deep);
    const level = path.length;
    const res = flat || t();
    
    for (let [key, val] of t.pairs(any)) {
        path[level] = key;
        const pkey = path.join(".");
        const dp = deep && jet.type.isMapable(val);
        val = dp ? _map(val, fce, deep, flat, pkey) : fce(val, pkey);
        if (dp && dd) { val = deep(val, pkey); }
        if (val === undefined) { continue; }
        if (!flat) { t.key.set(res, key, val); } else if (!dp) { flat.push(val); } //aftermath
    };
    
    return res;
}

function _audit(includeMapable, ...any) {
    const audit = new Set();
    any.map(a=>jet.Map.it(a, (v,p)=>audit.add(p), includeMapable ? (v,p)=>audit.add(p) : true));
    return Array.from(audit).sort((a,b)=>b.localeCompare(a));
}


const custom = {

    it:(any, fce, deep)=>_map(any, fce, deep, true),
    of:(any, fce, deep)=>_map(any, fce, deep),
    dig: function(any, path, def) {
        const pa = jet.Str.to(path, ".").split(".");
        for (let p of pa) { if (null == (any = jet.type.key(any, p))) { return def; }}
        return any;
    },
    put: function(any, path, val, force) {
        force = jet.Bol.tap(force, true);
        const pa = jet.Str.to(path, ".").split("."), pb = [];
        const r = any = getForKey(any, pa[0]);

        for (let [i, p] of pa.entries()) {
            if (val == null) { pb[pa.length-1-i] = [any, p]; } //backpath
            if (!force && any[p] != null && !jet.type.isMapable(any[p])) { return r; }
            else if (i !== pa.length-1) { any = jet.type.key.set(any, p, getForKey(any[p], pa[i+1]));}
            else if (val == null) { jet.type.key.rem(any, p);}
            else { jet.type.key.set(any, p, val);}
        };

        for (let [any, p] of pb) {
            if (jet.type.isFull(any[p])) { break; }
            else { jet.type.key.rem(any, p); }
        };
        return r;
    },
    deflate:function(...any) {
        const result = {};
        any.map(a=>jet.Map.it(a, (v,p)=>result[p] = v, true));
        return result;
    },
    inflate:function(any) {
        const result = {};
        jet.Map.it(any, (v,p)=>jet.Map.put(result, p, v, true));
        return result;
    },
    merge:function(...any) { return jet.Map.inflate(jet.Map.deflate(...any)); },
    clone:function(any, deep) { return jet.Map.of(any, _=>_, deep); },
    audit:new Complex(
        (...any)=>_audit(false, ...any),
        {
            full:(...any)=>_audit(true, ...any),
        }
    ),
    match:function(to, from, fce) {
        fce = jet.Fce.tap(fce);
        _audit(true, to, from).map(path=>{
            jet.Map.put(to, path, fce(jet.Map.dig(to, path), jet.Map.dig(from, path), path), true);
        });
        return to;
    },
    compare: function(...any) {
        const res = new Set();
        _audit(false, ...any).map(path=>{
            if (new Set(any.map(a=>jet.Map.dig(a, path))).size > 1) {
                const parr = path.split(".");
                parr.map((v,k)=>res.add(parr.slice(0, k+1).join(".")));
            }
        })
        return Array.from(res);
    },
    melt(any, comma) {
        let j = "", c = jet.Str.to(comma);
        if (!jet.type.isMapable(any)) { return jet.Str.to(any, c); }
        jet.Map.it(any, v=>{ v = jet.Map.melt(v, c); j += v ? (j?c:"")+v : "";});
        return j;
    },
}

export default jet.type.define("Map", Map, {
    rank:-1,
    is:x=>x instanceof Map,
    copy:x=>new Map(x),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    pairs:x=>x.entries(),
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    rem:(x,k)=>x.delete(k),
}, custom);