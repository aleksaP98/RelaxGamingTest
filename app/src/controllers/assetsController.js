/**
 * Assets Controller
 * Main purpose of this controller is to handle assets.
 * Currently it only loads all assets (can be upgraded to support lazy loading)
 */
export default class AssetsController{
    name = "";

    constructor(name){
        this.name = name ||  "assetsController"
    }

    /**
     * Handle asset loading by creating a pixi texture of every aset in the game config.
     * For this game we only need images, but this would need to change if we were to add sounds or other file formats
     * Resolves the promise when all images are set.
     * @returns {Promise}
     */
    _loadAssets = () =>{
        try{
            return new Promise((resolve, reject) => {
                if(window.game.config.assets && Array.isArray(window.game.config.assets)){
                    window.game.config.assets.forEach(asset => {
                        if(!asset.lazyLoad)
                        {
                            this[asset.name] = PIXI.Texture.from(asset.path);
                        }
                    });
                    resolve();
                }
                else{
                    reject('Assets missing in config');
                }
            })
        }
        catch(error){
            console.log(error)
        }    
    }

    /**
     * 
     * @param {String} name 
     * @returns {PIXI.Texture}
     */
    getAsset = (name) => { 
        return this[name];
    }
}