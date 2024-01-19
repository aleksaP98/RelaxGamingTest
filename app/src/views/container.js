export default class Container extends PIXI.Container{
    constructor(){
        super()
    }

    //This will be called in every class after any x or y modifications
    _initialSetup = () => {
        this.initialX = this.x;
        this.initialY = this.y;
    }
}