import ReelView from './reel.js';

/**
 * Reels View
 * This view is used as a container for single Reel classes
 * Doesnt have any other special functions
 */
export default class Reels extends PIXI.Container{
    reels = [];

    _centerX = window.game.app.screen.width / 2;
    _centerY = window.game.app.screen.height / 2;

    constructor(){
        super();
        this._updatePosition();
        this._createReels();
        this._createReelsFrame();
        this._createInitialSymbols();
    }

    /**
     * Creates the single Reel classes and stores them in this.reels array for easy access
     */
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

    /**
     * Create the reels frame
     */
    _createReelsFrame = () => {
        if(window.game.assetsController.getAsset('reelsFrame')){
            const frame = new PIXI.Sprite(window.game.assetsController.getAsset('reelsFrame'));
            frame.anchor.set(0.5, 0.5);
            this.addChild(frame);
        }
    }

    /**
     * Instruct each reel to create its initial symbols
     */
    _createInitialSymbols = () => {
        this.reels.forEach(reel => reel.createInitialReelSet())
    }

    _updatePosition = () => {
        this.x =  this._centerX;
        this.y =  this._centerY;
    }
}