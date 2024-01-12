export default class ReelsController{

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
            const allSymbols = this.reels.reels.map(reel => reel.spinningSymbols.map(symbol => symbol));
            window.game.gameModel.setOutcomeSymbols(allSymbols);
            this.setNewSymbols()
            .then(resolve);
        })
    }

    setNewSymbols = () => {
        return  new Promise((resolve, reject) => {
            const mainTimeline = gsap.timeline({onComplete: resolve})
            mainTimeline.call(() => this.destroySymbols());
            mainTimeline.call(() => this.createNewReelSet());
        })
    }

    createNewReelSet = () => {
        this.reels.reels.forEach(reel => reel.createNewReelSet(window.game.gameModel.getOutcomeSymbols()));
    }

    destroySymbols = () => {
        this.reels.reels.forEach(reel => reel.destorySpinningSymbol());
    }

}