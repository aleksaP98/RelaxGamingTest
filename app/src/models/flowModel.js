/**
 * Game Flow Model
 * Controls the flow of the game by instructing each controller, and gameModel, what to do.
 * The flow model should know about all the controllers.
 */
export default class FlowModel {
    constructor(gameModel){
        this.gameModel = gameModel; 
    }
    
    /**
     * Add the controller to the flow model
     * @param {Class} controller 
     */
    addController =  (controller) => {
        this[controller.name] = controller;
    }

    /**
     * Interface controller will notify the flow model when spin is clicked
     * Flow model will determine if we can make new spin, and if so, will istruct all other controllers and game model on the next steps.
     */
    onSpinStart = () => {
        if(this.gameModel.getBalance() - this.gameModel.getBet() >= 0){
            this.gameModel.placeBet();
            this.gameModel.incrementSpinCounter();

            this.interfaceController.balance.updateBalance(this.gameModel.getBalance());
            this.interfaceController.disableSpinButton();
        
            //spin reels
            this.reelsController.spinReels()
            .then(this.processSpinResult)
        }
        else{
            console.warn("NOT ENOUGHT MONEY");
        }
    }

    /**
     * Sets the outcome when the reels stop spinning.
     * First set the actual outcome symbols in the reels
     * Then the game model will process thouse outcome symbols and give us a win if present.
     * After we process the wins, enable the spin button so the next game can begin
     */
    processSpinResult = () => {
        this.reelsController.setOutcomeSymbols()
        .then(this.gameModel.setOutcome)
        .then(this.processWins)
        .then(this.interfaceController.enableSpinButton)
    }

    /**
     * Check if we have a win for the current spin and if so animate the wins.
     * @returns {Promise}
     */
    processWins = () => {
        let promise = Promise.resolve();
        if(this.gameModel.getPayout() > 0){
            promise = promise
            .then(this.reelsController.animateWins)
            .then(this.reelsController.animatePayout)
            .then(this.interfaceController.updateBalance)
        }
        return promise;
    }
}