export default class AnimationController extends PIXI.Ticker{
    constructor(){
        super()
        this.stop();
    }

    animate = (animationCallback) => {
        this.add(animationCallback);
        this.start();
    }

    stopAnimation = (animationCallback) => {
        this.remove(animationCallback);
        this.stop();
    }
}