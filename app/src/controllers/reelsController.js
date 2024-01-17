import Symbol from "../views/symbol.js";

export default class ReelsController{
    _indexConversion = {
        27: 0,
        28: 1,
        29: 2
    }
    constructor(){
    
    }

    addPresentation = (presentation) => {
        if(!presentation.name || !presentation.class){
            console.log("CANT ADD PRESENTATION")
        }
        else{
            this[presentation.name] = presentation.class;
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
                this.newSymbols[reelIndex][symbolIndex] = new Symbol(this.reels.reels[reelIndex], realSymbolIndex, newSymbolName)
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


    destroySymbols = () => {
        this.reels.reels.forEach(reel => reel.destorySpinningSymbol());
    }

}