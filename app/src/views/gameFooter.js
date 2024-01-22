/**
 * Game Footer View
 * Holds the other footer elements as its children
 */
export default class GameFooter extends PIXI.Container{
    constructor(){
        super();
        this._createFooter();
    }

    _createFooter = () => {
        const footerBackground = new PIXI.Graphics();
        footerBackground.alpha = 0.5;
        footerBackground.beginFill(0xFFFFFF); // Fill color
        footerBackground.drawRect(0, 0, 1920, 100); // Rectangle coordinates and size
        footerBackground.endFill();
        this.y =  850;
        this.addChild(footerBackground);
    }
}