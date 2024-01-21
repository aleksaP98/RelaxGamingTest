export default class GameModel{
    /**
     * Default value when reseting is a matrix of outcome symbol names
     * [
     *      [sym1, sym2, sym2],
     *      [sym9, sym1, sym5],
     *      [sym8, sym3, sym4],
     *      [sym9, sym7, sym7],
     *      [sym4, sym3, sym1],
     * ]
     */
    _outcomeNames = [];

    /**
     * Default value when reseting is a matrix of null values
     * [
     *      [null, null, null],
     *      [null, null, null],
     *      [null, null, null],
     *      [null, null, null],
     *      [null, null, null],
     * ]
     */
    _winningSymbols = [];

    /**
     * Spin payout
     */
    _payout = 0;

    /**
     * Default value is an object with properites as symbol names, and values as how many wins there are in that symbol (0 when reseting)
     * {
     *  sym1: 0,
     *  sym2: 0,
     *  sym3: 0,
     *  ...
     * }
     */
    _winningCounter = {};

    /**
     * Spin counter to track the spins for the 4th spin win.
     */
    _spinCounter = 0;

    /**
     * Game balance
     */
    _balance = 1000;

    /**
     * Game bets
     */
    _betRange = [1, 5, 10, 50, 100];

    /**
     * Game bet index
     */
    _betIndex = 0;

    constructor(){
        this._setWinningLines(window.game.config.winLines);
    }

    /**
     * Get winlines from config
     * @param {Array} winLines 
     */
    _setWinningLines = (winLines) => {
        this._winLines = winLines;
    }
    
    incrementSpinCounter = () => {
        this._spinCounter++
    }

    getSpinCounter = () => {
        return this._spinCounter;
    }
    /**
     * Sets outcome for the current spin
     */
    setOutcome = () => {
        this._resetOutcome();
        this._resetWinningCounter();
        this._setWinningMatrix();
        this._checkForWinningSymbols();
        this._setPayout();
        this.setBalance(this._balance + this._payout); //this is safe because payout will always be at least 0;
    }

    /**
     * Reset all outcome arrays and variables to default states
     */
    _resetOutcome = () => {
        this._outcomeSymbols = window.game.reelsController.getOutcomeSymbols()
        this._outcomeNames = this._outcomeSymbols.map(reelOutcomes => reelOutcomes.map(outcomeSymbols => outcomeSymbols.model.name));
        this._winningSymbols = this._outcomeSymbols.map(reelOutcomes => reelOutcomes.map(outcomeSymbols => null));
        this._winningMatrix = this._outcomeNames.map((reel, reelIndex) => reel.map((symbolName, symbolIndex) => false));
    }

    /**
     * Reset win counter to default state
     */
    _resetWinningCounter = () => {
        window.game.config.symbols?.forEach(symbol => this._winningCounter[symbol.name] = 0);
    }

    /**
     * Checks the outcome symbol names and sets the winning counter and winning matrix if the symbol is winning
     * (symbol is winning if there are 3 or more of the same symbol on the board)
     * The matrix may look wrong (some symbols may be "winning" even though the are not eligable to be a win)
     * but we will have 1 more comparison to the winlines before setting the finaly winning symbols
     */
    _setWinningMatrix = () => {
        this._outcomeNames.forEach((reel, reelIndex) => {
            reel.forEach((symbolName, symbolIndex) => {
                if(this._canCheck(reelIndex, symbolName)){
                    const isWin = this._isWinningSymbol(reelIndex, symbolName);
                    if(isWin){
                        this._winningCounter[symbolName]++;
                        this._winningMatrix[reelIndex][symbolIndex] = isWin;
                    }
                }
            })
        })
    }

    /**
     * Special check for reels with index 2, 3 and 4
     * @param {Number} reelIndex 
     * @param {Number} symbolName 
     * @returns {Boolean}
     */
    _canCheck = (reelIndex, symbolName) => {
        //additional check so we dont let reel index 2, 3 and 4 check win if there are wins less than 2,3 and 4 respectivly 
        return reelIndex >= 2 && this._winningCounter[symbolName] < reelIndex ? false : true;
    }

    /**
     * Check if current symbol is a win symbol
     * @param {Number} reelIndex 
     * @param {Number} symbolName 
     * @returns {Boolean}
     */
    _isWinningSymbol = (reelIndex, symbolName) => {
        let isWin = reelIndex === 0 ? 
        !!this._outcomeNames[reelIndex + 1]?.find(nextSymbol => nextSymbol === symbolName) && //Condition for the first reel, check if the next 2 reels have the same symbol
        !!this._outcomeNames[reelIndex + 2]?.find(nextNextSymbol => nextNextSymbol === symbolName) :
        !!this._outcomeNames[reelIndex + 1]?.find(nextSymbol => nextSymbol === symbolName) && //Condition for all other reels, check if the next and previous reels have the same symbols
        !!this._outcomeNames[reelIndex - 1]?.find(previousSymbol => previousSymbol === symbolName); 

        if(reelIndex >= 2 && this._winningCounter[symbolName] >= 2 && !isWin){
            isWin = true; //override isWin to true because we want to 3rd, 4th and 5th symbols to be winning even if there are no same symbols after them.
        }
        return isWin;
    }

    /**
     * Performace enchancer, dont compare any winlines if there are no wins in the win matrix.
     */
    _checkForWinningSymbols = () => {
        //We only need to check the first reel for wins (first reel will have wins if we get 3+ of the same symbol)
        if(this._winningMatrix[0].find(win => win)){
            this._winLines.forEach(this._checkWinLine.bind(this));
        }
    }

    /**
     * Compare winline and winning matrix to determen winning symbols
     * @param {Matrix} winLine 
     */
    _checkWinLine = (winLine) => {
        let winlineWins = [];
        for(let reelIndex in winLine){
            const reelWins = winLine[reelIndex];
            const symbolIndexWin = reelWins.findIndex(isWin => isWin);

            //Check if the matrix aligns with current winline position
            const winFound = this._winningMatrix[reelIndex][symbolIndexWin];

            //Check if win after reel 2 has any wins before it.
            const additionCondition = (reelIndex > 1 && winFound) ? winlineWins.find(winObject => winObject.reelIndex == Number(reelIndex) - 1) : true;

            if(winFound && additionCondition){
                //Add win object to the winline wins array
                winlineWins.push({
                    reelIndex,
                    symbolIndex: symbolIndexWin,
                    name: this._outcomeNames[reelIndex][symbolIndexWin]
                })
            }
            //Set winning symbols only if
            //1. is reel index 4 (can be dynamic, last reel index).
            //2. there are 3 or more win objects.
            //3. there must be a win object on the first reel.
            //4. all win objects must have the same name (name from first reel win object)
            if(reelIndex == 4 && winlineWins.length >= 3 && winlineWins.find(winObject => winObject.reelIndex == 0) && winlineWins.every(winObject => winObject.name === winlineWins[0].name)){
                winlineWins.forEach(winObject => {
                    this._winningSymbols[winObject.reelIndex][winObject.symbolIndex] = window.game.reelsController.getOutcomeSymbols()[winObject.reelIndex][winObject.symbolIndex];
                }) 
            }
        }
    }

    /**
     * Sets current spin payout if we have any winning symbols on the first reel (will have a win with min 3 symbols)
     */
    _setPayout = () => {
        this._payout = 0;
        if(this._winningSymbols[0].some(winSym => winSym)){
            this._spinCounter = 0;
            this._winningSymbols.forEach(reelWininnings => reelWininnings.forEach(winSymbol => {
                //Need to check winSymbol since some values in the matrix may be null
                if(winSymbol){
                   this._payout += winSymbol.model.payout
                }
            }));
            //Round the payout because we are playing with coins
            this._payout = Math.round(this._payout * this.getBet());
        }
    }

    /**
     * @returns {Number}
     */
    getPayout = () => {
        return this._payout;
    }

    /**
     * @returns {Array}
     */
    getWinningSymbols = () => {
        return this._winningSymbols;
    }

    /**
     * Get new symbols that are going to be the next spin outcome symbols
     * Force wins here with winning seed if spin counter is 3 (so every 4th spin is a win)
     * @returns {Array<Object>}
     */
    getNewSymbolObjects = () => {
        const seed = this._spinCounter == 3 ? this.getWinningSeed() : this.getRandomSeed();
        const splitSeed = seed.split("");

        return splitSeed.map(this._mapIndexToObject);
    }

    /**
     * Util function to determen the reel and symbol indexes based on the current seed index
     * Should handle it like - index 0 is reelIndex 0, symbolIndex 0
     *                       - index 1 is reelIndex 1, symbolIndex 0
     *                       - index 2 is reelIndex 2, symbolIndex 0
     *                       ...
     * @param {String} singleNumber 
     * @param {Number} index 
     * @returns {Object}
     */
    _mapIndexToObject = (singleNumber, index) => {
        return {
            reelIndex: index % window.game.config.reels.numberOfReels,
            symbolIndex: Math.floor(index / window.game.config.reels.numberOfReels),
            symbolName: window.game.config.symbols.find(symbol => symbol.name[3] === singleNumber) || "sym1" //sym0 doesnt exist so we will just hardcode it to 1
        }
    }

    /**
     * Get a random 15 char string. This string will represent all the symbols on the reels (15 total for this game)
     * Every char is a symbol ID (symbol name in the model)
     * @returns {String}
     */
    getRandomSeed = () => {
        return String(Math.floor(Math.random() * 9e14) + 1e14)
    }

    /**
     * Get a winning seed from the game config. This can be upgraded to return a random winning seed, but we are focusing on frontend dev here :)
     * @returns {String}
     */
    getWinningSeed = () => {
        if(!window.game.config.winningSeeds){
            return console.log("winnig seeds array missing in game config")
        }
        const randomIndex = Math.floor(Math.random() * window.game.config.winningSeeds.length)
        return window.game.config.winningSeeds[randomIndex];
    }

    /**
     * 
     * @returns {Number}
     */
    getBalance = () => {
        return this._balance;
    }

    /**
     * 
     * @param {Number} newBalance 
     */
    setBalance = (newBalance) => {
        this._balance = newBalance
    }

    /**
     * 
     * @returns {Number}
     */
    getBet = () => {
        return this._betRange[this._betIndex]
    }

    /**
     * Increases the bet by incrementing the bet index - if there will be a next value
     */
    increaseBet = () =>{
        if(this._betRange[this._betIndex + 1]){
            this._betIndex++
        }
    }

    /**
     * Decreases the bet by decrementing the bet index - if there will be a next value
     */
    decreaseBet = () =>{
        if(this._betRange[this._betIndex - 1]){
            this._betIndex--
        }
    }

    /**
     * Handles spin start, sets the new balance
     */
    placeBet = () => {
        this.setBalance(this._balance - this.getBet());
    }
 
}