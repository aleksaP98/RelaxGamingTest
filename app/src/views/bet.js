import Button from "./button.js";

export default class Bet extends PIXI.Container{
    constructor(options = {}){
        super()
        this._createBetText(options);
        this._createBetValue(options);
        this._createBetButtons(options);
        this._updatePosition();
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
        this.betValue.x = 100
        this.addChild(this.betValue);
    }

    _createBetButtons = (options) => {
        const betIncrease = new Button(options.onBetIncrease, window.game.assetsController.getAsset('betIncrease'));
        const betDecrease = new Button(options.onBetDecrease, window.game.assetsController.getAsset('betDecrease'));

        betIncrease.x = 150
        betDecrease.x = -80
        betIncrease.y = -10
        betDecrease.y = -10

        this.addChild(betIncrease)
        this.addChild(betDecrease)
    }

    _updatePosition = () => {
        this.y = 20
        this.x = window.game.app.screen.width / 2 + 450
    }

    updateBetValue = (newBet) => {
        this.betValue.text = newBet;
    }
}