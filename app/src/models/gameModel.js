export default class GameModel{
    _indexConversion = {
        27: 0,
        28: 1,
        29: 2
    }
    outcomeSymbols = [];

    constructor(){

    }
    _resetOutcomeSymbols = () => {
        const reelSize = window.game.config.reels.size;
        this.outcomeSymbols = [];
        for(let i = 0; i < reelSize; i++){
            this.outcomeSymbols[i] = []
        }
    }
    
    setOutcomeSymbols = (allSymbols) => {
        this._resetOutcomeSymbols();
        if(allSymbols?.length > 0){
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
    }
    
    getOutcomeSymbols = () => {
        return this.outcomeSymbols;
    }

}