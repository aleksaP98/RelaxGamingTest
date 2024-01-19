import Container from './container.js';
import ReelView from './reel.js';

export default class Reels extends Container{
    reels = [];

    _centerX = window.game.app.screen.width / 2;
    _centerY = window.game.app.screen.height / 2;


    //This class is used as a container for single reels
    constructor(){
        super();
        this._updatePosition();
        this._createReels();
        this._createReelsFrame();
        this._createInitialSymbols();
        this._initialSetup();
    }

    _createReels = () => {
        const reelSize = window.game.config.reels?.numberOfReels || 5;
        
        for(let i = 0; i < reelSize; i++){
            const backgroundTexture =  window.game.assetsController.getAsset('reelBackground')
            const reel = new ReelView({index: i, backgroundTexture});
            this.reels.push(reel);
            this.addChild(reel);
            reel.createMask()
        }
    }
    _createReelsFrame = () => {
        if(window.game.assetsController.getAsset('reelsFrame')){
            const frame = new PIXI.Sprite(window.game.assetsController.getAsset('reelsFrame'));
            frame.anchor.set(0.5, 0.5);
            this.addChild(frame);
        }
    }

    _createInitialSymbols = () => {
        this.reels.forEach(reel => {
            reel.createInitialReelSet();
        })
    }


    _updatePosition = () => {
        this.x =  this._centerX;
        this.y =  this._centerY;
    }
}