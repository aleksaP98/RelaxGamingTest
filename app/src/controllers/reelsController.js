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
        return this._createSpinningAnimation()
    }

    _createSpinningAnimation = () => {
        console.log('reels spinning')
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline({onComplete: resolve});
            const symbolTimelines = this.reels.reels.map(reel => reel.spinningSymbols.map(symbol => gsap.timeline().to(symbol, {duration: 1, y: symbol.y + 4320})))
            timeline.add(symbolTimelines);
        }) 
    }

}