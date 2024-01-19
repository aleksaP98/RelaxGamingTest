import Container from "./container.js";
import Spirte from "./sprite.js";

export default class Button extends Container{
    constructor(onClickCallback, texture){
        super()
        this._createButton(onClickCallback, texture);
    }

    _createButton = (onClickCallback, texture) => {
        if(!onClickCallback)
        {
            return console.log("Missing callback for onClick")
        }
        if(texture){
            this.background = new Spirte(texture);
            this.background._initialSetup();
        }
        else{
            this.background = new PIXI.Graphics();
            this.background.beginFill(0x3498db); 
            this.background.drawRect(0, 0, 150, 150);
            this.background.endFill();
        }
        this.eventMode = "static";
        
        this.addChild(this.background);
        this.on('pointerdown', onClickCallback);
        this.on('mouseover', this._onMouseOver);
        this.on('mouseout', this._onMouseOut);
    }

    _onMouseOver = () =>{
        document.body.style.cursor = 'pointer';
    }

    _onMouseOut = () =>{
        document.body.style.cursor = 'auto';
    }
}