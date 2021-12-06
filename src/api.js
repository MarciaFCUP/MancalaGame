// https://jsonplaceholder.typicode.com/posts/1


//group:id; game:string; move:nº cavidade

//  FETCH COM POST E DADOS EM JSON
//join players to start a game
function join(group, nick, psw) {

    //jogador em espera->emparelha de imediato, sn fica regsitado p emaprelhamento
    //retorna a mão do jogador
    //notificacao do emparelhamento é feita com update

    //RESPOSTA
    //game:id / msg de erro : {"game": "fa93b40…" }
    let data = {
        "group": group,
        "nick": nick,
        "password": psw
    }

    const fetchPromise = fetch("http://twserver.alunos.dcc.fc.up.pt:8008/join", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        // Converting to JSON
    fetchPromise.then(response => response.json())
        .then(res => {
            // Handle response 
            console.log('Response: ', res.game);
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });

}

//leave the play not finished
function leave(nick, psw, game) {
    //duante o emparelhamento sem consequencia
    //durante o jogo vitoria ao adversário
    //jogadas tem 2minutos, se exceder ->leave automatico

    //RESPOSTA
    //error message
    let data = {
        "nick": nick,
        "password": psw,
        "game": game
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/leave", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        // Converting to JSON
        .then(response => response.json()) //obj resposta {}
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}
//notify server from a play
function notify(nick, psw, game, move) {
    //notifica o servidor de uma jogada
    //pedido retornado de imediato
    //move é a cavidade a semear(nº de 0 ate ao N)
    //reporta erros de args ivalidos ou jogar fora da vez
    //resultado da jogada propagado c update para os 2 players

    //RESPOSTA
    //error message-> if no error jogada válida

    let data = {
        "nick": nick,
        "game": game,
        "password": psw,
        "move": move
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/notify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        // Converting to JSON
        .then(response => response.json())
        .then(res => {
            // Handle response 
            console.log('Response: ', res);
        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });



}
//returns a classification table
function ranking() {
    //retorna a table com max de 10players, ordem decrescente

    //RESPOSTA
    //error mesg / ranking table (nick, nº vitoris, nº jogos)
    //{ "ranking": [{ "nick": "jpleal", "victories": 2, "games": 2 }, { "nick": "zp", "victories": 0, "games": 2 }] }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        // Converting to JSON
        .then(response => response.json())
        .then(res => {
            // Handle response 
            console.log('Response: ', res);

            // Create a variable to store HTML
            // Loop through each data and add a table row
            json.forEach(user => {
                li += '<tr> <td>${user.nick} </td> <td>${user.victories}</td> <td>${user.games}</td></tr>';
            });

            // Display result
            document.getElementById("tbody").innerHTML = li;

        })
        .catch(err => {
            // Handle error 
            console.log('Error message: ', err);
        });


}
//regists a user  with a password
function register(nick, psw) {
    //regista plyer e associa lhe psw
    //se ja registado com psw diferente ->erro
    //usada: registo inicial e autenticação no inicio da sessao

    //RESPOSTA
    //error message

    let data = {
        "nick": nick,
        "password": psw
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        // Converting to JSON
        .then(response => response.json())
        .then(res => {
            // Handle response 
            console.log('Response: ', res);
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

    const eventSource = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8008/update", { withCredentials: true });
    eventSource.addEventListener("message", (event) => {
        // "event.data" is a string
        const data = JSON.parse(event.data);

        // Prints whatever was sent by the server
        console.log(data);
    });


    eventSource.addEventListener("error", (error) => {
        // Prints the information about an error
        console.log(error);
    });


    var source = new SSE("http://twserver.alunos.dcc.fc.up.pt:8008/update?" + 'nick=' + nick + "&game=" + game, {
        headers: { 'Content-Type': 'text/plain' },
        payload: 'Hello, world!',
        method: 'GET'
    });

    source.addEventListener("message", (event) => {
        // "event.data" is a string
        const data = JSON.parse(event.data);

        // Prints whatever was sent by the server
        console.log(data);
    });

    //---No final de cada jogo o objecto EventSource deve ser fechado!!!---
    eventSource.close();

}