import { cookie } from "./login.js";



function showDropOptions() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function showDropOptionsSeeds() {
    document.getElementById("myDropdownSeeds").classList.toggle("show");
}


function showDropOptionsPlayer() {
    document.getElementById("myDropPlayFirst").classList.toggle("show");
}

function showDropOptionsAgainst() {
    document.getElementById("myDropPlayAgainst").classList.toggle("show");
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


// Global letiables =======================================
//creat array for the board game
var board = [];
//verify who is a winner
let whoIsWinner = null;
// Player  total seeds
let player2Seeds = null;
//identify players
let whoIsNextPlayer = 0;

// Tracks the current player's turn
let currentPlayer = null;
// Tracks the current number of marbles to distribute
let numSeeds = null;
// Tracks the location of the hole where marbles were grabbed
let startIndex = null;
let eventTarget = null;
//play agains computer or a player
let whoIsOpponent;

//to know the inicial configuration of board
let configs = {};


//board useful for 2nd part

class Nick {
    store;
    pits;
    constructor(store, pits) {
        this.store = store;
        this.pits = pits;

    }

}
class MyBoard {
    sides;
    turn;
    constructor(sides, turn) {
        this.sides = sides;
        this.turn = this.turn;

    }

}
class Sides {
    mynick;
    oppnick;
    constructor(mynick, oppnick) {
        this.mynick = mynick;
        this.oppnick = oppnick;
    }
}

function gameBoard(mynick, mystore, mypits, oppnick, oppstore, opppits, turn) {

    let board = new MyBoard(new Sides(new Nick(mystore, mypits), new Nick(oppstore, opppits)), turn);
    console.log("teste do board!", board);

}








// Pre-canned marble colors could be useful for seeds?
const seedColors = [
    ['#e54ed0, #ff72ff'],
    ['#b106df, #06dfb1'],
    ['#1e48e2, #060e2d'],
    ['#42e100, #f6ff6a'],
    ['#fab340, #fe8787'],
    ['#b400a2, #9e0031']
]

// End Global letiables =======================================


// Events =======================================
//event generic
const distributePlayerRowSeeds = document.addEventListener('click', function(e) {
    if (hasClass(e.target, 'item')) {
        let nContainers = document.getElementsByClassName("item");

        eventTarget = e.target;
        let numSeeds = e.target.children.length;
        let items = Array.from(nContainers);
        let filterItem = items.filter(x => x.id == e.target.id); //creats new array with target only id
        let item = filterItem[0];
        //clean container
        e.target.innerHTML = '';

        if (hasClass(item, 'mid1')) {
            currentPlayer = 1;
        } else {
            currentPlayer = 2;
        }

        let startIndex = Number(item.id);
        let limit = numSeeds;
        if (currentPlayer === 1) {

            distributePlayer1RowSeeds(e, limit, startIndex, nContainers);

            //  updateBoard(board, nContainers);

            // endGame(items, e, nContainers);
            // verifylLastSeed(lastseed, 1, nContainers);

        } else {
            distributePlayer2RowSeeds(e, limit, startIndex, nContainers);

            //updateBoard(board, nContainers);
            // endGame(items, e, nContainers);
            // verifylLastSeed(lastseed, 2, nContainers);

        }
    }

}, false);



// End Events =======================================

// functions =======================================

function getRandomSeedColor() {
    const random = Math.floor(Math.random() * 6)
    return 'radial-gradient(' + seedColors[random] + ')';
}

//funtion to update board with an array
function updateBoard(board, nContainers) {

    let size = 0;

    for (let i = 0; i < nContainers.length; i++) {
        let curr = nContainers[i];
        curr.innerHTML = '';
        for (let j = 0; j < board[i]; j++) {
            curr.innerHTML += '<span class="seed" style=" background:' + getRandomSeedColor() + '"></span>';
        }
        size = i;
    }

    //update player1 position nContainers.length
    let player1 = document.getElementById("p1");
    player1.innerHTML = '';
    size++;
    for (let j = 0; j < board[size]; j++) {

        player1.innerHTML += '<span class="seed"  style=" background:' + getRandomSeedColor() + '"></span>';
    }
    //update player2 position nContainers.length+1
    let player2 = document.getElementById('p2');
    player2.innerHTML = '';
    size++;
    for (let j = 0; j < board[size]; j++) {

        player2.innerHTML += '<span class="seed"  style=" background:' + getRandomSeedColor() + '"></span>';
    }

}


function verifylLastSeed(lastSeed, player, nContainers) {

    let player1pos = nContainers.length;
    let player2pos = nContainers.length + 1;
    let opposed = null; //opposed postion
    let midSection = 0;

    //verify if lastseed  position is in a empty container of the player==only 1 child
    if (lastSeed >= 0 && lastSeed < nContainers.length) {
        let size = board[lastSeed];

        //in witch midsection is lastSeed
        if (lastSeed < nContainers.length / 2) {
            midSection = 1;
        }
        if (lastSeed >= nContainers.length / 2) {
            midSection = 2;
        }

        if (size == 1 && midSection == player) {

            if (player == 1) {
                opposed = lastSeed + (nContainers.length / 2);
                board[player1pos] += board[opposed] + 1;
                board[lastSeed] = 0;
                board[opposed] = 0;
            }

            if (player == 2) {
                opposed = lastSeed - (nContainers.length / 2);
                board[player2pos] += board[opposed] + 1;
                board[lastSeed] = 0;
                board[opposed] = 0;
            }
        }

    }

    //verify if lastSeed is in own container-> play again otherwise is other player
    let flag = 1;
    if (player == 1 && lastSeed == nContainers.length) {
        whoIsNext('mid1', 'mid2', nContainers);
        flag = 0;
        writeLog("Last seed in own container. Player 1 time to play again!");
    }
    if (player == 2 && lastSeed == nContainers.length + 1) {
        whoIsNext('mid2', 'mid1', nContainers);
        flag = 0;
        writeLog("Last seed in own container. Computer time to play again!");
        playComputer();
    }

    if (flag) {
        if (player == 1) {
            whoIsNext('mid2', 'mid1', nContainers);

            writeLog("Computer time to play");
            playComputer();
        }
        if (player == 2) {
            writeLog("player 1 time to play");
            whoIsNext('mid1', 'mid2', nContainers);
        }
    }

}

//enable board only for next player and disable other player
function whoIsNext(midSectionEnable, midSectionDisable, nContainers) {
    enableEvents(nContainers, midSectionEnable);
    disableEvents(eventTarget, nContainers, midSectionDisable);

}


//verify who is the winner
function endGame(items, nContainers) {
    let mid1Size = 0;
    let mid2Size = 0;
    //for player1
    for (let i = 0; i < items.length / 2; i++) {
        mid1Size += items[i].children.length;
    }
    //for player2
    for (let i = items.length / 2; i < items.length; i++) {
        mid2Size += items[i].children.length;
    }

    if (mid1Size == 0) {
        //clean all elements 
        let mid2 = document.getElementsByClassName("item");
        for (let j = 0; j < mid2.length; j++) {
            mid2[j].innerHTML = '';
        }

        for (let i = 0; i < mid2Size; i++) {
            let player2 = document.getElementById("p2");
            player2.innerHTML += '<span class="seed"  style=" background:' + getRandomSeedColor() + '"></span>';
        }

        disableEvents(items[items.length - 1], nContainers, 'mid2');
        disableEvents(items[0], nContainers, 'mid1');
        compareNumSeeds();
        var message = document.getElementById("winning-message"); //.style.visibility = 'visible';
        message.classList.remove('hide');

    }
    if (mid2Size == 0) {
        //clean all elements 
        let mid1 = document.getElementsByClassName("item");

        for (let j = 0; j < mid1.length; j++) {
            mid1[j].innerHTML = '';
        }
        mid1.innerHTML = '';
        for (let i = 0; i < mid1Size; i++) {
            let player1 = document.getElementById("p1");
            player1.innerHTML += '<span class="seed"  style=" background:' + getRandomSeedColor() + '"></span>';
        }
        disableEvents(items[items.length - 1], nContainers, 'mid2');
        disableEvents(items[0], nContainers, 'mid1');
        compareNumSeeds()
        var message = document.getElementById("winning-message"); //.style.visibility = 'visible';
        message.classList.remove('hide');

    }


}

// compare number seeds in each player
function compareNumSeeds() {
    let nContainers = document.getElementsByClassName("item");
    let seedsP1 = board[nContainers.length];
    let seedsP2 = board[nContainers.length + 1];
    console.log("seedp1", seedsP1);
    console.log("seedp2", seedsP2);

    if (seedsP1 > seedsP2) {
        whoIsWinner = 1;
        document.getElementById('idWinner').innerHTML = '<br>You are the winner!<br>';
        writeLog("Player1 is the winner!");
    } else {
        whoIsWinner = 2;
        document.getElementById('idWinner').innerHTML = '<br>You loose!<br>';
        writeLog("Computer is the winner!");
    }
    //clean board
    resetGame();
    //CONFIRMAR
    let player = cookie.getCookie('userSession');
    console.log(player);
    saveScore(player.username, seedsP1);
    return false;
}

function saveScore(name, value) {

    let flag = 0;
    var scores = cookie.getCookie('scores'); //returns an array
    if (scores == null) {
        scores = []
    }
    var score = {
        displayName: name,
        score: value
    };

    for (let i = 0; i < scores.length; i++) {
        if (scores[i].displayName == name) {
            //update cookie
            scores[i].value += value;
            flag = 1;
        }
    }

    if (flag == 0) {
        scores.push(score); //append new element

    }
    cookie.setCookie('scores', scores);
    addDataToScoreboard(scores);

}



function disableEvents(item, nContainers, midTarget) {
    if (hasClass(item, midTarget)) {
        var elements = Array.from(nContainers).filter(x => x.className == item.className);
        elements.forEach(element => {
            element.classList.add('disabled');
            element.setAttribute('disabled', 'disabled');
        });
    }
}

function enableEvents(nContainers, midTarget) {
    var elements = Array.from(nContainers).filter(x => x.classList.contains(midTarget));
    elements.forEach(element => {
        element.classList.remove('disabled');
        element.removeAttribute('disabled');
    });

}

function distributePlayer1RowSeeds(e, limit, startIndex, nContainers) {
    writeLog("Player 1 plays in container " + startIndex + " with " + limit + " seeds;")
    let items = Array.from(nContainers);
    let player1pos = nContainers.length;
    let lastseed = startIndex; //to know where is last seed position
    let index = startIndex - 1;
    //flag to know in witch container we are
    let flagMid1 = 1;
    let flagMid2 = 0;

    board[startIndex] = 0;
    for (let i = 1; i <= limit; i++) {
        if (index >= 0 && flagMid1) {
            board[index] += 1;
            lastseed = index;
            index--;
            continue;
        }
        //put a seed in your container
        if (index < 0) {
            board[player1pos] += 1;
            flagMid1 = 0;
            flagMid2 = 1;
            lastseed = nContainers.length; //player 1 container
            index = nContainers.length / 2;
            continue;
        }

        if (index < nContainers.length && flagMid2) {
            board[index] += 1;
            lastseed = index;
            index++;
            if (index >= nContainers.length) {
                flagMid1 = 1;
                flagMid2 = 0;
                lastseed = index;
                index = (nContainers.length / 2) - 1;
            }
            continue;
        }
    }
    updateBoard(board, nContainers);

    endGame(items, e, nContainers);
    verifylLastSeed(lastseed, 1, nContainers);

}


function distributePlayer2RowSeeds(e, limit, startIndex, nContainers) {

    writeLog("Computer plays in container " + startIndex + " with " + limit + " seeds;")
    let items = Array.from(nContainers);
    let player2pos = nContainers.length + 1;
    let index = startIndex + 1;
    let lastseed = startIndex + 1; //to know where is last seed position
    //flag to know in witch container we are
    let flagMid1 = 0;
    let flagMid2 = 1;

    board[startIndex] = 0;
    for (let i = 1; i <= limit; i++) {
        if (index < nContainers.length && flagMid2) {
            board[index] += 1;
            lastseed = index;
            index++;
            continue;
        }
        //put a seed in your container
        if (index == nContainers.length) {
            board[player2pos] += 1;
            lastseed = index + 1; //player 2 position in the board
            flagMid1 = 1;
            flagMid2 = 0;
            index = (nContainers.length / 2) - 1;
            continue;
        }

        if (index >= 0 && flagMid1) {
            board[index] += 1;
            lastseed = index;
            index--;
            if (index < 0) {
                flagMid1 = 0;
                flagMid2 = 1;
                index = nContainers.length / 2;
            }
            continue;
        }
    }
    console.log(board);
    updateBoard(board, nContainers);
    endGame(items, e, nContainers);
    verifylLastSeed(lastseed, 2, nContainers);

}

function writeLog(message) {
    let log = document.getElementById("log");
    log.innerHTML += '<div class="log-item">  <div class="seed log-item"  style=" background:' + getRandomSeedColor() + '"></div>' + message + ' </div>';

    log.scrollTop = log.scrollHeight;
}

//play against computer
function playComputer() {


    let nContainers = document.getElementsByClassName("item");

    let noEmptyIndex = null;
    for (let i = nContainers.length / 2; i < nContainers.length; i++) {
        if (board[i] != 0) {
            noEmptyIndex = i;
            break;
        }
    }
    if (noEmptyIndex != null) {
        document.getElementById(noEmptyIndex).click();
    }

}

//play against player
function playAgainstOpponent() {
    whoIsOpponent = "player";

}

function playAgainstComputer() {
    whoIsOpponent = "computer";

}

function addContainers(numberOfContainers) {
    let mid1 = document.getElementsByClassName("mid1");
    let mid2 = document.getElementsByClassName("mid2");
    let player1 = document.getElementById("p1");
    let player2 = document.getElementById("p2");
    //clean all elements 
    mid1[0].innerHTML = '';
    mid2[0].innerHTML = '';
    player1.innerHTML = '';
    player2.innerHTML = '';

    //append items
    for (let i = 0; i < numberOfContainers; i++) {
        mid1[0].innerHTML += '<div id="' + i + '" class="mid1 item"> </div>';
        mid2[0].innerHTML += '<div id="' + (numberOfContainers + i) + '" class=" mid2 item"> </div>'
    }

    configs.containers = numberOfContainers;
}

function addSeeds(numberOfSeeds) {
    let ncontainers = document.getElementsByClassName("item");
    let size = 0;
    //append items
    for (let i = 0; i < ncontainers.length; i++) {
        for (let j = 0; j < numberOfSeeds; j++) {
            ncontainers[i].innerHTML += '<span class="seed"  style=" background:' + getRandomSeedColor() + '"></span>';

        }
        size = i;
        board[i] = numberOfSeeds;
    }
    board[++size] = 0; //player1 
    board[++size] = 0; //player2
    console.log(board);
    configs.seeds = numberOfSeeds;
}

//clear and stop board game
function resetGame() {
    let mid1 = document.getElementsByClassName("mid1");
    let mid2 = document.getElementsByClassName("mid2");
    let player1 = document.getElementById("p1");
    let player2 = document.getElementById("p2");

    //clean all elements 
    mid1[0].innerHTML = '';
    mid2[0].innerHTML = '';
    player1.innerHTML = '';
    player2.innerHTML = '';


}

function hasClass(elem, className) {
    return elem.classList.contains(className);
}


function SelectFirstPlayer1() {
    let nContainers = document.getElementsByClassName("item");
    let item = nContainers[nContainers.length / 2];
    enableEvents(nContainers, 'mid1');
    disableEvents(item, nContainers, 'mid2');

}


function SelectFirstPlayer2() {
    let nContainers = document.getElementsByClassName("item");
    let item = nContainers[nContainers.length / 3];
    enableEvents(nContainers, 'mid2');
    disableEvents(item, nContainers, 'mid1');
    if (whoIsOpponent === "computer") {
        playComputer();
    }

}



//after 'do you like to play again?' start new round
function playAgain() {
    let nContainers = document.getElementsByClassName("item");
    var message = document.getElementById("winning-message");
    message.classList.add('hide');
    enableEvents(nContainers, 'mid1');
    enableEvents(nContainers, 'mid2');
    addContainers(configs.containers);
    addSeeds(configs.seeds);
}

function noPlayAgain() {
    var message = document.getElementById("winning-message");
    message.classList.add('hide');
}


//addDataToScoreboard(JSON.parse(response));

function addDataToScoreboard(scores) {

    var tbody = document.getElementById("tbody")
    for (var i = 0; i < scores.length; i++) {
        var tr = document.createElement('tr');
        var td = "<td>" + scores[i].displayName + "</td>" +
            "<td>" + (i + 1) + "</td>" +
            "<td>" + '1' + "</td>";
        tr.innerHTML = td;
        tbody.appendChild(tr);
    }
}

// functions =======================================


let game = {
    showDropOptions: showDropOptions,
    showDropOptionsSeeds: showDropOptionsSeeds,
    addContainers: addContainers,
    addSeeds: addSeeds,
    playAgain: playAgain,
    noPlayAgain: noPlayAgain,
    resetGame: resetGame,
    showDropOptionsPlayer: showDropOptionsPlayer,
    showDropOptionsAgainst: showDropOptionsAgainst,
    SelectFirstPlayer1: SelectFirstPlayer1,
    SelectFirstPlayer2: SelectFirstPlayer2,
    playAgainstComputer: playAgainstComputer,
    playAgainstOpponent: playAgainstOpponent


}
export {
    game
}

//add object game to window so it can be used on the html to call the onclick methods
window.game = game;


//load the first code on a browser readyState is the as window.onload
(function(window, document) {

    let teste = new gameBoard('mc', 0, [2, 3], 'zp', 1, [2, 9], 'mc');
    console.log("teste do board", teste);
    var t = setInterval(function() {
        if ('complete' === document.readyState) {
            clearInterval(t);

            let scores = cookie.getCookie('scores');
            if (scores) {
                addDataToScoreboard(scores);
            }
        }
    }, 10);
})(window, document);