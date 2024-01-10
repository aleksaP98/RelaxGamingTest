export default class Button extends PIXI.Container{
    constructor(onClickCallback, width, height){
        super()
        this._createButton(onClickCallback, width, height);
    }

    _createButton = (onClickCallback, width, height) => {
        if(!onClickCallback)
        {
            return console.log("Missing callback for onClick")
        }     
        this.background = new PIXI.Sprite(window.game.assetsController.getAsset("spinButton"));
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