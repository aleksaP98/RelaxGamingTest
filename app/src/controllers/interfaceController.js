import Balance from "../views/balance.js";
import Bet from "../views/bet.js";
import Button from "../views/button.js";
import GameFooter from "../views/gameFooter.js";

/**
 * Interface Controller
 * Handles the UI elements
 * Knows about the UI views such as spin button.
 * 
 */
export default class InterfaceController{
    name = ""

    constructor(name){
        this.name = name || "interfaceController";
    }

    /**
     * Create the main container for all UI elements.
     * This is done so they can we positioned easly.
     */
    createInterfaceContainer = () => {
        this.interfaceContainer = new PIXI.Container();
        window.game.stage.addChild(this.interfaceContainer);
    }

    /**
     * Create the spin button.
     * Use this.spin as the click callback
     */
    createSpinButton = () => {
        const spinButtonTexture = window.game.assetsController.getAsset("spinButton");
        this.spinButton = new Button(this.spin, spinButtonTexture);
        this.spinButton.x = window.game.app.screen.width / 2 + 550;
        this.spinButton.y = window.game.app.screen.height / 2 -100;
        this.interfaceContainer.addChild(this.spinButton);
    }

    /**
     * Create the game footer where the balance and bet are going to be 
     */
    createGameFooter = () => {
        this.footer = new GameFooter();
        this.interfaceContainer.addChild(this.footer);
    }
    
    /**
     * Create the balance view
     */
    createBalanceView = () => {
        this.balance = new Balance({initialBalance: window.game.gameModel.getBalance()});
        this.footer.addChild(this.balance);
    }

    /**
     * Create the bet view 
     */
    createBetView = () => {
        this.bet = new Bet({initialBet: window.game.gameModel.getBet(), onBetIncrease: this.onBetIncrease, onBetDecrease: this.onBetDecrease});
        this.footer.addChild(this.bet);
    }

    /**
     * The first function that gets called when spin is clicked!
     * Informs the flow model to start a new spin.
     */
    spin = () => {
        console.clear();
        console.log('spin clicked')
        window.game.flowModel.onSpinStart();
    }

    /**
     * Updates the game balance through the balance view
     */
    updateBalance = () => {
        this.balance.updateBalance(window.game.gameModel.getBalance());
    }

    /**
     * Callback for bet increase button, tells the game model to increase the bet
     */
    onBetIncrease = () => {
        window.game.gameModel.increaseBet()
        this.bet.updateBetValue(window.game.gameModel.getBet());
    }
    
    /**
     * Callback for bet decrease button, tells the game model to decrease the bet
     */
    onBetDecrease = () => {
        window.game.gameModel.decreaseBet()
        this.bet.updateBetValue(window.game.gameModel.getBet());
    }
    
    /**
     * Enable the spin button
     */
    enableSpinButton = () => {
        this.spinButton.eventMode = "static";
    }

    /**
     * Disable the spin button
     */
    disableSpinButton = () => {
        this.spinButton.eventMode = "none";
        this.spinButton.emit("mouseout"); //change mouse cursor
    }

}