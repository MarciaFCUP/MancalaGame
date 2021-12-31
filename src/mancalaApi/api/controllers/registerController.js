'use strict';


const RegisterModule = require('../models/registerModel.js');
var path = require('path');
const res = require('express/lib/response');


exports.create_a_register = async function(req, res) {
    console.log('path', path.join(__dirname, '../registerFile.json'))

    //var new_register = new Register(req.body);
    res.json(await RegisterModule.writeFile(path.join(__dirname, '../registerFile.json'), req.body));
};

exports.read_a_register = async function(req, res) {
    const objs = await RegisterModule.readFile(path.join(__dirname, '../registerFile.json'));
    res.json(RegisterModule.findById(objs, req.params.registerId)); //req.params.register

};