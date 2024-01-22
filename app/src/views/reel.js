import Model from '../models/reel.js';
import Symbol from './symbol.js';

/**
 * Reel View
 * This view represents a single reel that will be added to a Reels Container when created
 * Reel view knows about all its symbols.
 */
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

    spinningSymbols = [];

    constructor(options){
        super();
        this._createModel(options.index);
        this._createView(options.backgroundTexture);
    }

    /**
     * Create the model for the reel view
     * @param {Number} index Reel index
     */
    _createModel = (index) => {
        this.model = new Model(index);
    }

    /**
     * Create the actual reel background
     * @param {PIXI.Texture} texture 
     */
    _createView = (texture) => {
        if(texture && texture instanceof PIXI.Texture){
            const background = new PIXI.Sprite(texture)
            background.anchor.set(0.5, 0.5);
            this.x += this._xOffsets[this.model.index];
            this.addChild(background);
        }
    }

    /**
     * Create the reel mask, this method is not called in the constructor because at that point the parent is still unknown.
     */
    createMask = () => {
        const mask = new PIXI.Graphics()
        const maskX = -this._maskWidth * 1 / 2 + this.parent.x + this.x
        const maskY = -this._maskHeight * 1 / 2 + this.parent.y 

        mask.beginFill(0xFFFFFF); // Fill color
        mask.drawRect(maskX, maskY, this._maskWidth, this._maskHeight); // Rectangle coordinates and size
        mask.endFill();
        this.mask = mask;
    }

    /**
     * Create the initial reel set when the game loads
     */
    createInitialReelSet = () => {
        for(let i = 0; i< window.game.config.reels.spinningSymbols; i++){
            const symbol = new Symbol(this.model, i)
            this.spinningSymbols.push(symbol);
            this.addChild(symbol);
        }
    }

    /**
     * Create the new reel set (new spinning symbols)
     * @param {Array<Array<Symbol>>} outcomeSymbols 
     * @param {Array<Array<Symbol>>} newSymbols 
     */
    createNewReelSet = (outcomeSymbols, newSymbols) => {
        for(let i = 0; i< window.game.config.reels.spinningSymbols; i++){
            //This will only find the outcome symbol if the indexes match, so only for indexes 0, 1 and 2
            const reelSyms = outcomeSymbols.find((reelSymbols, reelIndex) => reelIndex === this.model.index);
            const outcomeSym = reelSyms?.find((symbol, symbolIndex) => symbolIndex === i)

            //This will find the next symbols if the indexes match, so only for indexes 27, 28 and 29
            const reelNewSyms = newSymbols.find((reelSymbols, reelIndex) => reelIndex === this.model.index);
            const newSym = reelNewSyms?.find((symbol, symbolIndex) => symbol.model.index === i)
            
            //Outcome symbol has the advantage, then the new symbol then everything in between
            //Outcome symbol and new symbol will never overlap
            const symbol = outcomeSym || newSym || new Symbol(this.model, i)
            this.spinningSymbols.push(symbol);
            this.addChild(symbol);
        }
    }

    /**
     * Destroy all the current spinning symbols.
     * This is better than just reseting their Y value
     */
    destorySpinningSymbol = () => {
        this.spinningSymbols.forEach(symbol => symbol.destroy());
        this.spinningSymbols = [];
    }
}