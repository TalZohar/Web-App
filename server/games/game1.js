GameBase = require('./gameBase')
const fs = require('fs');
const path = require('path')

class Game1 extends GameBase {
    constructor (io, socket, room, numOfAnswers) {
        super(io, socket, room, numOfAnswers)
        this.Path = path.join(__dirname, 'q1.json')
    }
    getQuestionsLstFromFile(){
        let rawdata = fs.readFileSync(this.Path)
        let questions = JSON.parse(rawdata)
        return questions
    }

}


module.exports = Game1