import Balance from "../views/balance.js";
import Bet from "../views/bet.js";
import Button from "../views/button.js";
import GameFooter from "../views/gameFooter.js";

export default class InterfaceController{
    constructor(){

    }

    createInterfaceContainer = () => {
        this.interfaceContainer = new PIXI.Container();
        window.game.stage.addChild(this.interfaceContainer);
    }

    createSpinButton = () => {
        const spinButtonTexture = window.game.assetsController.getAsset("spinButton");
        this.spinButton = new Button(this.spin, spinButtonTexture);
        this.spinButton.x = window.game.app.screen.width / 2 + 550;
        this.spinButton.y = window.game.app.screen.height / 2 -100;
        this.interfaceContainer.addChild(this.spinButton);
    }
    createGameFooter = () => {
        this.footer = new GameFooter();
        this.interfaceContainer.addChild(this.footer);
    }
    createBalanceView = () => {
        this.balance = new Balance({initialBalance: window.game.gameModel.getBalance()});
        this.footer.addChild(this.balance);
    }
    createBetView = () => {
        this.bet = new Bet({initialBet: window.game.gameModel.getBet()});
        const betIncrease = new Button(this.onBetIncrease, window.game.assetsController.getAsset('betIncrease'));
        const betDecrease = new Button(this.onBetDecrease, window.game.assetsController.getAsset('betDecrease'));

        betIncrease.x = 1100
        betDecrease.x = 870
        betIncrease.y = 10
        betDecrease.y = 10
        this.footer.addChild(this.bet);
        this.footer.addChild(betIncrease);
        this.footer.addChild(betDecrease);
    }

    spin = () => {
        console.clear();
        console.log('spin clicked')
        //Make request to server
        if(window.game.gameModel.getBalance() - window.game.gameModel.getBet() >= 0){
            window.game.gameModel.placeBet();
            window.game.gameModel.incrementSpinCounter();
            this.balance.updateBalance(window.game.gameModel.getBalance());
            //disable spin
            this.disableSpinButton();
        
            //spin reels
            window.game.reelsController.spinReels()
            .then(this.processSpinResult)
            //wait for server response...
        }
        else{
            console.warn("NOT ENOUGHT MONEY");
        }
    }

    processSpinResult = () => {
        window.game.reelsController.setOutcomeSymbols()
        .then(this.processWins.bind(this))
        .then(this.enableSpinButton.bind(this))
    }

    processWins = () => {
        let promise = Promise.resolve();
        if(window.game.gameModel.getPayout() > 0){
            promise = promise.then(window.game.reelsController.animateWins.bind(window.game.reelsController))
            .then(window.game.reelsController.animatePayout.bind(window.game.reelsController))
            .then(this.balance.updateBalance.bind(this.balance, window.game.gameModel.getBalance()))
        }
        return promise;
    }

    onBetIncrease = () => {
        window.game.gameModel.increaseBet()
        this.bet.updateBetValue(window.game.gameModel.getBet());
    }
    
    onBetDecrease = () => {
        window.game.gameModel.decreaseBet()
        this.bet.updateBetValue(window.game.gameModel.getBet());
    }
    
    enableSpinButton = () => {
        this.spinButton.eventMode = "static";
    }

    disableSpinButton = () => {
        this.spinButton.eventMode = "none";
        this.spinButton.emit("mouseout"); //change mouse cursor
    }

}