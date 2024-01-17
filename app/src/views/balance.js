export default class Balance extends PIXI.Container{
    constructor(options = {}){
        super()
        this._createBalanceText(options);
        this._createBalanceValue(options);
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

        const text = new PIXI.Text("BALANCE:", style)
        text.y = 25
        text.x = 120
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

        this.balanceValue = new PIXI.Text(options.initialBalance || 1000, style)
        this.balanceValue.y = 25
        this.balanceValue.x = 250
        this.addChild(this.balanceValue);
    }

    updateBalance = (value) => {
        this.balanceValue.text = value;
    }
}