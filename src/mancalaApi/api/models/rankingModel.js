'use strict';
const fs = require('fs').promises;


class Ranking {
    async readFile(filePath) {
        try {
            const data = await fs.readFile(filePath);
            console.log("reading ranking file", data.toString());
            return JSON.parse(data);
        } catch (error) {
            console.error(`Got an error trying to read the file ranking: ${error.message}`);
        }

    }

}


var RankingModule = new Ranking();

module.exports = RankingModule;