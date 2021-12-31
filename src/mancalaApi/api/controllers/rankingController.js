var path = require('path');

const RankingModule = require('../models/rankingModel.js');

exports.read_ranking = async function(req, res) {
    console.log('path', path.join(__dirname, '../rankingFile.json'));
    res.json(await RankingModule.readFile(path.join(__dirname, '../rankingFile.json'), req.body));
};