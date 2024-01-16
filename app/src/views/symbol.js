import Model from "../models/symbol.js";

export default class Symbol extends PIXI.Container{
    _yOffsets = {
        0: -160,
        1: 0,
        2: 160
    }
    _baseSpinningOffset = -160;

    constructor(reel, symbolIndex, name){
        super();
        if(reel && symbolIndex >= 0){
            this._createModel(reel, symbolIndex, name);
            this._createStaticPresentation();
        }
    }

    _getRandomName = () => {
        const randomIndex = Math.floor(Math.random() * window.game.config.symbols.length) + 1;
        return `sym${randomIndex}`;
    }

    _createModel = (reel, symbolIndex, name) => {
        this.model = new Model(reel, symbolIndex, name || this._getRandomName());
    }

    _createStaticPresentation = () => {
        const texture = this._getTexutre(this.model.name);
        this.static = new PIXI.Sprite(texture)
        this.static.anchor.set(0.5, 0.5);
        this.y -= this._baseSpinningOffset + this.model.index * 160;
        this.initialY = this.y;
        this.addChild(this.static);
    }

    _getTexutre = (name) => {
        return window.game.assetsController.getAsset(name || this._getRandomName());
    }

    resetTexture = () => {
        this.static.texture = this._getTexutre();
    }

}