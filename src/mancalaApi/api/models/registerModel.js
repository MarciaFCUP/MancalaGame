'use strict';
const fs = require('fs').promises;
const errorLogin = { "error": "User registered with a different password" };
const okLogin = {};
const newUser = "newUser";
var crypto = require('crypto');
class Register {
    //return password from a user nick
    findById(x, somename) {
        console.log("x", x);
        var result = [];
        try {
            for (let i = 0; i < x.length; i++) {
                console.log("entrou", x[i]);
                if (x[i].nick == somename) {
                    result.push(x[i].password);
                    console.log("resultado1", x[i].password);
                }
            }
            return result; //Array containing matched names. Returns empty array if no matches found.
        } catch (error) {
            console.error({ "error": "got an error" + error.message });
        }

    }


    async readFile(filePath) {
            try {
                const data = await fs.readFile(filePath);

                return JSON.parse(data);
            } catch (error) {
                console.error({ "error": `Got an error trying to read the file: ${error.message}` });
            }
        }
        //writeFile
    async writeFile(filePath, content) {
        var string = content.password;
        //encrypting pass
        var hash = crypto.createHash('md5').update(string).digest('hex');
        content.password = hash;
        try {
            console.log('content', content)
            const verify = await verifyUser(filePath, content.nick, content.password);


            if (verify == "newUser") {
                var val = await this.readFile(filePath);
                val.push(content);
                await fs.writeFile(filePath, JSON.stringify(val));
                return okLogin;
            } else {
                return verify;
            }
        } catch (error) {
            console.error({ "error": `Got an error trying to write to a file: ${error.message}` });
        }
    }



}

async function verifyUser(filePath, nickname, pass) {
    const objs = await RegisterModule.readFile(filePath);
    for (let i = 0; i < objs.length; i++) {
        //  console.log("a verificar user e pass", objs[i]);
        if (objs[i].nick == nickname) {
            if (objs[i].password == pass) {
                return okLogin;
            } else {
                return errorLogin;
            }
        }
    }
    return newUser;
}


var RegisterModule = new Register();


module.exports = RegisterModule;