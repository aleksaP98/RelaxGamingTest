import Model from '../models/reel.js';
import Container from './container.js';
import Graphics from './graphics.js';
import Symbol from './symbol.js';

export default class Reel extends Container{
    _xOffsets = {
        0: -400,
        1: -200,
        2: 0,
        3: 200,
        4: 400
    }

    _maskWidth = 210;
    _maskHeight = 490;

    outcomeSymbols = [];
    spinningSymbols = [];

    constructor(options){
        super();
        this._createModel(options.index);
        this._createView(options.backgroundTexture);
        this._initialSetup();
    }

    _createModel = (index) => {
        this.model = new Model(index);
    }

    _createView = (texture) => {
        if(texture && texture instanceof PIXI.Texture){
            const background = new PIXI.Sprite(texture)
            background.anchor.set(0.5, 0.5);
            this.x += this._xOffsets[this.model.index];
            this.addChild(background);
        }
    }

    createMask = () => {
        const mask = new Graphics
        const maskX = -this._maskWidth * 1 / 2
        const maskY = -this._maskHeight * 1 / 2

        mask.beginFill(0xFFFFFF); // Fill color
        mask.drawRect(maskX, maskY, this._maskWidth, this._maskHeight); // Rectangle coordinates and size
        mask.endFill();
        mask._initialSetup()
        this.addChild(mask)
        this.mask = mask;
    }

    createInitialReelSet = () => {
        for(let i = 0; i< window.game.config.reels.spinningSymbols; i++){
            const symbol = new Symbol(this.model, i)
            this.spinningSymbols.push(symbol);
            this.addChild(symbol);
        }
    }

    createNewReelSet = (outcomeSymbols, newSymbols) => {
        for(let i = 0; i< window.game.config.reels.spinningSymbols; i++){
            const reelSyms = outcomeSymbols.find((reelSymbols, reelIndex) => reelIndex === this.model.index);
            const outcomeSym = reelSyms?.find((symbol, symbolIndex) => symbolIndex === i)

            const reelNewSyms = newSymbols.find((reelSymbols, reelIndex) => reelIndex === this.model.index);
            const newSym = reelNewSyms?.find((symbol, symbolIndex) => symbol.model.index === i)


            const symbol = outcomeSym || newSym || new Symbol(this.model, i)
            this.spinningSymbols.push(symbol);
            this.addChild(symbol);
        }
    }

    setReelOutcomeSymbols = (outcomeSymbols) => {
        this.outcomeSymbols = outcomeSymbols;
    }

    destorySpinningSymbol = () => {
        this.spinningSymbols.forEach(symbol => symbol.destroy());
        this.spinningSymbols = [];
    }
}