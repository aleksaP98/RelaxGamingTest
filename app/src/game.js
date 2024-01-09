import Application from "./presentations/app.js";

document.addEventListener("DOMContentLoaded", () => {
    window.game = new Game();

    window.addEventListener('resize', window.game.onResize);
});


export default class Game{
    constructor(){
        this.loadGame()
    }
    
    loadGame = () => {
        try{
            this._loadConfig()
            .then(this._createApp.bind())
        }
        catch(error){
            console.log(error)
        }
    }

    _loadConfig = () =>{
        return fetch('app/config/game.json')
        .then(response => response.json())
        .then(data => {
            this.config = data;
            return Promise.resolve();
        })
        .catch(error => console.log('Error loading game config'))
    }
    
    _createApp = () => {
        return new Promise((resolve, reject) => {
            //Something is wrong with pixi application auto resizer.
            //Keep getting horizontal and vertical scroll bars.
            //Reduce width by 17 (vertical scroll width) so we dont end up with horizontal scroll at least...
            this.app = new Application({
                width: window.innerWidth - 17,
                height: window.innerHeight
            });
            this.stage = this.app.stage;

            document.body.appendChild(this.app.view)
            resolve()
            
        })
    }

    onResize = (event) => {
        this.app.renderer.resize(window.innerWidth - 17, window.innerHeight);
    }
}

