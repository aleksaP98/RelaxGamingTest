/**
 * Symbol Model
 * Every symbol needs to know its:
 * 1. symbolIndex - this.index
 * 2. which reel it belongs to - this.reel
 * 3. its name (id) - this.name "sym1", "sym3" ...
 * 4. its payout - this.payout
 */
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