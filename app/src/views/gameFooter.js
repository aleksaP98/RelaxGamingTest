import Container from "./container.js";

export default class GameFooter extends Container{
    constructor(){
        super();
        this._createFooter();
        this._initialSetup();
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