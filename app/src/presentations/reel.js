import Model from '../models/reel.js';

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
}