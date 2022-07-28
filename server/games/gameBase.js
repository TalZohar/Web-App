const EventEmitter = require('events')

class GameBase {
    constructor (io, socket, room, numOfAnswers) {
        this.io = io
        this.socket = socket
        this.room = room
        this.eventEm = new EventEmitter()

        this.numOfAnswers = numOfAnswers
        this.userAnswers = new Array(this.room.getNumOfUsers())
        for (let i = 0; i <this.room.getNumOfUsers(); i++){
            this.userAnswers[i] = new Array(this.numOfAnswers)
            for (let j = 0; j < this.numOfAnswers; j++){
                this.userAnswers[i][j] = null
            }
        }

        this.num_answered = new Array(this.room.getNumOfUsers())
        for (let i = 0; i < this.room.getNumOfUsers(); i++){
            this.num_answered[i] = 0
        }
    }

    async startGame(){
        let {userQuestions, questionUsers} = this.#createMatchup(this.room.getNumOfUsers(), this.numOfAnswers)
        this.userQuestions = userQuestions
        this.questionUsers = questionUsers
        await this.questionPhase()  
        this.io.to(this.room.room_id).emit('questionPhaseEnd')
        console.log("question phase end")

    }

    async questionPhase(){
        this.socket.emit("startCountdown", 1000, 'questionID')

        for (let i = 0; i < this.room.getNumOfUsers(); i++){
            this.sendQuestions(i)
        }
        await new Promise((resolve, reject) => {
            this.eventEm.on("userFinished", (user)=>{
                if (this.hasEveryoneAnswered()){
                    resolve();
                    return;
                }
            })
            this.socket.once('endCountdown', (id)=>{
                if (id === "questionID"){
                    if (!this.hasEveryoneAnswered()){
                        console.log("time ended before everypeople answered <3")
                        this.io.to(this.room.room_id).emit('timeEnd')
                        resolve();
                        return;
                    }
                }
            })
        })
    }

    async sendQuestions(user_num){
        let user = this.room.users[user_num]
        let questions = this.userQuestions[user_num]
        for (let i = 0; i < questions.length; i++){
            console.log("question " + i + " of user " + user.name)
            let questionNum = questions[i]
            await new Promise((resolve, reject) => {
                this.io.to(user.id).emit("question", {data: this.getQuestion(questionNum)})
                resolve()
            })

            let recievedAnswer = false
            while(!recievedAnswer){
                await new Promise((resolve, reject) => {
                    this.socket.once("hostAnswer_"+String(user.id), (user_recieved, answer)=>{
                        if (user_recieved.id == user.id){
                            console.log(answer.data + ' answer ' + i + " of user " + user.name)
                            recievedAnswer = true
                            this.userAnswers[user_num][i] = answer.data
                            resolve()
                        }
                        else{
                            console.log("you shouldn't be here")
                        }
                    })
                })

            }
            this.num_answered[user_num]++
            // console.log(this.num_answered)
            // console.log(this.userAnswers)
            this.socket.emit("updateUserAnswers", this.num_answered, this.room.getUserList())
        }
        this.eventEm.emit("userFinished", user)

    }
    getQuestion(questionNum) {
        return questionNum
    }


    hasEveryoneAnswered() {
        for (let i = 0; i < this.room.getNumOfUsers(); i++){
            if (this.num_answered[i] != this.numOfAnswers){
                return false
            }
        }
        return true
    }


    #createMatchup(userCount, numOfAnswers) {
        let userQuestions = []
        let questionUsers = []
        for (let i = 0; i < userCount; i++){
            userQuestions[i] = []
        }
        let questionNum = 0
        while (true){
            let validUsers = []
            for (let i = 0; i < userCount; i++){
                if (userQuestions[i].length < numOfAnswers){
                    validUsers.push(i)
                }
            }
            if (validUsers.length === 0){
                break
            }
            // find pair
            let firstIndex = Math.floor(Math.random()*validUsers.length)
            let first = validUsers[firstIndex]
            validUsers.splice(firstIndex, 1)

            if (validUsers.length === 0){
                break
            }
            let secondIndex = Math.floor(Math.random()*validUsers.length)
            let second = validUsers[secondIndex]

            // update arrays
            userQuestions[first].push(questionNum)
            userQuestions[second].push(questionNum)
            questionUsers[questionNum] = [first, second]
            questionNum++
        }
        return {userQuestions, questionUsers}
    }

}

module.exports = GameBase