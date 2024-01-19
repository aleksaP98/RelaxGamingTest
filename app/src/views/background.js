import Spirte from "./sprite.js";

export default class Background extends Spirte{
    constructor(asset){
        if(asset && asset instanceof PIXI.Texture){
            super(asset);
            this._initialSetup();
        }
        else{
            console.log(`asset is not missing or not a texture ${asset}`);
        }
    }
}