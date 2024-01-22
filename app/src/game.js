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
    window.game = new Game(); //Attaching the main game class to the window object is to be avoided in real developement! But for this test it will make stuff easer to access
    window.addEventListener('resize', window.game.onResize);
});

/**
 * Main Game Class
 * This is the class that starts the game and gets everthing ready
 * This class DOES NOT control the elements or game flow
 */
export default class Game{
    constructor(){
        this.loadGame()
    }
    
    /**
     * The game loading starts by:
     * 1. Loading the game config.
     * 2. Initialising the main models (Game and Flow).
     * 3. Initialising the controllers.
     * 4. Loading the assets.
     * 
     * Only then can we create the acual game
     * 5. Create a blank pixi application
     * 6. Create and add the base game background
     * 7. Create the Reels
     * 8. Create the Payout view
     * 9. Create the UI.
     * 10. Etc...
     */
    loadGame = () => {
        try{
            this._loadConfig()
            .then(this._initGameModel.bind())
            .then(this._initControllers.bind())
            .then(this._setupFlowModel.bind())
            .then(this._loadAssets.bind())
            .then(this._createApp.bind())
            .then(this._createBackground.bind())
            .then(this._createReels.bind())
            .then(this._createPayoutView.bind(this))
            .then(this._createUI.bind())
        }
        catch(error){
            console.log(error)
        }
    }

    /**
     * Load config with async await.
     * @returns {Promise}
     */
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

    /**
     * Init main game models
     */
    _initGameModel = () => {
        this.gameModel = new GameModel();
        this.flowModel = new FlowModel(this.gameModel);
    }

    /**
     * Init controllers
     * @returns {Promise}
     */
    _initControllers = () => {
        this.assetsController = new AssetsController();
        this.interfaceController = new InterfaceController();
        this.reelsController = new ReelsController();
        return Promise.resolve([this.assetsController, this.interfaceController, this.reelsController]);
    }

    /**
     * Extra init method for the flow model
     * Adds the controllers to the model for easer access
     * @param {Array<Controller>} controllers 
     * @returns {Promise}
     */
    _setupFlowModel = (controllers) => {
        return new Promise((resolve, reject) => {
            controllers.forEach(this.flowModel.addController);
            resolve();
        })
    }

    /**
     * Load all game assets
     * If we had lazy loading we would ignore some assets here
     * @returns {Promise}
     */
    _loadAssets = () => {
        return this.assetsController._loadAssets()
    }
    
    /**
     * Create a blank pixi app
     * @returns {Promise}
     */
    _createApp = () => {
        return new Promise((resolve, reject) => {
            //Something is wrong with pixi application auto resizer.
            //Keep getting horizontal and vertical scroll bars.
            //Reduce width by 17 (vertical scroll width) so we dont end up with horizontal scroll at least...
            this.app = new Application({
                width: window.innerWidth - 17,
                height: window.innerHeight
            });
            this.stage = this.app.stage; //Add stage to the main game class for easy access
            this.initialWidth = this.app.renderer.width;
            this.initialHeight = this.app.renderer.height;

            document.getElementById("gamePlaceholder").appendChild(this.app.view) //Add the app to the gamePlaceholder section instead of at the end of body.
            resolve()
            
        })
    }

    /**
     * Create the base game background
     * @returns {Promise}
     */
    _createBackground = () => {
        return new Promise((resolve, reject) => {
            const texture = this.assetsController.getAsset('baseBackground');
            const background = new Background(texture);
            if(background){
                this.stage.addChild(background);
                resolve();
            }
        })
    }

    /**
     * Create the reels
     * @returns {Promise}
     */
    _createReels = () => {
        return new Promise((resolve, reject) => {
            this.reels = new Reels();
            this.reelsController.addView({name: "reelsContainer", class: this.reels})
            this.stage.addChild(this.reels);
            resolve();
        })
    }

    /**
     * Create the payout view
     * @returns {Promise}
     */
    _createPayoutView = () => {
        return new Promise((resolve, reject) => {
            const payoutView = new Payout();
            this.reelsController.addView({name: "payout", class: payoutView});
            this.stage.addChild(payoutView);
            resolve();
        })
    }

    /**
     * Use the interface controller to create the UI and its elements
     * @returns {Promise}
     */
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


    /**
     * Attempt at making the game responsive.
     */
    onResize = () => {
        this.app.renderer.resize(window.innerWidth - 17, window.innerHeight);
        if(this.stage.children.length > 0){
            this.stage.children.forEach(child => {
                child.scale.set(this.app.renderer.width / this.initialWidth, this.app.renderer.height / this.initialHeight);
            })
        }
    }
}

