/**
 * Payout View
 * Has the black overlay, and the actual value as its children.
 */
export default class Payout extends PIXI.Container{
    constructor(){
        super()
        this.createOverlayView();
        this.createPayoutView();
        this.alpha = 0;
    }

    createOverlayView = () => {
        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0x000000)
        this.overlay.drawRect(0, 0, 1920, 1080);
        this.overlay.endFill();
        this.overlay.alpha = 0.7;

        this.addChild(this.overlay);
    }

    createPayoutView = () => {
        const style = {
            fontFamily: 'Arial',
            fontSize: 100,
            fill: 0xFFFF00,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 2
        }
        this.payoutValue = new PIXI.Text(0, style);
        this.payoutValue.x = window.game.app.screen.width / 2;
        this.payoutValue.y = window.game.app.screen.height / 2;
        this.payoutValue.anchor.set(0.5, 0.5);
        this.addChild(this.payoutValue);
    }


    setPayout = (value) => {
        this.payoutValue.text = value;
    }
    
}