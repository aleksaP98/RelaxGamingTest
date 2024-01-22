import Symbol from "../views/symbol.js";

/**
 * Reels Controller
 * Handles base game animations
 * Knows about the views that need to be animated (reels and payout so far)
 */
export default class ReelsController{
    
    name = ""

    _indexConversion = {
        27: 0,
        28: 1,
        29: 2
    }

    constructor(name){
        this.name = name || "reelsController";
    }

    /**
     * Adds a perticular view to the controller so it will 'know' about it
     * @param {Object} view -view name and class as props
     */
    addView = (view) => {
        if(!view.name || !view.class){
            console.log("CANT ADD VIEW")
        }
        else{
            this[view.name] = view.class;
        }
    }

    /**
     * SPIN ANIMATION!
     * Uses .map to create a set of gsap.timelines that will animate the symbols all at the same time.
     * Symbols are animated to 'spin' by setting their y position to a hardcoded value.
     * @returns {Promise}
     */
    spinReels = () => {
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline({onComplete: resolve});
            const symbolTimelines = this.reelsContainer.reels.map(reel => reel.spinningSymbols.map(symbol => gsap.timeline().to(symbol, {duration: 1, y: symbol.y + 4320})))
            timeline.add(symbolTimelines);
        }) 
    }

    /**
     * Reset and set new outcome symbols for every spin.
     * @returns {Promise}
     */
    setOutcomeSymbols = () => {
        return new Promise((resolve, reject) => {
            this._resetOutcomeSymbols();
            this._setNewOutcomeSymbols();
            this._setNewSymbols()
            .then(() => {
                resolve(this.outcomeSymbols);
            });
        })
    }

    /**
     * Resets outcome and new symbol arrays, so we have a clean slate for every spin
     */
    _resetOutcomeSymbols = () => {
        const reelSize = window.game.config.reels.numberOfReels;
        this.outcomeSymbols = [];
        this.newSymbols = []
        for(let i = 0; i < reelSize; i++){
            this.outcomeSymbols[i] = []
            this.newSymbols[i] = []
        }
    }
    
    /**
     * Sets the actual outcome symbols by checking all the spinning symbols for each reel (in this case 30 symbols per reel) and only setting the last 3 symbols to be the outcome symbols for this spin
     * We have to create a new Symbol every time, outherwise it will cause issues when destroying the symbols them later.
     */
    _setNewOutcomeSymbols = () => {
        this.reelsContainer.reels.forEach((reel, reelIndex) => {
            reel.spinningSymbols.forEach((symbol, symbolIndex) => {
                if(symbolIndex >= 27){
                    const realSymbolIndex = this._indexConversion[symbolIndex];
                    this.outcomeSymbols[reelIndex][realSymbolIndex] = new Symbol(this.reelsContainer.reels[reelIndex], realSymbolIndex, symbol.model.name);
                }
            })
        })
    }

    /**
     * Destory the current symbols and set the new symbols.
     * This will happen in a sequence, but because there are no animations, it will look like it happended at once, so there wont be glitches on the screen.
     * @returns {Promise}
     */
    _setNewSymbols = () => {
        return  new Promise((resolve, reject) => {
            const mainTimeline = gsap.timeline({onComplete: resolve})
            mainTimeline.call(() => this.destroySymbols());
            mainTimeline.call(() => this.createNewReelSet());
        })
    }

    /**
     * Call destorySpinningSymbol for each reel
     */
    destroySymbols = () => {
        this.reelsContainer.reels.forEach(reel => reel.destorySpinningSymbol());
    }

    /**
     * Call createNewReelSet for each reel and pass it outcomeSymbols and new symbols, so the view doesnt need to have any logic, just creating what the controller says
     */
    createNewReelSet = () => {
        const outcomeSymbols = this.getOutcomeSymbols();
        const newSymbols = this.getNewSymbols();
        this.reelsContainer.reels.forEach(reel => reel.createNewReelSet(outcomeSymbols, newSymbols));
    }
    
    /**
     * @returns {Array<Array<Symbol>>}
     */
    getOutcomeSymbols = () => {
        return this.outcomeSymbols;
    }

    /**
     * Fetch the new symbol objects from the game model, and then convert them into actual Symbols.
     * Symbol objects are not in a matrix so we have to adjuts the newSymbols matrix as well.
     * @returns {Array<Array<Symbol>>}
     */
    getNewSymbols = () => {
        const newSymbols = window.game.gameModel.getNewSymbolObjects();
        const symbolsPerReel = window.game.config.reels.symbolsPerReel
        this.newSymbols.forEach((reel,reelIndex) => {
            for(let symbolIndex = 0; symbolIndex < symbolsPerReel; symbolIndex++){
                const newSymbolName =  newSymbols.find(newSym => newSym.reelIndex === reelIndex && newSym.symbolIndex === symbolIndex)?.symbolName;
                const realSymbolIndex = Number(Object.keys(this._indexConversion)[symbolIndex]);
                this.newSymbols[reelIndex][symbolIndex] = new Symbol(this.reelsContainer.reels[reelIndex], realSymbolIndex, newSymbolName.name)
            }
        })
        return this.newSymbols;
    }

    /**
     * Animates the winning symbols by scaling them up then down.
     * We have to check for the winSymbol because some values in the matrix may be null (no win on that position) 
     * @returns {Promise}
     */
    animateWins = () => {
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline({onComplete: resolve})
            const symbolTimelines =  window.game.gameModel.getWinningSymbols().map(reelSymbolWins => reelSymbolWins.map(winSymbol => {
                if(winSymbol){
                    return gsap.timeline().to(winSymbol.scale, {duration: 1, x: 1.5, y: 1.5})
                    .to(winSymbol.scale, {duration: 0.5, x: 1, y: 1})
                }
            }))
            timeline.add(symbolTimelines)
        })
    }

    /**
     * Animates the payout view.
     * @returns {Promise}
     */
    animatePayout = () => {
        return new Promise((resolve, reject) => {
            const timeline = gsap.timeline()
            const resetTimeline = gsap.timeline({onComplete: resolve})

            timeline.to(this.payout, {duration: 0.5, alpha: 1})
            timeline.call(this.payout.setPayout, [window.game.gameModel.getPayout()], this.payout);
            timeline.add("start") //Adds a point in time to the timline
            timeline.to(this.payout.payoutValue, {duration: 1, x:260, y: 890}, "start"); //animate at 'start' point in time
            timeline.to(this.payout.payoutValue.scale, {duration: 0.5, x: 0, y: 0}, "start+=0.5"); //animate at 'start' + 0.5 seconds in time
            timeline.to(this.payout, {duration: 0.5, alpha: 0}) //animate when previous task are completed

            resetTimeline.call(this.resetPayoutValuePosition, null, 0);

            timeline.add(resetTimeline);
        })
    }

    /**
     * Reset the view position and scale so it can be animated again on the next win.
     */
    resetPayoutValuePosition = () => {
        const centerX = window.game.app.screen.width / 2
        const centerY = window.game.app.screen.height / 2

        this.payout.payoutValue.position.set(centerX, centerY);
        this.payout.payoutValue.scale.set(1, 1);
    }



}