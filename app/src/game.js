import Application from "./presentations/app.js";
import AssetsController from "./controllers/assetsController.js";
import Background from "./presentations/Background.js";

document.addEventListener("DOMContentLoaded", () => {
    window.game = new Game();

    window.addEventListener('resize', window.game.onResize);
});


export default class Game{
    constructor(){
        this.loadGame()
    }
    
    loadGame = () => {
        try{
            //1. Try to connect to backend server (we dont have one so skip this)
            //2. Load game config
            this._loadConfig()
            //3. Initialise controllers
            .then(this._initControllers.bind())
            //4. Load assets
            .then(this._loadAssets.bind())
            //5 Only when everthing is done, start game
            .then(this._createApp.bind())
            .then(this._addBackground.bind())
        }
        catch(error){
            console.log(error)
        }
    }

    _loadConfig = async () =>{
        try {
            const response = await fetch('app/config/game.json');
            const data = await response.json();
            this.config = data;
            return await Promise.resolve();
        } catch (error) {
            return console.log('Error loading game config');
        }
    }

    _initControllers = () => {
        this.assetsController = new AssetsController();
        return Promise.resolve();
    }

    _loadAssets = () => {
        return this.assetsController._loadAssets()
    }
    
    _createApp = () => {
        return new Promise((resolve, reject) => {
            //Something is wrong with pixi application auto resizer.
            //Keep getting horizontal and vertical scroll bars.
            //Reduce width by 17 (vertical scroll width) so we dont end up with horizontal scroll at least...
            this.app = new Application({
                width: window.innerWidth - 17,
                height: window.innerHeight
            });
            this.stage = this.app.stage;
            this.initialWidth = this.app.renderer.width;
            this.initialHeight = this.app.renderer.height;

            document.body.appendChild(this.app.view)
            resolve()
            
        })
    }

    _addBackground = () => {
        return new Promise((resolve, reject) => {
            const background = new Background();
            if(background){
                this.stage.addChild(background);
                resolve();
            }
        })
    }

    onResize = (event) => {
        this.app.renderer.resize(window.innerWidth - 17, window.innerHeight);
        if(this.stage.children.length > 0){
            this.stage.children.forEach(child => {
                child.scale.set(this.app.renderer.width / this.initialWidth, this.app.renderer.height / this.initialHeight);
            })
        }
    }
}

