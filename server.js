var express = require('express'),
    app = express(),
    port = process.env.PORT || 8115,
    fs = require('fs'),
    bodyParser = require('body-parser');
fs.Promise = global.Promise;

const path = require('path');
const router = express.Router();
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

const session = require('express-session');
const sessionConfig = {
    secret: 'MYSECRET',
    name: 'mancala',
    resave: false,
    saveUninitialized: false,
    cookie: {
        SameSite: 'true', // THIS is the config you are looing for.
        Secure: 'true'
    }
};

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sessionConfig.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionConfig));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(cors());

var routes = require('./src/mancalaApi/api/routes/registerRoutes');
routes(app);
app.use('/src', express.static(path.join(__dirname + '/src')));
app.use(function(req, res) {
    res.status(200);
    res.status(401).send("Not authorized");
    res.status(404).send('Sorry, url not found!');
    res.status(500).send('Sorry, something went wrong please try again.');

});
app.listen(port);

console.log('mancala RESTful API server started on: ' + port);

//server->routes->controler->model