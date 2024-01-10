import Model from "../models/symbol.js";

export default class Symbol extends PIXI.Container{
    _yOffsets = {
        0: -160,
        1: 0,
        2: 160
    }
    _baseSpinningOffset = 320;

    constructor(reel, symbolIndex){
        super();
        if(reel && symbolIndex >= 0){
            this._createModel(reel, symbolIndex);
            this._createPresentation();
        }
        else{
            this._createSpinningSymbol(symbolIndex)
        }
    }

    _getRandomName = () => {
        const randomIndex = Math.floor(Math.random() * window.game.config.symbols.length) + 1;
        return `sym${randomIndex}`;
    }

    _createModel = (reel, symbolIndex) => {
        const name = this._getRandomName();
        this.model = new Model(reel, symbolIndex, name);
    }

    _createPresentation = () => {
        const texture = window.game.assetsController.getAsset(this.model.name);
        this.static = new PIXI.Sprite(texture)
        this.static.anchor.set(0.5, 0.5);
        this.y +=  this._yOffsets[this.model.index];
        this.addChild(this.static);
    }

    _createSpinningSymbol = (index) => {
        const randomName = this._getRandomName();
        const texture = window.game.assetsController.getAsset(randomName);
        this.spinningSymbol = new PIXI.Sprite(texture)
        this.spinningSymbol.anchor.set(0.5, 0.5);
        this.y -= this._baseSpinningOffset + index * 160;
        this.initialY = this.y;
        this.addChild(this.spinningSymbol);
    }

}