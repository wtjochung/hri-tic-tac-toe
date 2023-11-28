import Board from './classes/board.js';
import Player from './classes/player.js';
import { drawWinningLine, hasClass, addClass } from './helpers.js';



/* 
 * TODO: 
 *       connect to Misty 
 *       auto switch to next round? Async await?
 */

var ip = "10.5.6.13";
var totalNumRounds = 5;
var currRound = 0;
// sub-arrays are the scenarios, 1 = cheat, 0 = don't cheat
var cheatPattern = [
    [0, 0, 0, 0, 0], 
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0]
    ];
var wins = [0, 0, 0, 0, 0]

let exp_joy = {
    "FileName": "e_Joy2.jpg",
    //"Alpha": 1 //optional
    //"Layer": null //default layer
    //"IsUrl": false //if true, script will treat filename as an online url
};

// let exp = {
//     "FileName": "e_Amazement.jpg"
// }



function changeExpression(filename) {

    axios.post("http://" + ip + "/api/images/display", filename)
    .then(function (response) {
        console.log(`ChangeExpression to ${filename} was a ${response.data.status}`);
    })
    .catch(function (error) {
        console.log(`There was an error with the request ${error}`);
    })
}

console.log(`Tries to connect to Talkify text-to-speech`);
talkify.config.remoteService.host = 'https://talkify.net';
talkify.config.remoteService.apiKey = 'b2b4ec9e-4524-4d90-9cda-66a9b8af03e2';

talkify.config.ui.audioControls.enabled = false; //<-- Disable to get the browser built in audio controls
talkify.config.ui.audioControls.voicepicker.enabled = true;
talkify.config.ui.audioControls.container = document.getElementById("player-and-voices");
console.log(`Talkify connected`);
var audioplayer = new talkify.TtsPlayer(); //or new talkify.Html5Player()
//audioplayer.downloadAudio("Hello world");
//audioplayer.playText('Hello world');

function playAudio(text) {
    audioplayer.playText(text);
    //audioplayer.downloadAudio(text, text);
    console.log('Played ' + text);
}

// let socket = new LightSocket(ip);
// socket.Connect();

function moveHead(data) {

    /*{
  "Pitch": -40,
  "Roll": 0,
  "Yaw": 0,
  "Velocity": 60
}
    */
    //POST <robot-ip-address>/api/head
}

function moveArm(data) {
    //POST <robot-ip-address>/api/arms
    /*{
  "Arm": "left",
  "Position": -90,
  "Velocity": 100,
}
*/
}

function Misty_reaction(name) {
    if (name == "wins") {
        changeExpression("e_Amazement.jpg");
        playAudio('That was fun! Would you like to play again?');

    } else if (name == "loses") {
        changeExpression("e_Sadness.jpg");
        
        //TODO: misty.move_head(20,0,0)
        playAudio('Thats too bad. How about a rematch?');
        
    } else if (name == "cheats") {
        changeExpression("e_Joy.jpg");
        
        //misty.move_head(0,0,0)    
        playAudio("I win! Haha! Let's play again!");

    } else if (name == "ties") {
        changeExpression("e_Joy.jpg");
        //TODO: ties
        playAudio("It's a tie! We need a rematch.");

    } else if (name == "playing") {
        changeExpression("e_Joy2.jpg");
        playAudio('Hi there! My name is Misty. Would you like to play a few games of tic-tac-toe with me?');

        /*
        misty.move_arm("left", -10)
   
        time.sleep(1)
        misty.move_arm("left", 90)
        */

    }
}


let LED_color = {
    "red": 0,
    "green": 255,
    "blue": 0
};

let audio_file = {
    "FileName": "s_Awe.wav"
};






