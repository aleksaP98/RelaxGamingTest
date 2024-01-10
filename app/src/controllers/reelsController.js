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
        window.game.animationController.animate(this.spinReelsAnimation);
    }

    spinReelsAnimation = (deltaTime) => {
        console.log('reels spinning')
        this.reels.reels.forEach(reel => {
            reel.spinningSymbols.forEach(symbol => {
                symbol.y += 10;
            })
        })
    }

    stopReels = () => {
        window.game.animationController.stopAnimation(this.spinReelsAnimation);
        this.reels.reels.forEach(reel => {
            reel.spinningSymbols.forEach(symbol => {
                symbol.y = symbol.initialY
            })
        })
    }
    

}