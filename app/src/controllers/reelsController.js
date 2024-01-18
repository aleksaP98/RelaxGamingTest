import Symbol from "../views/symbol.js";

export default class ReelsController{
    _indexConversion = {
        27: 0,
        28: 1,
        29: 2
    }
    constructor(){
    
    }

    addView = (view) => {
        if(!view.name || !view.class){
            console.log("CANT ADD VIEW")
        }
        else{
            this[view.name] = view.class;
        }
    }

    spinReels = () => {
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline({onComplete: resolve});
            const symbolTimelines = this.reels.reels.map(reel => reel.spinningSymbols.map(symbol => gsap.timeline().to(symbol, {duration: 1, y: symbol.y + 4320})))
            timeline.add(symbolTimelines);
        }) 
    }

    setOutcomeSymbols = () => {
        return new Promise((resolve, reject) => {
            this._resetOutcomeSymbols();
            this._setNewOutcomeSymbols();
            window.game.gameModel.setOutcome();
            this.setNewSymbols()
            .then(resolve);
        })
    }

    _setNewOutcomeSymbols = () => {
        this.reels.reels.forEach((reel, reelIndex) => {
            reel.spinningSymbols.forEach((symbol, symbolIndex) => {
                if(symbolIndex >= 27){
                    const realSymbolIndex = this._indexConversion[symbolIndex];
                    this.outcomeSymbols[reelIndex][realSymbolIndex] = new Symbol(this.reels.reels[reelIndex], realSymbolIndex, symbol.model.name);
                }
            })
        })
    }

    _resetOutcomeSymbols = () => {
        const reelSize = window.game.config.reels.numberOfReels;
        this.outcomeSymbols = [];
        this.newSymbols = []
        for(let i = 0; i < reelSize; i++){
            this.outcomeSymbols[i] = []
            this.newSymbols[i] = []
        }
    }

    setNewSymbols = () => {
        return  new Promise((resolve, reject) => {
            const mainTimeline = gsap.timeline({onComplete: resolve})
            mainTimeline.call(() => this.destroySymbols());
            mainTimeline.call(() => this.createNewReelSet());
        })
    }

    createNewReelSet = () => {
        const outcomeSymbols = this.getOutcomeSymbols();
        const newSymbols = this.getNewSymbols();
        this.reels.reels.forEach(reel => reel.createNewReelSet(outcomeSymbols, newSymbols));
    }
    
    getOutcomeSymbols = () => {
        return this.outcomeSymbols;
    }

    getNewSymbols = () => {
        const newSymbols = window.game.gameModel.getNewSymbolObjects();
        const symbolsPerReel = window.game.config.reels.symbolsPerReel
        this.newSymbols.forEach((reel,reelIndex) => {
            for(let symbolIndex = 0; symbolIndex < symbolsPerReel; symbolIndex++){
                const newSymbolName =  newSymbols.find(newSym => newSym.reelIndex === reelIndex && newSym.symbolIndex === symbolIndex)?.symbolName;
                const realSymbolIndex = Number(Object.keys(this._indexConversion)[symbolIndex]);
                this.newSymbols[reelIndex][symbolIndex] = new Symbol(this.reels.reels[reelIndex], realSymbolIndex, newSymbolName.name)
            }
        })
        return this.newSymbols;
    }

    animateWins = () => {
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline({onComplete: resolve})
            const symbolTimelines =  window.game.gameModel.getWinningSymbols().map(reelSymbolWins => reelSymbolWins.map(winSymbol => {
                if(winSymbol){
                    return gsap.timeline().to(winSymbol.scale, {duration: 1, x: 1.5, y: 1.5})
                    .to(winSymbol.scale, {duration: 0.5, x: 1, y: 1})
                }
            }))
            timeline.add(symbolTimelines)
        })
    }

    animatePayout = () => {
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline()
            const resetTimeline = gsap.timeline({onComplete: resolve})

            timeline.to(this.payout, {duration: 0.5, alpha: 1})
            timeline.call(this.payout.setPayout, [window.game.gameModel.getPayout()], this.payout);
            timeline.add("start")
            timeline.to(this.payout.payoutValue, {duration: 1, x:260, y: 890}, "start");
            timeline.to(this.payout.payoutValue.scale, {duration: 0.5, x: 0, y: 0}, "start+=0.5");
            timeline.to(this.payout, {duration: 0.5, alpha: 0})

            resetTimeline.call(this.resetPayoutValuePosition, null, 0);

            timeline.add(resetTimeline);
        })
    }

    resetPayoutValuePosition = () => {
        const centerX = window.game.app.screen.width / 2
        const centerY = window.game.app.screen.height / 2

        this.payout.payoutValue.position.set(centerX, centerY);
        this.payout.payoutValue.scale.set(1, 1);
    }

    destroySymbols = () => {
        this.reels.reels.forEach(reel => reel.destorySpinningSymbol());
    }

}