export default class Background extends PIXI.Sprite{
    constructor(){
        const asset = window.game.assetsController.getAsset('baseBackground');
        if(asset){
            super(asset);
        }
        
    }
}