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
    "Alpha": 1 //optional
    //"Layer": null //default layer
    //"IsUrl": false //if true, script will treat filename as an online url
};

let LED_color = {
    "red": 0,
    "green": 255,
    "blue": 0
};

let audio_file = {
    "FileName": "s_Awe.wav"
};

function changeExpression(filename) {

    axios.post("http://" + ip + "/api/images/display", filename)
    .then(function (response) {
        console.log(`ChangeExpression to ${filename} was a ${response.data.status}`);
    })
    .catch(function (error) {
        console.log(`There was an error with the request ${error}`);
    })
}



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
                    console.log(`Round ${currRound}: a draw`);
                } else {
                    //TODO: Misty shows sad face because the human won

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
                        console.log(`Round ${currRound}: a draw`);
                    } else {

                        //If Misty won by cheating
                        if (currRoundCheat == 1) {
                            //TODO: Misty shows cheating face
                            console.log(`Round ${currRound}: Misty wins by cheating`);
                        } else {
                            //TODO: Misty shows non-cheating celebratory face
                            console.log(`Round ${currRound}: Misty wins without cheating`);
                            changeExpression(exp_joy);
                            axios.post("http://" + ip + "/api/led", LED_color);

                            //Make misty speak (currently from browser)
                            var msg = new SpeechSynthesisUtterance();
                            msg.text = "Hello World";
                            window.speechSynthesis.speak(msg);
                            axios.post("http://" + ip + "/api/audio/play", audio_file)
                            .then(function (response) {
                                console.log(`Play Audio ${audio_file} was a ${response.data.status}`);
                            })
                            .catch(function (error) {
                                console.log(`There was an error with the play audio request ${error}`);
                            })

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