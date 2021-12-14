import { game } from "./game.js";

//group:id; game:string; move:nº cavidade

//  FETCH COM POST E DADOS EM JSON
//join players to start a game
async function join(group, nick, psw, size, inicial) {

    //jogador em espera->emparelha de imediato, sn fica regsitado p emaprelhamento
    //retorna a mão do jogador
    //notificacao do emparelhamento é feita com update

    //RESPOSTA
    //game:id / msg de erro : {"game": "fa93b40…" }
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
            console.log('Error message: ', err);
        });

}

//leave the play not finished
async function leave(nick, psw, game) {
    //duante o emparelhamento sem consequencia
    //durante o jogo vitoria ao adversário
    //jogadas tem 2minutos, se exceder ->leave automatico

    //RESPOSTA
    //error message
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
    //notifica o servidor de uma jogada
    //pedido retornado de imediato
    //move é a cavidade a semear(nº de 0 ate ao N)
    //reporta erros de args ivalidos ou jogar fora da vez
    //resultado da jogada propagado c update para os 2 players

    //RESPOSTA
    //error message-> if no error jogada válida

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
    //retorna a table com max de 10players, ordem decrescente

    //RESPOSTA
    //error mesg / ranking table (nick, nº vitoris, nº jogos)
    //{ "ranking": [{ "nick": "jpleal", "victories": 2, "games": 2 }, { "nick": "zp", "victories": 0, "games": 2 }] }
    //server_request('POST', "http://twserver.alunos.dcc.fc.up.pt:8008/ranking", data);


    //server_request('POST', "http://twserver.alunos.dcc.fc.up.pt:8008/register", data);
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
    //regista plyer e associa lhe psw
    //se ja registado com psw diferente ->erro
    //usada: registo inicial e autenticação no inicio da sessao

    //RESPOSTA
    //error message

    let data = {
        nick: nickin,
        password: psw
    }


    //server_request('POST', "http://twserver.alunos.dcc.fc.up.pt:8008/register", data);
    let result = {};
    return fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register", {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            result = res;
            console.log('Response no register: ', result);
            return result;
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}



//update point of a game => server sent events com GET e args urlencoded
function update(nick, handgame) {

    //enviado em simultaneo para ambos os jogadores
    //no final de cada jogo o objecto eventSource deve ser fechado
    //gerado erro no pedido GET se a referencia ao jogo for invalida

    //RESPOSTA
    //board / error msg / winner
    let url = "http://twserver.alunos.dcc.fc.up.pt:8008/update" + "?" + "nick=" + nick + '&' + "game=" + handgame;

    //  {"board":{"turn":"joana","sides":{"ana":{"store":6,"pits":[0,0,1]},"joana":{"store":3,"pits":[7,1,0]}}},"stores":{"ana":6,"joana":3}}
    // {"board":{"turn":"Ele","sides":{"Ele":{"store":0,"pits":[4,4,3]},"ana":{"store":1,"pits":[3,3,0]}}},"stores":{"ana":1,"Ele":0}}
    const eventSource = new EventSource(url);

    eventSource.addEventListener("message", (event) => {
        console.log("mensagem recebida com data:", event.data);
        const data = JSON.parse(event.data); // "event.data" is a string
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
        game.writeLogTurn(event.data);
        eventSource.close();
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