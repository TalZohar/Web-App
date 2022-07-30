const EventEmitter = require('events')
class GameBase {
    constructor (io, socket, room, numOfAnswers) {
        this.io = io
        this.socket = socket
        this.room = room
        this.eventEm = new EventEmitter()

        this.numOfAnswers = numOfAnswers
        this.userAnswers = new Array(this.room.getNumOfUsers())
        this.userVotes = new Array(this.room.getNumOfUsers())
        for (let i = 0; i <this.room.getNumOfUsers(); i++){
            this.userVotes[i]=0
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
        console.log(this.userQuestions)
        console.log(this.questionUsers)
        this.initQuestions()
        await this.questionPhase()  
        this.io.to(this.room.room_id).emit('questionPhaseEnd')
        console.log("question phase end")
        await this.votingPhase()

    }

    async votingPhase(){
        for (let i = 0; i <this.questionUsers.length; i++){
            console.log('waiting for vote')
            await this.getVote(this.questionUsers[i])
        }
        console.log(this.userVotes)
    }

    async getVote(question_users){
        this.io.to(this.room.room_id).emit('voting')
        let votes_cnt=0
        while(votes_cnt!=this.room.getNumOfUsers()){
            await new Promise((resolve, reject) => {
                this.socket.once("hostVote_"+String(this.room.room_id), (user,vote)=>{
                    console.log('recieved vote ',user.name,vote)
                    votes_cnt+=1
                    this.userVotes[question_users[vote]] += 1
                    resolve()
                })
            })
        }
    }

    async questionPhase(){
        this.socket.emit("startCountdown", 1000000, 'questionID')

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
                        console.log("time ended before everyone answered <3")
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
        return this.questionsArr[questionNum]
    }

    initQuestions(){
        let lst = this.getQuestionsLstFromFile()
        var chooser = this.randomNoRepeats(lst);
        this.questionsArr = Array(this.questionUsers.length)
        for (let i = 0; i <this.questionsArr.length; i++){
            this.questionsArr[i] = chooser()
        }

    }

    getQuestionsLstFromFile(){
        return ['what?','who?','when?','why?','how?','where?','is?']
    }

    randomNoRepeats(array) {
        var copy = array.slice(0);
        return function() {
          if (copy.length < 1) { copy = array.slice(0); }
          var index = Math.floor(Math.random() * copy.length);
          var item = copy[index];
          copy.splice(index, 1);
          return item;
        };
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
            let validUsers = 0
            let maxIndices = [] // all indices of the users with highest amount of questions left
            let secondMaxIndices = [] // all indices of the users with second to highest amount of questions left
            let max = 100000
            let secondMax = 100001
            for (let i = 0; i < userCount; i++){
                if (userQuestions[i].length < numOfAnswers){
                    if(userQuestions[i].length < max){
                        secondMaxIndices = maxIndices
                        secondMax = max
                        maxIndices = [i]
                        max = userQuestions[i].length
                    }
                    else if(userQuestions[i].length == max){
                        maxIndices.push(i)
                    }
                    else if((userQuestions[i].length > max)&&(userQuestions[i].length < secondMax)){
                        secondMaxIndices = [i]
                        secondMax = userQuestions[i].length
                    }
                    else if((userQuestions[i].length == secondMax)){
                        secondMaxIndices.push(i)
                    }
                    validUsers+=1
                }
            }
            if (validUsers === 0){
                break
            }
            if (validUsers === 1){
                console.log('Error - odd number of questions or unfixed matchup bug')
                break
            }
            // find pair
            let firstMaxIndex = Math.floor(Math.random()*maxIndices.length)
            let first = maxIndices[firstMaxIndex]
            maxIndices.splice(firstMaxIndex,1)
            if (maxIndices.length==0){
                maxIndices = secondMaxIndices
            }

            let secondMaxIndex = Math.floor(Math.random()*maxIndices.length)
            let second = maxIndices[secondMaxIndex]

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