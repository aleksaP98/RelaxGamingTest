export default class Graphics extends PIXI.Graphics{
    constructor(){
        super()
    }

    _initialSetup = () => {
        this.initialX = this.x;
        this.initialY = this.y;
    }
}