import jet from "../jet";


const custom = {
    swap: function(arr, to, from) {//swap position of two items in array
        arr = jet.Arr.tap(arr); 
        arr[to] = arr.splice(from, 1, arr[to])[0]; 
        return arr;
    }, 
    shuffle: function(arr) {//shuffle whole array
        arr = jet.Arr.tap(arr); 
        for (var i = arr.length - 1; i > 0; i--) {jet.Arr.swap(arr, Math.floor(Math.random() * (i + 1)), i);} return arr;
    },
    clean: function(arr, rekey, handler) {
        arr = jet.Arr.tap(arr);
        handler = jet.Fce.tap(handler, v=>v!=null?v:undefined);
        return rekey !== false ? arr.filter(handler) : jet.Map.of(arr, handler);
    },
};

export default jet.type.define("Arr", Array, {
    rank:-1,
    is:Array.isArray,
    copy:x=>Array.from(x),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    pairs:x=>x.entries()
}, custom);


jet.Arr.to.define({
    Fce:arr=>_=>arr,
    Bol:arr=>jet.Arr.isFull(arr),
    Num:arr=>arr.length,
    Str:(arr, comma)=>jet.Map.melt(arr, comma),
    Obj:arr=>Object.assign({}, arr),
    Prom: async arr=>arr,
    Err:(arr, comma)=>jet.Map.melt(arr, comma != null ? comma : " "),
    RegExp:(arr, comma)=>jet.Map.melt(arr, comma != null ? comma : "|")
});