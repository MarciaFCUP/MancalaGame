'use strict';
const path = require('path');
module.exports = function(app) {
    var register = require('../controllers/registerController');
    var ranking = require('../controllers/rankingController');
    // register Routes
    app.route('/register')
        .post(register.create_a_register, (req, res, next) => {


            if (!req.error) {
                next();
                return;
            }

            res.status(404).send('unknown');
        });

    app.route('/register/:registerId')
        .get(register.read_a_register, (req, res, next) => {
            if (req.register) {
                next();
                return;
            }

            res.status(404).send('Not found');
        });


    // register Routes
    app.route('/ranking')
        .post(ranking.read_ranking, (req, res, next) => {
            if (req.ranking) {
                next();
                return;
            }

            res.status(404).send('Not found');
        });

    //route to indext to start the app
    app.get('/', function(req, res) {

        let pathfile = path.join(__dirname, '../../../../index.html');
        console.log('path', pathfile)
        res.sendFile(pathfile);
    });
};