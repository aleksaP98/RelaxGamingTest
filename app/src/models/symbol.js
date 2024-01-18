export default class Symbol{
    index;
    reel;
    name;
    payout

    constructor(Reel, symbolIndex, name){
        this.reel = Reel;
        this.index = symbolIndex;
        this.name = name;
        this.payout = window.game.config.symbols.find(symbol => symbol.name === this.name).payout;
    }
}