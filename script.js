import Board from './classes/board.js';
import Player from './classes/player.js';
import { drawWinningLine, hasClass, addClass } from './helpers.js';




/* 
 * TODO: 
 *       connect to Misty 
 *       auto switch to next round? Async await?
 */

//var ip = "10.5.6.13";//02944
var ip = "10.5.1.51";//02945
var totalNumRounds = 5;
var currRound = 0;
// sub-arrays are the scenarios, 1 = cheat, 0 = don't cheat
var cheatPattern = [
    [0, 0, 0, 0, 0], 
    [0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1]
    ];
var wins = [0, 0, 0, 0, 0]

// let exp_joy = {
//     "FileName": "e_Joy2.jpg",
//     "Alpha": 1 //optional
//     //"Layer": null //default layer
//     //"IsUrl": false //if true, script will treat filename as an online url
// };

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
    //audioplayer.downloadAudio(text);
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

function uploadAudio(filename, data) {
    var audio_file = {
        "FileName": filename,
        "Data": data,
        "ImmediatelyApply": true, //whether Misty immediately plays the audio
        "OverwriteExisting": true
        }

        console.log(`Uploading audio file`);
        //upload to Misty
        axios.post("http://" + ip + "/api/audio", audio_file)
                .then(function (response) {
                console.log(`Upload audio ${filename} was a ${response.data.status}`);
        })
            .catch(function (error) {
        console.log(`There was an error uploading the audio ${error}`);
    })
}


    // var reader = new FileReader();
    // console.log('Reader');
    // // reader.onload = function(event) {
    // //     var data = event.target.result.split(',')
    // //     , decodedImageData = btoa(data[1]);
    // //     callback(decodedImageData);
    // // };

    // reader.readAsDataURL(filename);
    // console.log(`FileReader result ${reader.result()}`);
    // return btoa(reader.result());

    



        // const preview = document.querySelector("img");
        // const file = document.querySelector("input[type=file]").files[0];
        // const reader = new FileReader();
      
        // reader.addEventListener(
        //   "load",
        //   () => {
        //     // convert image file to base64 string
        //     console.log(`load`);
        //     preview.src = reader.result;
        //     console.log(`src`);
        //     audio_base64_text = btoa(reader.result()); 
        //     console.log(`Btoa`);

        //     string = atob(audio_base64_text);
        //     console.log(`Atob`);
        //   },
        //   false,
        // );
      
        // if (file) {
        //   reader.readAsDataURL(file);
        //   console.log(`File read`);

          
          

    //       console.log(audio_base64_text);
    //         var audio_file = {
    //             "FileName": filename,
    //             "Data": string,
    //             "ImmediatelyApply": true, //whether Misty immediately plays the audio
    //             "OverwriteExisting": true
    //         }

    // console.log(`Uploading audio file`);
    // //upload to Misty
    // axios.post("http://" + ip + "/api/audio", audio_file)
    // .then(function (response) {
    //     console.log(`Upload audio ${filename} was a ${response.data.status}`);
    // })
    // .catch(function (error) {
    //     console.log(`There was an error uploading the audio ${error}`);
    // })

    //console.log(`Audio file uploaded`);
    //    }
    function read_file(filename) {
        console.log(`In readfile`);

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new window.AudioContext();
        var source;
        // context.decodeAudioData(arraybuffer, function (buf) {
        //     source = context.createBufferSource();
        //     source.connect(context.destination);
        //     source.buffer = buf;
        //     source.start(0);
        // });
    }

    function playSound(arraybuffer) {
        console.log(`In playsound`);

        //function _arrayBufferToBase64( arraybuffer ) {
            // var binary = '';
            // var bytes = new Uint8Array( arraybuffer );
            // var len = bytes.byteLength;
            // for (var i = 0; i < len; i++) {
            //     binary += String.fromCharCode( bytes[ i ] );
            // }

            console.log('After loop');
            var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(arraybuffer)));
            //var base64 = window.btoa( binary );
            console.log('Base64string: ' + base64String);
            var string = window.atob(base64String);
            console.log('New data: ' + string);

            uploadAudio('misty_audio_cheat.mp3', base64String);

            console.log(`Audio file uploaded`);
        }
    

function handleFileSelect(evt) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new window.AudioContext();
    var source;
    console.log(`In handle file select`);
    var files = evt.target.files; // FileList object
    playFile(files[0]);

}

