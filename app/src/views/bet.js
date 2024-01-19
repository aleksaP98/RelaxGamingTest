import Container from "./container.js";

export default class Bet extends Container{
    constructor(options = {}){
        super()
        this._createBetText(options);
        this._createBetValue(options);
        this._updatePosition();
        this._initialSetup();
    }

    _createBetText = (options) => {
        const style = options.style || {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 2
        }

        const text = new PIXI.Text("BET:", style)
        text.x = 950
        this.addChild(text);
    }

    _createBetValue = (options = {}) => {
        const style = options.style || {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 2
        }

        this.betValue = new PIXI.Text(options.initialBet || 1, style)
        this.betValue.x = 1025
        this.addChild(this.betValue);
    }

    _updatePosition = () => {
        this.y = 20
    }

    updateBetValue = (newBet) => {
        this.betValue.text = newBet;
    }
}