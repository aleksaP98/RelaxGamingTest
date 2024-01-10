export default class Symbol{
    index;
    reel;
    name;

    constructor(Reel, symbolIndex, name){
        this.reel = Reel;
        this.index = symbolIndex;
        this.name = name;
    }
}