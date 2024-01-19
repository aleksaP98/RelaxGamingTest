export default class Spirte extends PIXI.Sprite{
    constructor(texture){
        super(texture);
    }

    //This will be called in every class after any x or y modifications
    _initialSetup = () => {
        this.initialX = this.x;
        this.initialY = this.y;
    }
}