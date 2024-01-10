import ReelPresentation from './reel.js';

export default class Reels extends PIXI.Container{
    reels = [];
    //This class is used as a container for single reels
    constructor(){
        super();
        this._createReels();
    }

    _createReels = () => {
        const reelSize = window.game.config.reels?.size || 5;
        
        for(let i = 0; i < reelSize; i++){
            const reel = new ReelPresentation(i);
            this.reels.push(reel);
            this.addChild(reel);
        }
    }
}