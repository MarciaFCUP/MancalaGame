// https://jsonplaceholder.typicode.com/posts/1


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
function update(nick, game) {

    //enviado em simultaneo para ambos os jogadores
    //no final de cada jogo o objecto eventSource deve ser fechado
    //gerado erro no pedido GET se a referencia ao jogo for invalida

    //RESPOSTA
    //board / error msg / winner
    let url = "http://twserver.alunos.dcc.fc.up.pt:8008/update" + "?" + "nick=" + nick + '&' + "game=" + game;

    const eventSource = new EventSource(url);
    eventSource.addEventListener("message", (event) => {

        const data = JSON.parse(event.data); // "event.data" is a string
        if ("error" in message) {

        }
        if ("board" in message) {

        }
        if ("winner" in message) {

        }
        // Prints whatever was sent by the server
        console.log(data);
    });


    eventSource.addEventListener("error", (error) => {
        // Prints the information about an error
        console.log(error);
    });



    //---No final de cada jogo o objecto EventSource deve ser fechado!!!---
    eventSource.close();

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