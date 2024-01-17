export default class Bet extends PIXI.Container{
    constructor(options = {}){
        super()
        this._createBetText(options);
        this._createBetValue(options);
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
        text.y = 25
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
        this.betValue.y = 25
        this.betValue.x = 1025
        this.addChild(this.betValue);
    }

    updateBetValue = (newBet) => {
        this.betValue.text = newBet;
    }
}