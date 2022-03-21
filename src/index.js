
import jet from "./jet";
import Obj from "./types/Obj.js";
import Bol from "./types/Bol.js";
import Num from "./types/Num.js";
import Str from "./types/Str.js";
import Symbol from "./types/Symbol";
import Fce from "./types/Fce.js";
import RegExp from "./types/RegExp.js";
import Date from "./types/Date.js";
import NaN from"./types/NaN.js";
import Err from "./types/Err.js";
import Prom from "./types/Prom.js";
import Arr from "./types/Arr.js";
import Set from "./types/Set.js";
import Map from "./types/Map.js";

import ComplexConstructor from "./Complex";

//CUSTOM
const type = jet.type;
const Complex = jet.type.define("Complex", ComplexConstructor);

export default jet;
export {
    type,
    Obj,
    Bol,
    Num,
    Str,
    Symbol,
    Fce,
    RegExp,
    Date,
    NaN,
    Err,
    Prom,
    Arr,
    Set,
    Map,
    Complex,
}