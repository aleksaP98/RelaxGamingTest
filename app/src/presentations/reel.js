import Model from '../models/reel.js';
import Symbol from './symbol.js';

export default class Reel extends PIXI.Container{
    _xOffsets = {
        0: -400,
        1: -200,
        2: 0,
        3: 200,
        4: 400
    }

    _maskWidth = 210;
    _maskHeight = 490;
    
    _centerX = window.game.app.screen.width / 2;
    _centerY = window.game.app.screen.height / 2;

    outcomeSymbols = [];
    spinningSymbols = [];

    constructor(index){
        super();
        this._createModel(index);
        this._createPresentation();
        this._createMask();
    }

    _createModel = (index) => {
        this.model = new Model(index);
    }

    _createPresentation = () => {
        const asset = window.game.assetsController.getAsset('reelBackground');
        if(asset){
            const background = new PIXI.Sprite(asset)
            background.anchor.set(0.5, 0.5);
            this.x =  this._centerX + this._xOffsets[this.model.index];
            this.y =  this._centerY
            this.addChild(background);
        }
    }

    _createMask = () => {
        const mask = new PIXI.Graphics()
        const maskX = -this._maskWidth * 1 / 2 + this.x
        const maskY = -this._maskHeight * 1 / 2 + this.y

        mask.beginFill(0xFFFFFF); // Fill color
        mask.drawRect(maskX, maskY, this._maskWidth, this._maskHeight); // Rectangle coordinates and size
        mask.endFill();
        this.mask = mask;
    }

    createInitialSymbols = () => {
        for(let i = 0; i< window.game.config.reels.spinningSymbols; i++){
            const symbol = new Symbol(this.model, i)
            this.spinningSymbols.push(symbol);
            this.addChild(symbol);
        }
    }

    generateSymbols = () => {
        
    }
}