//Starts a new game with a certain depth and a startingPlayer of 1 if human is going to start
function newGame(depth = -1, startingPlayer = 1, test_scenario = 1, cheat = 0) {
    const experiment_configuration = parseInt(test_scenario);
    const currRoundCheat = cheat;

	//Instantiating a new player and an empty board
	const player = new Player(parseInt(depth));
	const board = new Board(['','','','','','','','','']);
	//Clearing all #Board classes and populating cells HTML
	const boardDIV = document.getElementById("board");
	boardDIV.className = '';
    boardDIV.innerHTML = 
        `<div class="cells-wrap">
            <button class="cell-0"></button>
            <button class="cell-1"></button>
            <button class="cell-2"></button>
            <button class="cell-3"></button>
            <button class="cell-4"></button>
            <button class="cell-5"></button>
            <button class="cell-6"></button>
            <button class="cell-7"></button>
            <button class="cell-8"></button>
        </div>`;
	//Storing HTML cells in an array
	const htmlCells = [...boardDIV.querySelector('.cells-wrap').children];
	//Initializing some variables for internal use
	const starting = parseInt(startingPlayer),
		maximizing = starting;
    let playerTurn = starting;
    //If computer is going to start, choose a random cell as long as it is the center or a corner
    if(!starting) {
        const centerAndCorners = [0,2,4,6,8];
        const firstChoice = centerAndCorners[Math.floor(Math.random()*centerAndCorners.length)];
        const symbol = !maximizing ? 'x' : 'o';
        board.insert(symbol, firstChoice);
        addClass(htmlCells[firstChoice], symbol);
        playerTurn = 1; //Switch turns
    }
    //Adding Click event listener for each cell
    board.state.forEach((cell, index) => {
        htmlCells[index].addEventListener('click', () => {
            //If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
            if(hasClass(htmlCells[index], 'x') || hasClass(htmlCells[index], 'o') || board.isTerminal() || !playerTurn) return false;
            const symbol = maximizing ? 'x' : 'o'; //Maximizing player is always 'x'
            //Update the Board class instance as well as the Board UI
            board.insert(symbol, index);
            addClass(htmlCells[index], symbol);
            //If it's a terminal move and it's not a draw, then human won
            if(board.isTerminal()) {
                const { winner, direction, row, column, diagonal } = board.isTerminal();
                if (winner == 'draw') {
                    //TODO: Misty shows draw face
                    Misty_reaction("ties");

                    console.log(`Round ${currRound}: a draw`);
                } else {
                    //Misty shows sad face because the human won
                    Misty_reaction("loses");
                    console.log(`Round ${currRound}: the human wins`);
                }
                drawWinningLine(board.isTerminal());
            }
            playerTurn = 0; //Switch turns
            //Get computer's best move and update the UI

            player.getBestMove(board, !maximizing, best => {
                let symbol = best.cheatMove ? (!maximizing ? 'o' : 'x') : (!maximizing ? 'x' : 'o');
                board.insert(symbol, parseInt(best.move));
                addClass(htmlCells[best.move], symbol);

                if(board.isTerminal()) {
                    //TODO: Misty shows sad face because the human won

                    const { winner, direction, row, column, diagonal } = board.isTerminal();
                    if (winner == 'draw') {
                        //TODO: Misty shows draw face
                        Misty_reaction("ties");

                        console.log(`Round ${currRound}: a draw`);
                    } else {

                        //If Misty won by cheating
                        if (currRoundCheat == 1) {
                            //TODO: Misty shows cheating face
                            console.log(`Round ${currRound}: Misty wins by cheating`);
                            Misty_reaction("cheats");
                        } else {
                            //TODO: Misty shows non-cheating celebratory face
                            console.log(`Round ${currRound}: Misty wins without cheating`);
                            Misty_reaction("wins");

                            //Make misty speak (currently from browser)
                            
                            // axios.post("http://" + ip + "/api/audio/play", audio_file)
                            // .then(function (response) {
                            //     console.log(`Play Audio ${audio_file} was a ${response.data.status}`);
                            // })
                            // .catch(function (error) {
                            //     console.log(`There was an error with the play audio request ${error}`);
                            // })

                        }
                    }
                    drawWinningLine(board.isTerminal());
                }

                playerTurn = 1; //Switch turns
            }, (currRoundCheat == 1)); //last var: whether the robot will cheat
        }, false);
        if(cell) addClass(htmlCells[index], cell);
    });
}

document.addEventListener("DOMContentLoaded", () => { 

	//Start a new game when page loads with default values
	const depth = -1;
	const startingPlayer = 1;
    //while (currRound <= totalNumRounds){
    console.log(`Starting game in initial configuration`);
    newGame(depth, startingPlayer, 1, 0);
    //}
        
    //Start a new game with chosen options when new game button is clicked
    document.getElementById("newGame").addEventListener('click', () => {
        const startingDIV = document.getElementById("starting");
        const starting = startingDIV.options[startingDIV.selectedIndex].value;
        const depthDIV = document.getElementById("depth");
        const depth = depthDIV.options[depthDIV.selectedIndex].value;
        const scenarioDIV = document.getElementById("test_scenario");
        const scenario = scenarioDIV.options[scenarioDIV.selectedIndex].value;

        currRound += 1;
        console.log(`Starting round ${currRound} in scenario ${scenario}`);
        const cheat = cheatPattern[scenario-1][Math.min(currRound-1, totalNumRounds)];
            if (cheat == 1) {
                console.log(`Misty WILL cheat`);
            } else {
                console.log(`Misty WILL NOT cheat`);
            }
        newGame(depth, starting, scenario, cheat);

    });

});