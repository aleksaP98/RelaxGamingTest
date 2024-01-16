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
        for(let i = 0; i < reelSize; i++){
            this.outcomeSymbols[i] = []
        }
    }

    setNewSymbols = () => {
        return  new Promise((resolve, reject) => {
            const mainTimeline = gsap.timeline({onComplete: resolve})
            mainTimeline.call(() => this.destroySymbols());
            mainTimeline.call(() => this.createNewReelSet());
        })
    }

    
    getOutcomeSymbols = () => {
        return this.outcomeSymbols;
    }

    createNewReelSet = () => {
        this.reels.reels.forEach(reel => reel.createNewReelSet(this.outcomeSymbols));
    }

    destroySymbols = () => {
        this.reels.reels.forEach(reel => reel.destorySpinningSymbol());
    }

}