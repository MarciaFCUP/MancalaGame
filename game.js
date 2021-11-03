import { cookie } from "./login.js";

function showDropOptions() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function showDropOptionsSeeds() {
    document.getElementById("myDropdownSeeds").classList.toggle("show");
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
let game = {
    showDropOptions: showDropOptions,
    showDropOptionsSeeds: showDropOptionsSeeds,
    addContainers: addContainers,
    addSeeds: addSeeds
}
export {
    game
}
//add object game to window so it can be used on the html to call the onclick methods
window.game = game;

// Global letiables =======================================

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



// Pre-canned marble colors
const marbleColors = [
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
        console.log('event', e);

        let nContainers = document.getElementsByClassName("item");
        console.log('Ncontainers', nContainers);


        let numSeeds = e.target.children.length;
        let items = Array.from(nContainers);
        let filterItem = items.filter(x => x.id == e.target.id); //creats new array with target only id
        console.log('Nitems', items);
        let item = filterItem[0];

        //clean container
        e.target.innerHTML = '';

        if (hasClass(item, 'mid1')) {
            currentPlayer = 1
        } else {
            currentPlayer = 2
        }
        let startIndex = Number(item.id);
        let limit = numSeeds;
        if (currentPlayer === 1) {

            distributePlayer1RowSeeds(limit, startIndex, nContainers);
            whoIsNextPlayer = 2;

            //needs variable to control if the user will play or not again
            disableEvents(e.target, nContainers, 'mid1');
            enableEvents(nContainers, 'mid2');
            endGame(items, e, nContainers);
        } else {
            distributePlayer2RowSeeds(limit, startIndex, nContainers);

            disableEvents(e.target, nContainers, 'mid2');
            enableEvents(nContainers, 'mid1');
            endGame(items, e, nContainers);
        }


    }

}, false);



// End Events =======================================

// functions =======================================

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
            player2.innerHTML += '<span class="dot"></span>';

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
            player1.innerHTML += '<span class="dot"></span>';


        }
        disableEvents(items[items.length - 1], nContainers, 'mid2');
        disableEvents(items[0], nContainers, 'mid1');
        compareNumSeeds()
        var message = document.getElementById("winning-message"); //.style.visibility = 'visible';
        message.classList.remove('hide');

    }


    // compare number seeds in each player
    function compareNumSeeds() {

        let seedsP1 = document.getElementById("p1").children.length;
        let seedsP2 = document.getElementById("p2").children.length;
        console.log("seedsP1", seedsP1);

        saveScore('Player 1', seedsP1)
        saveScore('Player 2', seedsP2)

        if (seedsP1 > seedsP2) {
            whoIsWinner = 1;
            document.getElementById('winning-message').innerHTML += '<br>You are the winner!<br>';
        } else {
            whoIsWinner = 2;
            document.getElementById('winning-message').innerHTML += '<br>You lose!<br>';
        }
        //clean board
        resetGame();

    }
}

function saveScore(name, value) {

    var score = {
        displayName: name,
        score: value
    };

    var scores = cookie.getCookie('scores');
    if (scores == null) {
        scores = []
    }
    scores.push(score);
    addDataToSocreboard(scores)
    cookie.setCookie('scores', scores)
}



function disableEvents(item, nContainers, midTarget) {
    if (hasClass(item, midTarget)) {
        var elements = Array.from(nContainers).filter(x => x.className == item.className);
        console.log('disableEvents', elements);
        elements.forEach(element => {
            element.classList.add('disabled');
            element.setAttribute('disabled', 'disabled');
        });
    }
}

function enableEvents(nContainers, midTarget) {
    var elements = Array.from(nContainers).filter(x => x.classList.contains(midTarget));
    console.log('enableEvents', elements);
    elements.forEach(element => {
        element.classList.remove('disabled');
        element.removeAttribute('disabled');
    });

}

function distributePlayer1RowSeeds(limit, startIndex, nContainers) {

    let index = startIndex - 1;
    //flag to know in witch container we are
    let flagMid1 = 1;
    let flagMid2 = 0;
    for (let i = 1; i <= limit; i++) {

        if (index >= 0 && flagMid1) {

            nContainers[index].innerHTML += '<span class="dot"></span>';
            index--;
            continue;
        }
        //put a seed in your container
        if (index < 0) {
            let player1 = document.getElementById("p1");

            player1.innerHTML += '<span class="dot"></span>';
            flagMid1 = 0;
            flagMid2 = 1;
            index = nContainers.length / 2;
            continue;
        }

        if (index < nContainers.length && flagMid2) {

            nContainers[index].innerHTML += '<span class="dot"></span>';
            index++;
            if (index >= nContainers.length) {
                flagMid1 = 1;
                flagMid2 = 0;
                index = (nContainers.length / 2) - 1;

            }

            continue;
        }

    }

}

function distributePlayer2RowSeeds(limit, startIndex, nContainers) {
    let index = startIndex + 1;
    //flag to know in witch container we are
    let flagMid1 = 0;
    let flagMid2 = 1;
    for (let i = 1; i <= limit; i++) {

        if (index < nContainers.length && flagMid2) {
            nContainers[index].innerHTML += '<span class="dot"></span>';
            index++;
            continue;
        }
        //put a seed in your container
        if (index == nContainers.length) {
            let player2 = document.getElementById("p2");
            player2.innerHTML += '<span class="dot"></span>';
            flagMid1 = 1;
            flagMid2 = 0;
            index = (nContainers.length / 2) - 1;
            continue;
        }

        if (index >= 0 && flagMid1) {

            nContainers[index].innerHTML += '<span class="dot"></span>';
            index--;
            if (index < 0) {
                flagMid1 = 0;
                flagMid2 = 1;
                index = nContainers.length / 2;
            }

            continue;
        }

    }

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
}

function addSeeds(numberOfSeeds) {
    let ncontainers = document.getElementsByClassName("item");
    //append items
    for (let i = 0; i < ncontainers.length; i++) {
        for (let j = 0; j < numberOfSeeds; j++) {
            ncontainers[i].innerHTML += '<span class="dot"></span>';
        }
    }

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





// functions =======================================


//load entire code on a browser load
window.onload = function() {
    //your code

    let scores = cookie.getCookie('scores');
    console.log('scores', scores);
    if (scores) {
        addDataToSocreboard(scores);
    }


    //assign event to the element
    //after 'do you like to play again?' start new round
    document.getElementById("playAgain").addEventListener('click', function(e) {
        console.log("entrou nomyeeees")
        let nContainers = document.getElementsByClassName("item");
        if (hasClass(e.target, 'button-yes')) {
            var message = document.getElementById("winning-message");
            console.log("agora msg", message);
            message.classList.add('hide');
            enableEvents(nContainers, 'mid1');
            enableEvents(nContainers, 'mid2');
            //retirar as seeds
        }

    });


}


//addDataToSocreboard(JSON.parse(response));

function addDataToSocreboard(scores) {

    var tbody = document.getElementById("tbody")
    for (var i = 0; i < scores.length; i++) {

        var tr = document.createElement('tr');
        var td = "<td>" + (i + 1) + "</td>" +
            "<td><img class='avatar2' src='https://www.w3schools.com/howto/img_avatar2.png'/>" +
            scores[i].displayName + "</td>" +
            "<td>" + scores[i].score + "</td>";
        tr.innerHTML = td;
        tbody.appendChild(tr)
    }
}