import { api } from "./api.js";

function loginFuntion(event) {

    let myForm = document.getElementById('myForm');
    let data = new FormData(myForm);
    data = data.entries();
    var obj = data.next();
    var retrieved = {};
    while (undefined !== obj.value) {
        retrieved[obj.value[0]] = obj.value[1];
        obj = data.next();
    }

    console.log('retrieved: ', retrieved);
    if (retrieved.uname != "" && retrieved.psw != "") {
        let resul = {};

        api.register(retrieved.uname, retrieved.psw).then(value => {
            resul = value;
            console.log("no login value ", value);
            if (api.isEmpty(resul)) {
                setLoginCookie(retrieved.uname, retrieved.psw);
                document.getElementById('navLogin').style.display = 'none';
                checkLoginCookie();
                document.getElementById('id01').style.display = 'none';

                console.log("ok");
            } else {
                let user = document.getElementById("errLogin");
                user.innerText = resul.error;
                console.log("njk", resul.error);
            }

        });

    }

}

// Get the modal
var modal = document.getElementById('id01');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }


}

// Cookie functions =======================================
function getCookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;

}


function setLoginCookie(username, psw) {
    let user = {
        username: username,
        password: encodeURI(psw)
    };

    setCookie('userSession', user);
}

function setCookie(name, value) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * 15);
    var cookie = name + "=" + JSON.stringify(value) + ";path=/" + ";expires=" + expire.toUTCString() + ";SameSite=Strict; Secure=true";
    document.cookie = cookie;
}

function checkLoginCookie() {
    let user = getCookie('userSession');
    if (user != undefined && user != "") {
        var displayUsername = document.getElementById('displayUsername');
        displayUsername.innerHTML = "Welcome " + user.username + "!";
        document.getElementById('navLogin').style.display = 'none';
        document.getElementById('pleaseLogin').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('displayGame').style.display = 'block';

    } else {
        document.getElementById('logout').style.display = 'none';
        document.getElementById('pleaseLogin').style.display = 'block';
        document.getElementById('displayGame').style.display = 'none';
        document.getElementById('id01').click();
    }
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function logout() {
    deleteCookie('userSession');
    deleteCookie('scores');
    document.getElementById('pleaseLogin').style.display = 'block';
    window.location.reload(false);

}

//End Cookie functions =======================================


//Export functions =======================================
// we define an object to export so we can call it like cookie.getCookie('name', value)
const cookie = {
    setCookie: setCookie,
    getCookie: getCookie,
    deleteCookie: deleteCookie
}

const login = {
    logout: logout,
    login: loginFuntion
}

export {
    cookie
};

//load the first code on a browser readyState
(function(window, document) {
    var t = setInterval(function() {
        if ('complete' === document.readyState) {
            clearInterval(t);

            //check do login
            checkLoginCookie();
            window.login = login;
        }
    }, 10);
})(window, document);

//End Export functions =======================================