'use strict';


const RegisterModule = require('../models/registerModel.js');
var path = require('path');
const res = require('express/lib/response');


exports.create_a_register = async function(req, res) {
    console.log("resuest", req.body);

    var result = await RegisterModule.writeFile(path.join(__dirname, '../registerFile.json'), req.body);

    if (req.body.password == "" || req.body.nick == "") {
        res.statusMessage = "nick is undefined";
        res.status(400);

        res.end();

    }
    if (result.error == "User registered with a different password") {

        res.statusMessage = "Current password does not match";
        res.status(401);
        res.json(result);
        res.end();

    }
    if (result.error) {
        res.statusMessage = result.error;
        res.status(404);
        res.json(result);
        res.end();
    } else {
        res.json(result);
    }
    //var new_register = new Register(req.body);
    // res.json(await RegisterModule.writeFile(path.join(__dirname, '../registerFile.json'), req.body));
};

exports.read_a_register = async function(req, res) {
    const objs = await RegisterModule.readFile(path.join(__dirname, '../registerFile.json'));
    res.json(RegisterModule.findById(objs, req.params.registerId)); //req.params.register

};