GameBase = require('./gameBase')
const fs = require('fs');
const path = require('path')

class Game1 extends GameBase {
    constructor (io, socket, room, numOfAnswers) {
        super(io, socket, room, numOfAnswers)
        this.Path = path.join(__dirname, 'q1.json')
        this.gameType='text'
    }
    async getQuestionsLstFromFile(){
        let rawdata = fs.readFileSync(this.Path)
        let questions = JSON.parse(rawdata)
        return questions
    }
}

class Game2 extends GameBase {
    constructor (io, socket, room, numOfAnswers) {
        super(io, socket, room, numOfAnswers)
        this.Path = path.join(__dirname, 'q2')
        this.gameType='meme'
    }
    async getQuestionsLstFromFile(){
        const files = fs.readdirSync(this.Path)
        let questions = []
        for (const file of files) {
            await new Promise((res, rej) => {
                fs.readFile(path.join(this.Path, file), function(err, buf){
                    questions.push(buf.toString('base64'))
                    res()
                  }) 
            })

        }
        // console.log(questions)
        return questions
    }

}

class Game3 extends GameBase {
    constructor (io, socket, room, numOfAnswers) {
        super(io, socket, room, numOfAnswers)
        this.Path = path.join(__dirname, 'q3.json')
        this.gameType='drawing'
    }
    getQuestionsLstFromFile(){
        let rawdata = fs.readFileSync(this.Path)
        let questions = JSON.parse(rawdata)
        return questions
    }

}



module.exports = {Game1, Game2, Game3}