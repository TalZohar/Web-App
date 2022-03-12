
class GameBase {
    constructor (io, socket, room, numOfAnswers) {
        this.io = io
        this.socket = socket
        this.room = room
        this.numOfAnswers = numOfAnswers
        console.log(numOfAnswers)

    }

    async run(){
        let {userQuestions, questionUsers} = this.#createMatchup(this.room.getNumOfUsers(), this.numOfAnswers)
        this.userQuestions = userQuestions
        this.questionUsers = questionUsers
        
        for (let i = 0; i < this.room.getNumOfUsers(); i++){
            this.getAnswers(i)
        }
    }

    async getAnswers(user_num){
        let user = this.room.users[user_num]
        let questions = this.userQuestions[user_num]
        let answers = []



        for (let i = 0; i < questions.length; i++){
            let questionNum = questions[i]
            await new Promise((resolve, reject) => {
                this.io.to(user.id).emit("question", {data: this.getQuestion(questionNum)})
                resolve()
            })
            let answer = await new Promise((resolve, reject) => {
                console.log(`waiting for ${user.name} response for question ${i}`)
                let socket = this.io.sockets.sockets.get(this.room.host_id)
                setTimeout(() => resolve('1'))
                // socket.on("answer", (id, answer)=>{
                // console.log("id", id)
                // if (id === user.id){
                //     resolve(answer)
                // }
                // })
            })
            answers.push(answer)
        }


        // questions.forEach(async (questionNum)=>{
        //     this.io.to(user.id).emit("question", {data: this.getQuestion(questionNum)})

        //     let answer = await new Promise((resolve, reject) => {
        //         console.log("test")
        //         this.io.on("answer", (id, answer)=>{
        //         console.log("id", id)
        //         if (id === user.id){
        //             resolve(answer)
        //         }
        //         })
        //     })

        //     console.log("recieved answer:", answer)
        //     answers.push(answer)


        // })
        console.log(user)
        console.log(answers)
        return answers

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