import Complex from "./Complex";

const jet = {};

const magicMethod = ["only", "full", "tap", "pull", "is", "to", "copy", "rnd"];

const types = {};
const primitives = {};

function _isInstance(any) {
    const t = typeof any;
    return any != null && (t === "function" || t === "object");
}
function _isInstanceOf(constructor, any) { return any instanceof constructor; } //is instance comparing
function _isFull(any, vals) {
    if (!vals) { return (any === false || any === 0 || !!any); }
    for (let v of vals(any)) { if (v != null) { return true; }}
    return false;
}

function _id(primitive, any, all, withDefinition) {
    const td = typeof any, r = all ? [] : undefined;
    const list = primitives[primitive || td];
    if (list) {
        for (let t of list) {
            if (!t.is(any, td)) { continue; }
            let n = withDefinition ? t : t.name;
            if (r) { r.push(n) } else { return n; }
        }
    }
    if (withDefinition) { return r; } else if (!r) { return td; } else { r.push(td); return r; }
}

function _is(name, any, inclusive) { //REPAIR
    const t = types[name];
    if (t) { return inclusive ? _id(t.primitive, any, true).includes(name) : name === _id(t.primitive, any); }
    return _isInstance(name) ? _isInstanceOf(name, any) : false;
}

//0 = only, 1 = full, 2 = tap, 3 = pull
function _factory(name, mm, ...args) {
    const n = _isInstance(name);
    const t = types[name];

    if (n && mm > 0) { console.warn("Unable execute '"+magicMethod[mm]+"' - unavailable for constructors"); return; }
    if (name && !n && !t) { console.warn("Unable execute '"+magicMethod[mm]+"' - unknown type '"+name+"'"); return; }
    if (!name && mm !== 1) { console.warn("Unable execute '"+magicMethod[mm]+"' - missing type"); return; }

    for (let a of args) {
        if (!n) {
            const at = _id(t ? t.primitive : null, a, false, true);
            if ((!name || (at && at.name === name)) && (mm !== 1 || (at && at.full(a) || (!at && _isFull(a))))) {
                return mm === 3 ? at.copy(a) : a;
            }
        }
        else if (_isInstanceOf(name, a)) { return a; }
    }
    if (mm > 1) { return t.create(); }
}

function _copy(any, ...args) {
    const t = _id(null, any, false, true);
    if (!t) { console.warn("Unable execute 'copy' unknown type '"+t.name+"'"); return; }
    return t.copy(any, ...args);
}

function _to(name, any, ...args) {
    const t = types[name];
    if (!t) { console.warn("Unable execute 'to'. Unknown type '"+name+"'"); return; }
    const at = _id(null, any, false, true);
    if (!at) { return t.create(); }
    if (t.name === at.name) { return any; }
    const exe = at.to[name] || at.to["*"]; 
    return exe ? _to(name, exe(any, ...args), ...args) : t.create(any);
}

function _toDefine(from, to, exe) {
    const tt = typeof to;
    const conv = types[from].to;
    if (tt === "function") { conv["*"] = to; }
    else if (tt === "object" && Array.isArray(to)) { for (let i in to) { conv[to[i]] = exe; } }
    else if (tt === "object") { for (let i in to) { conv[i] = to[i]; } }
    else { conv[to] = exe; }
}

function _touch(any, op, ...args) { //REPAIR
    const t = _id(null, any, false, true);
    if (t && t[op]) { return t[op](any, ...args); }
}

function _rndKey(arr, min, max, sqr) { //get random element from array or string
    if (!arr) { return; }
    arr = Array.from(arr);
    const l = arr.length;
    return arr[Math.floor(jet.Num.rnd(jet.Num.frame(min||0, 0, l), jet.Num.frame(max||l, 0, l), sqr))];
};

