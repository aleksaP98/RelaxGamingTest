import Button from "../views/button.js";

export default class InterfaceController{
    constructor(){

    }

    createInterfaceContainer = () => {
        this.interfaceContainer = new PIXI.Container();
        this.interfaceContainer.x = window.game.app.screen.width / 2;
        this.interfaceContainer.y = window.game.app.screen.height / 2;

        window.game.stage.addChild(this.interfaceContainer);
    }

    createSpinButton = () => {
        const spinButtonTexture = window.game.assetsController.getAsset("spinButton");
        this.spinButton = new Button(this.spin, spinButtonTexture);
        this.spinButton.x = 550;
        this.spinButton.y = -100;
        this.interfaceContainer.addChild(this.spinButton);
    }

    spin = () => {
        console.clear();
        console.log('spin clicked')
        //Make request to server
        window.game.gameModel.incrementSpinCounter();
        //disable spin
        this.disableSpinButton();
    
        //spin reels
        window.game.reelsController.spinReels()
        .then(this.processSpinResult)
        //wait for server response...
    }

    processSpinResult = () => {
        window.game.reelsController.setOutcomeSymbols()
        .then(this.processWins.bind(this))
        .then(this.enableSpinButton.bind(this))
    }

    processWins = () => {
        let promise = Promise.resolve();
        if(window.game.gameModel.getPayout() > 0){
            promise = promise.then(window.game.reelsController.animateWins.bind(window.game.reelsController));
        }
        return promise;
    }

    stop = () => {
        window.game.reelsController.stopReels();

        //enable spin
        this.enableSpinButton();
    }
    
    enableSpinButton = () => {
        this.spinButton.eventMode = "static";
    }

    disableSpinButton = () => {
        this.spinButton.eventMode = "none";
        this.spinButton.emit("mouseout"); //change mouse cursor
    }

}