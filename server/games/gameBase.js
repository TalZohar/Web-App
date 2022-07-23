class GameBase {
    constructor (io, socket, room, numOfAnswers) {
        this.io = io
        this.socket = socket
        this.room = room
        this.numOfAnswers = numOfAnswers
        this.userAnswers={}
        this.num_answered=0
        console.log(numOfAnswers)

    }

    async startGame(){
        let {userQuestions, questionUsers} = this.#createMatchup(this.room.getNumOfUsers(), this.numOfAnswers)
        this.userQuestions = userQuestions
        this.questionUsers = questionUsers
        this.questionPhase()
        
    }

    async questionPhase(){
        this.socket.emit("startCountdown")

        this.socket.on("endCountdown", ()=>{
            return;
        })

        for (let i = 0; i < this.room.getNumOfUsers(); i++){
            this.sendQuestions(i)
        }
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
                    this.socket.on("hostAnswer", (user, answer)=>{
                        if (this.room.room_id == user.room_id){
                            console.log('answer ' + i + " of user " + user.name)
                            recievedAnswer = true
                            resolve()
                        }
                        else{
                            console.log("you shouldn't be here")
                        }
                    })
                })
            }
        }
    }
    getQuestion(questionNum) {
        return questionNum
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