jet.type = new Complex(
    any=>_id(null, any), 
    {
        all:any=>_id(null, any, true),
        detail:any=>jet[_id(null, any)],
        isFull:any=>{
            const t = _id(null, any, false, true);
            return t ? t.full(any) : _isFull(any);
        },
        isMapable:any=>{
            const t = _id(null, any, false, true);
            return t ? !!t.pairs : false;
        },
        full:(...a)=>_factory(null, 1, ...a),
        copy:(any, ...a)=>_copy(any, ...a),
        keys:any=>_touch(any, "keys"),
        vals:any=>_touch(any, "vals"),
        pairs:any=>_touch(any, "pairs"),
        key:new Complex((any, key)=>_touch(any, "get", key), {
            set:(any, key, val)=>_touch(any, "set", key, val),
            rem:(any, key)=>_touch(any, "rem", key),
            rnd:(any, min, max, sqr)=>{
                const t = _id(null, any, false, true);
                if (t.vals) { any = t.vals(any); } else if (typeof any !== "string") { return; }
                return _rndKey(any, min, max, sqr);
            }
        }),
        define:(name, constructor, opt, custom)=>{
            let { rank, create, is, full, copy, rnd, keys, vals, pairs, get, set, rem } = (opt || {});

            const err = "Jet type '" + name + "'";
            if (types[name]) {throw new Error(err+" is allready defined!!!");}
            if (jet[name]) {throw new Error(err+" is reserved!!!");}
            if (!constructor) {throw new Error(err+" missing constructor!!!");}
            if ((keys || vals || pairs) && !(keys && vals && pairs)) {throw new Error(err+" keys, vals or pairs missing!!!");}

            rank = rank || 0;
            create = create || ((...a)=>new constructor(...a));
            is = is || (any=>_isInstanceOf(constructor, any));
            full = full || (any=>_isFull(any, vals));
            copy = copy || (any=>any);
            rnd = rnd || create;

            const temp = create();
            const primitive = typeof temp;

            if (temp == null) { throw new Error(err+" 'create' didn't create anything"); }
            if (!is(temp, primitive)) { throw new Error(err+" 'is' doesn't match the create output"); }

            const fix = {
                is:(any, inclusive)=>inclusive ? is(any, typeof any) : _is(name, any),
                isFull:(any, inclusive)=>fix.is(any, inclusive) ? full(any) : false,
                to:new Complex((any, ...a)=>_to(name, any, ...a), {
                    define:(to, exe)=>_toDefine(name, to, exe)
                }),
                only:(...a)=>_factory(name, 0, ...a),
                full:(...a)=>_factory(name, 1, ...a),
                tap:(...a)=>_factory(name, 2, ...a),
                pull:(...a)=>_factory(name, 3, ...a),
                copy:(any, ...a)=>is(any, typeof any) ? copy(any, ...a) : undefined,
                rnd
            };

            if (pairs) {
                get = get || ((x, k)=>x[k]);
                set = set || ((x, k, v)=>x[k] = v);
                rem = rem || ((x, k)=>delete x[k]);

                fix.keys = any=>is(any, typeof any) ? keys(any) : undefined
                fix.vals = any=>is(any, typeof any) ? vals(any) : undefined
                fix.pairs = any=>is(any, typeof any) ? pairs(any) : undefined
                fix.key = new Complex((any, key)=>is(any, typeof any) ? get(any, key) : undefined, {
                    set:(any, key, val)=>is(any, typeof any) ? set(any, key, val) : undefined,
                    rem:(any, key)=>is(any, typeof any) ? rem(any, key) : undefined,
                    rnd:(any, min, max, sqr)=>is(any, typeof any) ? _rndKey(vals(any), min, max, sqr) : undefined,
                });
            }

            const list = primitives[primitive] || (primitives[primitive] = []);

            list.push(types[name] = { rank, name, constructor, primitive, is, create, full, copy, keys, vals, pairs, get, set, rem, to:{} });

            list.sort((a,b)=>b.rank-a.rank);

            return jet[name] = new Complex(create, fix, custom);
        },
    },
);

export default jet;