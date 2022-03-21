import jet from "../jet";

const custom = {
    run:function(any, ...args) {
        if (jet.Fce.is(any)) { return any(...args); }
        return jet.Map.of(any, f=>jet.Fce.run(f, ...args));
    },
    measure:function(fces, args, repeat) {
        const rep = repeat || 100, ladder = [], statis = {};
            
        for (var i=1; i<=rep; i++) { 
            for (let fce of fces) {
                let stat = statis[fce.name];
                    
                if (!stat) {
                    statis[fce.name] = stat = {fce:fce.name, runtimeAvg:0, runtimeSum:0};
                    ladder.push(stat);
                };
                
                let now = performance.now();
                let result = fce.apply(this, args);
                let runtime = performance.now()-now;
                    
                stat.runtimeSum += runtime;
                stat.runtimeAvg = stat.runtimeSum / i;
            };
        };
        
        ladder.sort((a,b) => a.runtimeSum-b.runtimeSum);
        const best = ladder[0];
        
        for (let stat of ladder) {
            let factor = stat.runtimeSum / best.runtimeSum - 1;
            if (factor > 0) {
                stat.slowFactor = "+" + (Math.round(factor * 10000) / 100) + "%";
            }		
        }
    
        return {repeated:rep, ladder}
    }
}

export default jet.type.define("Fce", Function, {
    rank:-4,
    is:(x,t)=>t === "function",
    create:Function,
    copy:x=>Object.defineProperties(({[x.name]:(...a)=>x(...a)})[x.name], Object.getOwnPropertyDescriptors(x)),
}, custom);


jet.Fce.to.define({
    "*":(fce, ...args)=>fce(...args),
    Prom:async (fce, ...args)=>await fce(...args),
});