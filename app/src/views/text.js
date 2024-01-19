export default class Text extends PIXI.Text{
    constructor(options){
        super(options.text, options.style);
    }

    //This will be called in every class after any x or y modifications
    _initialSetup = () => {
        this.initialX = this.x;
        this.initialY = this.y;
    }
}