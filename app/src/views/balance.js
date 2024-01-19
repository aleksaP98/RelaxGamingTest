import Container from "./container.js";
import Text from "./text.js";

export default class Balance extends Container{
    constructor(options = {}){
        super()
        this._createBalanceText(options);
        this._createBalanceValue(options);
        this._updatePosition();
        this._initialSetup();
    }

    _createBalanceText = (options) => {
        const style = options.style || {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 2
        }

        const text = new Text({text: "BALANCE:", style})
        text.x = 120
        text.id = "bal"
        text._initialSetup();
        this.addChild(text);
    }

    _createBalanceValue = (options = {}) => {
        const style = options.style || {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 2
        }

        this.balanceValue = new Text({text: options.initialBalance, style})
        this.balanceValue.x = 250
        this.balanceValue.id = "asd"
        this.balanceValue._initialSetup();
        this.addChild(this.balanceValue);
    }

    _updatePosition = () => {
        this.y = 20
    }

    updateBalance = (value) => {
        this.balanceValue.text = value;
    }
}