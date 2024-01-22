import Application from "./views/app.js";
import GameModel from "./models/gameModel.js";
import FlowModel from "./models/flowModel.js";
import AssetsController from "./controllers/assetsController.js";
import InterfaceController from "./controllers/interfaceController.js";
import ReelsController from "./controllers/reelsController.js";
import Background from "./views/background.js";
import Reels from "./views/reels.js";
import Payout from "./views/payout.js";

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
            this._loadConfig()
            .then(this._initGameModel.bind())
            .then(this._initControllers.bind())
            .then(this._setupFlowModel.bind())
            .then(this._loadAssets.bind())
            .then(this._createApp.bind())
            .then(this._addBackground.bind())
            .then(this._createReels.bind())
            .then(this._createPayoutView.bind(this))
            .then(this._createUI.bind())
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

    _initGameModel = () => {
        this.gameModel = new GameModel();
        this.flowModel = new FlowModel(this.gameModel);
    }

    
    _initControllers = () => {
        this.assetsController = new AssetsController();
        this.interfaceController = new InterfaceController();
        this.reelsController = new ReelsController();
        return Promise.resolve([this.assetsController, this.interfaceController, this.reelsController]);
    }

    _setupFlowModel = (controllers) => {
        return new Promise((resolve, reject) => {
            controllers.forEach(this.flowModel.addController);
            resolve();
        })
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
            const texture = this.assetsController.getAsset('baseBackground');
            const background = new Background(texture);
            if(background){
                this.stage.addChild(background);
                resolve();
            }
        })
    }

    _createReels = () => {
        return new Promise((resolve, reject) => {
            this.reels = new Reels();
            this.reelsController.addView({name: "reelsContainer", class: this.reels})
            this.stage.addChild(this.reels);
            resolve();
        })
    }

    _createPayoutView = () => {
        return new Promise((resolve, reject) => {
            const payoutView = new Payout();
            this.reelsController.addView({name: "payout", class: payoutView});
            this.stage.addChild(payoutView);
            resolve();
        })
    }

    _createUI = () => {
        return new Promise((resolve, reject) => {
            this.interfaceController.createInterfaceContainer();
            this.interfaceController.createSpinButton();
            this.interfaceController.createGameFooter();
            this.interfaceController.createBalanceView();
            this.interfaceController.createBetView();
            resolve();
        })
    }


    onResize = () => {
        this.app.renderer.resize(window.innerWidth - 17, window.innerHeight);
        if(this.stage.children.length > 0){
            this.stage.children.forEach(child => {
                child.scale.set(this.app.renderer.width / this.initialWidth, this.app.renderer.height / this.initialHeight);
            })
        }
    }
}

