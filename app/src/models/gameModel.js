export default class GameModel{
    _indexConversion = {
        27: 0,
        28: 1,
        29: 2
    }
    outcomeSymbols = [];

    outcomeNames = [];

    winningSymbols = [];

    payout = 0;

    winningCounter = {}

    constructor(){

    }

    _resetOutcomeSymbols = () => {
        const reelSize = window.game.config.reels.size;
        this.outcomeSymbols = [];
        for(let i = 0; i < reelSize; i++){
            this.outcomeSymbols[i] = []
        }
    }
    
    setOutcome = (allSymbols) => {
        this._resetOutcomeSymbols();
        if(allSymbols?.length > 0){
            this._setOutcomeSymbols(allSymbols); 
            this._resetWinningCounter();
            this._setOutcomeNames();
            this._setDefaultMatrix();
            this._setWins();
        }
    }

    _setOutcomeSymbols = (allSymbols) => {
        allSymbols.forEach((reel, reelIndex) => {
            reel.forEach((symbol, symbolIndex) => {
                //Only take the last 3 symbols from each reel to be the outcome symbols
                if(symbolIndex >= 27 && symbolIndex <= 29){
                    const realSymbolIndex = this._indexConversion[symbolIndex];
                    this.outcomeSymbols[reelIndex][realSymbolIndex] = symbol;
                }
            })
        })
    }

    _setOutcomeNames = () => {
        this.outcomeSymbols.forEach((reelSymbols, reelIndex) => {
            this.outcomeNames[reelIndex] = []
            reelSymbols.forEach((symbol, symbolIndex) => {
                this.outcomeNames[reelIndex][symbolIndex] = symbol.model.name;
            })
        })
    }

    _resetWinningCounter = () => {
        window.game.config.symbols?.forEach(symbol => this.winningCounter[symbol] = 0);
    }
    
    _setDefaultMatrix = () => {
        this.winningMatrix = this.outcomeNames.map((reel, reelIndex) => reel.map((symbolName, symbolIndex) => false));
    }

    _setWins = () => {
        this.outcomeNames.forEach((reel, reelIndex) => {
            reel.forEach((symbolName, symbolIndex) => {
                if(this._canCheck(reelIndex, symbolName)){
                    const isWin = this._isWinningSymbol(reelIndex, symbolName);
                    if(isWin){
                        this.winningCounter[symbolName]++;
                        this.winningMatrix[reelIndex][symbolIndex] = isWin;
                    }
                }
            })
        })
    }

    _isWinningSymbol = (reelIndex, symbolName) => {
        let isWin = reelIndex === 0 ? 
        !!this.outcomeNames[reelIndex + 1]?.find(nextSymbol => nextSymbol === symbolName) && //Condition for the first reel, check if the next 2 reels have the same symbol
        !!this.outcomeNames[reelIndex + 2]?.find(nextNextSymbol => nextNextSymbol === symbolName) :
        !!this.outcomeNames[reelIndex + 1]?.find(nextSymbol => nextSymbol === symbolName) && //Condition for all other reels, check if the next and previous reels have the same symbols
        !!this.outcomeNames[reelIndex - 1]?.find(previousSymbol => previousSymbol === symbolName); 

        if(reelIndex >= 2 && this.winningCounter[symbolName] >= 2 && !isWin){
            isWin = true; //override isWin to true because we want to 3rd, 4th and 5th symbols to be winning even if there are no same symbols after them.
        }
        return isWin;
    }

    //Special function just for reels >= 2
    _canCheck = (reelIndex, symbolName) => {
        let canCheck = true

        //additional check so we dont let reel index 2,3 and 4 check win if there are wins less than 2,3 and 4 respectivly 
        if(reelIndex >= 2 && this.winningCounter[symbolName] < reelIndex){
            canCheck = false;
        }

        return canCheck
    }
    
    getOutcomeSymbols = () => {
        return this.outcomeSymbols;
    }

}