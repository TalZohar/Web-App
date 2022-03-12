GameBase = require('./gameBase')

class Game1 extends GameBase {
    constructor (io, socket, room, numOfAnswers) {
        super(io, socket, room, numOfAnswers)
    }
}


module.exports = Game1