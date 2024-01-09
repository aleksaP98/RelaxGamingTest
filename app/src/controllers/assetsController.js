
export default class AssetsController{

    constructor(){
        
    }

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

    getAsset = (name) => { 
        return this[name];
    }
}