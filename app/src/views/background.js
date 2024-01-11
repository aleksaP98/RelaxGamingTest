export default class Background extends PIXI.Sprite{
    constructor(asset){
        if(asset && asset instanceof PIXI.Texture){
            super(asset);
        }
        else{
            console.log(`asset is not missing or not a texture ${asset}`);
        }
    }
}