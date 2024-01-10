import Button from "../presentations/button.js";

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
        this.spinButton = new Button(this.spin);
        this.spinButton.x = 550;
        this.spinButton.y = -100;
        this.interfaceContainer.addChild(this.spinButton);
    }

    spin = () => {
        console.log('spin clicked')
        //Make request to server

        //disable spin
        this.disableSpinButton();
    
        //spin reels
        window.game.reelsController.spinReels();
        //wait for server response...
        setTimeout(() => {
            this.stop();
        }, 2000);
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