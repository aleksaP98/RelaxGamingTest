export default class GameModel{
    outcomeNames = [];

    winningSymbols = [];

    _payout = 0;

    _winningCounter = {};

    _spinCounter = 0;

    _balance = 1000;

    _betRange = [1, 5, 10, 50, 100];

    _betIndex = 0;

    constructor(){
        if(!window.game.config.anyways){
            this._setWinningLines(window.game.config.winLines);
        }
    }

    _setWinningLines = (winLines) => {
        this._winLines = winLines;
    }
    
    setOutcome = () => {
        this._resetWinningCounter();
        this._setOutcomeNames();
        this._setDefaultMatrix();
        this._setWinningMatrix();
        this._checkForWinningSymbols();
        this._setPayout();
        this.setBalance(this._balance + this._payout);
    }

    incrementSpinCounter = () => {
        this._spinCounter++
    }

    getSpinCounter = () => {
        return this._spinCounter;
    }

    _setOutcomeNames = () => {
        this.winningSymbols = [];
        window.game.reelsController.getOutcomeSymbols().forEach((reelSymbols, reelIndex) => {
            this.outcomeNames[reelIndex] = []
            this.winningSymbols[reelIndex] = []
            reelSymbols.forEach((symbol, symbolIndex) => {
                this.outcomeNames[reelIndex][symbolIndex] = symbol.model.name;
                this.winningSymbols[reelIndex][symbolIndex] = null;
            })
        })
    }

    _resetWinningCounter = () => {
        window.game.config.symbols?.forEach(symbol => this._winningCounter[symbol.name] = 0);
    }
    
    _setDefaultMatrix = () => {
        this._winningMatrix = this.outcomeNames.map((reel, reelIndex) => reel.map((symbolName, symbolIndex) => false));
    }

    _setWinningMatrix = () => {
        this.outcomeNames.forEach((reel, reelIndex) => {
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

    _checkForWinningSymbols = () => {
        //We only need to check the first reel for wins (first reel will have wins if we get 3+ of the same symbol)
        if(this._winningMatrix[0].find(win => win)){
            this._winLines.forEach(this._checkWinLine.bind(this));
        }
    }

    _checkWinLine = (winLine) => {
        for(let reelIndex in winLine){
            const reelWins = winLine[reelIndex];
            reelWins.forEach((win, symbolIndex) => {
               if(this._winningMatrix[reelIndex][symbolIndex] && win){
                    this.winningSymbols[reelIndex][symbolIndex] = window.game.reelsController.getOutcomeSymbols()[reelIndex][symbolIndex];
               }
            })
        }
    }

    _isWinningSymbol = (reelIndex, symbolName) => {
        let isWin = reelIndex === 0 ? 
        !!this.outcomeNames[reelIndex + 1]?.find(nextSymbol => nextSymbol === symbolName) && //Condition for the first reel, check if the next 2 reels have the same symbol
        !!this.outcomeNames[reelIndex + 2]?.find(nextNextSymbol => nextNextSymbol === symbolName) :
        !!this.outcomeNames[reelIndex + 1]?.find(nextSymbol => nextSymbol === symbolName) && //Condition for all other reels, check if the next and previous reels have the same symbols
        !!this.outcomeNames[reelIndex - 1]?.find(previousSymbol => previousSymbol === symbolName); 

        if(reelIndex >= 2 && this._winningCounter[symbolName] >= 2 && !isWin){
            isWin = true; //override isWin to true because we want to 3rd, 4th and 5th symbols to be winning even if there are no same symbols after them.
        }
        return isWin;
    }

    //Special function just for reels >= 2
    _canCheck = (reelIndex, symbolName) => {
        let canCheck = true

        //additional check so we dont let reel index 2,3 and 4 check win if there are wins less than 2,3 and 4 respectivly 
        if(reelIndex >= 2 && this._winningCounter[symbolName] < reelIndex){
            canCheck = false;
        }

        return canCheck
    }

    _setPayout = () => {
        this._payout = 0;
        if(this.winningSymbols[0].some(winSym => winSym)){
            this._spinCounter = 0;
            this.winningSymbols.forEach(reelWininnings => reelWininnings.forEach(winSymbol => {
                if(winSymbol){
                   this._payout += winSymbol.model.payout
                }
            }));
            this._payout = Math.round(this._payout * this.getBet());
           
        }
    }

    getPayout = () => {
        return this._payout;
    }

    getWinningSymbols = () => {
        return this.winningSymbols;
    }

    getNewSymbolObjects = () => {
        const seed = this._spinCounter >= 3 ? this.getWinningSeed() : this.getRandomSeed();
        const splitSeed = seed.split("");

        return splitSeed.map(this._mapIndexToObject);
    }

    _mapIndexToObject = (singleNumber, index) => {
        return {
            reelIndex: index % window.game.config.reels.numberOfReels,
            symbolIndex: Math.floor(index / window.game.config.reels.numberOfReels),
            symbolName: window.game.config.symbols.find(symbol => symbol.name[3] === singleNumber) || "sym1" //sym0 doesnt exist so we will just hardcode it to 1
        }
    }

    getRandomSeed = () => {
        return String(Math.floor(Math.random() * 9e14) + 1e14)
    }

    getWinningSeed = () => {
        if(!window.game.config.winningSeeds){
            return console.log("winnig seeds array missing in game config")
        }
        const randomIndex = Math.floor(Math.random() * window.game.config.winningSeeds.length)
        return window.game.config.winningSeeds[randomIndex];
    }

    getBalance = () => {
        return this._balance;
    }

    setBalance = (newBalance) => {
        this._balance = newBalance
    }

    getBet = () => {
        return this._betRange[this._betIndex]
    }

    increaseBet = () =>{
        if(this._betRange[this._betIndex + 1]){
            this._betIndex++
        }
    }

    decreaseBet = () =>{
        if(this._betRange[this._betIndex - 1]){
            this._betIndex--
        }
    }

    placeBet = () => {
        this.setBalance(this._balance - this.getBet());
    }
 
}