function playFile(file) {
    console.log(`In playfile`);
    var freader = new FileReader();

    freader.onload = function (e) {
        console.log(`freader`);
        console.log(e.target.result);
        playSound(e.target.result);
    };
    freader.readAsArrayBuffer(file);

    console.log(`Get files`);
}



function upload_audio_file(filename){
    console.log(`Processing audio file ${filename}`);
    //encode into base64
    playFile(filename);

    //var base64 = read_file(filename);
    //var base64 = btoa('audio/misty_audio_cheat.mp3');
    console.log(`Converting to base64`);

    //open local base64 file?
    var audio_base64_text = atob(base64);

    console.log(audio_base64_text);
    var audio_file = {
        "FileName": filename,
        "Data": audio_base64_text,
        "ImmediatelyApply": true, //whether Misty immediately plays the audio
        "OverwriteExisting": true
    }

    console.log(`Uploading audio file`);
    //upload to Misty
    axios.post("http://" + ip + "/api/audio", audio_file)
    .then(function (response) {
        console.log(`Upload audio ${filename} was a ${response.data.status}`);
    })
    .catch(function (error) {
        console.log(`There was an error uploading the audio ${error}`);
    })

    console.log(`Audio file is uploaded`);
    axios.get("http://" + ip + "/api/audio/list")
    .then(function (response) {
        console.log(`Get audiolist ${filename} was a ${response.data.status}`);

    })
    .catch(function (error) {
        console.log(`There was an error getting the audio list ${error}`);
    })
}

function play_Misty_audio_file(filename) {
    axios.post("http://" + ip + "/api/audio/play", filename)
    .then(function (response) {
        console.log(`Play audio ${filename} was a ${response.data.status}`);
    })
    .catch(function (error) {
        console.log(`There was an error playing the audio ${filename} ${error}`);
    })
}

function Misty_reaction(name) {
    //TODO: convert other audio files to base64, call function
    
    //var ENCODING = 'utf-8';
    //var encode_string = base64.b64encode(open(filename, "rb").read());
    //const encodedMp3 = btoa(mp3File);
    //var base64_string = encode_string.decode(ENCODING);

    //save_audio_response = misty.SaveAudio(file_name, data=base64_string, overwriteExisting=True, immediatelyApply=True);
    //save_audio = JSON_response_to_dictionary(save_audio_response);

    if (name == "wins") {
        changeExpression({"FileName":"e_Amazement.jpg",
        "Alpha": 1});
        play_Misty_audio_file('misty_audio_win.mp3')
        //playAudio('That was fun! Would you like to play again?');

    } else if (name == "loses") {
        changeExpression({"FileName":"e_Sadness.jpg",
        "Alpha": 1});
        
        //TODO: misty.move_head(20,0,0)
        play_Misty_audio_file('misty_audio_lose.mp3');
        //playAudio('Thats too bad. How about a rematch?');
        
    } else if (name == "cheats") {
        changeExpression({"FileName":"e_Joy.jpg",
        "Alpha": 1});
        
        //misty.move_head(0,0,0)   
        play_Misty_audio_file('misty_audio_cheat.mp3');
        //playAudio("I win! Haha! Let's play again!");

    } else if (name == "ties") {
        changeExpression({"FileName":"e_Joy.jpg",
        "Alpha": 1});
        //TODO: ties
        play_Misty_audio_file('misty_audio_tie.mp3');
        //playAudio("It's a tie! We need a rematch.");

    } else if (name == "playing") {
        changeExpression({"FileName":"e_Joy2.jpg",
        "Alpha": 1});
        play_Misty_audio_file('misty_audio_intro.mp3');
        //playAudio('Hi there! My name is Misty. Would you like to play a few games of tic-tac-toe with me?');

        /*
        misty.move_arm("left", -10)
   
        time.sleep(1)
        misty.move_arm("left", 90)
        */

    }
}


// let LED_color = {
//     "red": 0,
//     "green": 255,
//     "blue": 0
// };



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

    console.log(`Audio file is uploaded`);
    var files = axios.get("http://" + ip + "/api/audio/list")
    .then(function (response) {
        console.log(`Get audiolist was a ${response.data.status}`);

    })
    .catch(function (error) {
        console.log(`There was an error getting the audio list ${error}`);
    })
    console.log(files);

	//Start a new game when page loads with default values
	const depth = -1;
	const startingPlayer = 1;
    //while (currRound <= totalNumRounds){
    console.log(`Starting game in initial configuration`);
    //Misty_reaction('playing');
    newGame(depth, startingPlayer, 1, 0);
    //}

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    //read_file('audio/misty_audio_cheat.mp3');
        
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