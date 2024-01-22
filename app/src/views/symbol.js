import Model from "../models/symbol.js";
import Reel from "./reel.js";

/**
 * Symbol view
 * Represents a single symbol on the reels.
 * Has its own Model which is very important.
 */
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
            this._createStatic();
        }
    }

    /**
     * Get a random symbol name
     * @returns {String}
     */
    _getRandomName = () => {
        const randomIndex = Math.floor(Math.random() * window.game.config.symbols.length) + 1;
        return `sym${randomIndex}`;
    }

    /**
     * Create the symbol model
     * @param {Reel} reel Actual reel class that this symbol belongs to
     * @param {Number} symbolIndex 
     * @param {String} name 
     */
    _createModel = (reel, symbolIndex, name) => {
        this.model = new Model(reel, symbolIndex, name || this._getRandomName());
    }

    /**
     * Create the symbol static image
     * Set Y based on the symbol index
     */
    _createStatic = () => {
        const texture = this._getTexutre(this.model.name);
        this.static = new PIXI.Sprite(texture)
        this.static.anchor.set(0.5, 0.5);
        this.y -= this._baseSpinningOffset + this.model.index * 160;
        this.addChild(this.static);
    }

    _getTexutre = (name) => {
        return window.game.assetsController.getAsset(name || this._getRandomName());
    }
}