import { game } from "./game.js";

async function join(group, nick, psw, size, inicial) {

    let data = {
        group: group,
        nick: nick,
        password: psw,
        size: size,
        initial: inicial

    }

    let result = {};

    return fetch("http://twserver.alunos.dcc.fc.up.pt:8008/join", {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            result = res;
            console.log('Response no join: ', result);
            return result;
        })
        .catch(err => {
            // Handle error 
            game.writeLogError(err);
            console.log('Error message: ', err);
        });

}

//leave the play not finished
async function leave(nick, psw, game) {


    let data = {
        nick: nick,
        password: psw,
        game: game
    }


    let result = {};

    return fetch("http://twserver.alunos.dcc.fc.up.pt:8008/leave", {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            result = res;
            console.log('Response no join: ', result);
            return result;
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}
//notify server from a play
async function notify(nick, psw, game, move) {


    let data = {
        nick: nick,
        game: game,
        password: psw,
        move: move
    }

    //server_request('POST', "http://twserver.alunos.dcc.fc.up.pt:8008/notify", data);

    let result = {};

    return fetch("http://twserver.alunos.dcc.fc.up.pt:8008/notify", {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            result = res;
            console.log('Response no join: ', result);
            return result;
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}
//returns a classification table
async function ranking() {

    let result = {};
    return fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking", {
            method: "POST",
            body: '{}'
        })
        .then(response => response.json())
        .then(res => {
            result = res;
            // Handle response 

            console.log('Response no ranking: ', result);
            return result;
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}
//regists a user  with a password
async function register(nickin, psw) {


    let data = {
        "nick": nickin,
        "password": psw
    };
    let result = {};

    return fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

        })
        .then(response => response.json())
        .then(res => {
            result = res;
            console.log('Response no register: ', res);

            return result;
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}



//update point of a game => server sent events com GET e args urlencoded
function update(nick, handgame) {


    console.log("no server sent event", handgame);

    let url = "http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=" + nick + "&game=" + handgame;

    //  {"board":{"turn":"joana","sides":{"ana":{"store":6,"pits":[0,0,1]},"joana":{"store":3,"pits":[7,1,0]}}},"stores":{"ana":6,"joana":3}}

    const eventSource = new EventSource(encodeURI(url));
    eventSource.addEventListener("message", (event) => {
        console.log("mensagem recebida com data:", event.data);
        const data = JSON.parse(event.data); // "event.data" is a string
        console.log("data nova", data);
        if ("error" in data) {
            console.log("recebi erro no SSE vou fechar");
            eventSource.close();
        }
        if ("board" in data) {
            console.log("recebi board no sse");
            let nContainers = document.getElementsByClassName("item");
            let myBoard = [];

            let player1pos = nContainers.length;
            let player2pos = nContainers.length + 1;

            console.log("quem tem que jogar:", data.board.turn);
            game.writeLogTurn("vez de jogar: " + data.board.turn);
            //my board side
            let items = data.stores;
            let opp;
            for (let key in items) {
                if (key != nick) {
                    opp = key;
                    myBoard[player2pos] = items[key];
                }
                if (key == nick) {
                    myBoard[player1pos] = items[key];
                }
                console.log("entra", key);
            }

            //  { "board": { "turn": "joana", "sides": { "joana": { "store": 0, "pits": [3, 3, 3] }, "ana": { "store": 0, "pits": [3, 3, 3] } } }, "stores": { "joana": 0, "ana": 0 } }
            items = data.board.sides;
            for (let key in items) {
                //we are in opponente
                if (key != nick) {
                    console.log("items", items[key]);
                    let obj = items[key];
                    for (let v in items[key]) {
                        if (v == "pits") {
                            let obj2 = obj[v];
                            console.log("opp board", obj2.reverse());
                            let obj2rev = obj2.reverse();
                            let j = 0;
                            for (let i = nContainers.length / 2; i < nContainers.length; i++) {
                                myBoard[i] = obj2rev[j++];
                            }
                        }

                    }



                }
                //we are in my board
                if (key == nick) {
                    let obj = items[key];
                    for (let v in items[key]) {
                        if (v == "pits") {
                            let obj2 = obj[v];
                            let obj2rev = obj2.reverse();
                            console.log("my board", obj2); // aqui n esta reverse
                            for (let i = 0; i < nContainers.length / 2; i++) {
                                myBoard[i] = obj2rev[i];
                            }
                        }

                    }
                }
            }
            game.updateBoard(myBoard, nContainers);




        }
        if ("winner" in data) {
            //---No final de cada jogo o objecto EventSource deve ser fechado!!!---
            console.log("fechou o SSE");
            game.writeLogTurn("winner is " + data.winner);
            eventSource.close();
            var message = document.getElementById("winning-message"); //.style.visibility = 'visible';
            message.classList.remove('hide');
            message.innerHTML += "winner is " + data.winner;
        }

    }, false);

    eventSource.addEventListener("open", (event) => {
        // Prints the information about an error

        console.log("iniciou conexao sse", event);
    }, false);
    eventSource.addEventListener("error", (event) => {
        if (event.readyState == EventSource.CLOSED) {
            console.log("Connection was closed. ");
        }
        // Prints the information about an error
        console.log("erro no sse:", event);
        game.writeLogTurn("error on server sent event");
        eventSource.close();
        console.log("Connection was closed. ");
    }, false);





}


//using xmlhttprequest insted fetch
function server_request(reqType, request, objTosend) {

    if (!XMLHttpRequest) {
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open(reqType, request, true);

    xhr.onreadystatechange = function() {
        console.log("status xhr", xhr.status);
        console.log("response text xhr", xhr.responseText);
        let res = xhr.responseText;
        return res;

    }
    if (objTosend) {
        xhr.send(JSON.stringify(objTosend));

    } else {
        console.log("empty send");
        xhr.send();
    }

}

//verify answer
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function answerValues(Obj) {
    let resul = Object.values(Obj)
    console.log(resul); // return an array with values
    return resul;
}



//export module
let api = {
    register: register,
    join: join,
    leave: leave,
    ranking: ranking,
    notify: notify,
    update: update,
    isEmpty: isEmpty,
    answerValues: answerValues


}

export {
    api
}
window.api = api;