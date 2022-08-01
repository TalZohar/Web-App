const EventEmitter = require('events')
const { query } = require('express')
class GameBase {
    constructor (io, socket, room, numOfAnswers) {
        this.io = io
        this.socket = socket
        this.room = room
        this.eventEm = new EventEmitter()
        this.gameType = 'text'
        this.numOfAnswers = numOfAnswers
        this.num_disconnected=0
        this.disconnected=new Array(this.room.getNumOfUsers())
        this.userAnswers = new Array(this.room.getNumOfUsers())
        this.userVotes = new Array(this.room.getNumOfUsers())
        for (let i = 0; i <this.room.getNumOfUsers(); i++){
            this.userVotes[i]=0
            this.disconnected[i]=false
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
        this.answerUsers = new Array(this.questionUsers.length)
        for (let i = 0; i <this.answerUsers.length; i++){ 
            this.answerUsers[i] = [null,null]
        } 

        await this.initQuestions()
        await this.questionPhase()  
        this.io.to(this.room.room_id).emit('questionPhaseEnd')
        this.socket.emit('questionPhaseEnd')
        await new Promise((resolve,reject)=>{
            setTimeout(function(){
                console.log("question phase end")
                resolve()
        }, 500);
        })
        await this.votingPhase()
        this.socket.emit('endGame', this.userVotes)
        this.io.to(this.room.room_id).emit('endGame')
    }

    async votingPhase(){
        for (let i = 0; i <this.questionUsers.length; i++){
            this.socket.emit('voteOnAnswers', this.getQuestion(i), this.answerUsers[i][0], this.answerUsers[i][1], this.gameType)
            console.log('waiting for vote')
            await this.getVote(this.questionUsers[i])
        }
        console.log(this.userVotes)
    }

    async getVote(question_users){
        this.io.to(this.room.room_id).emit('voting')
        let votes_cnt=this.num_disconnected
        while(votes_cnt<=this.room.getNumOfUsers()){
            console.log('awaiting',votes_cnt,this.room.getNumOfUsers())
            await new Promise((resolve, reject) => {
                this.socket.once("hostVote_"+String(this.room.room_id), (user,vote)=>{
                    console.log('recieved vote ',user.name,vote)
                    votes_cnt+=1
                    this.userVotes[question_users[vote]] += 1
                    resolve()
                })
                this.socket.on('playerDisconnected_voting',()=>{
                    console.log( "disconnected...")
                    votes_cnt+=1
                    resolve()
                })
            })
        }
    }

    async questionPhase(){
        this.socket.emit("startCountdown", {minutes:2, seconds:30}, 'questionID')
        this.socket.emit("updateUserAnswers", this.num_answered, this.room.getUserList())
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
                this.io.to(user.id).emit("question", {data: this.getQuestion(questionNum), type: this.gameType})
                resolve()
            })
            if (this.disconnected[user_num]){
                this.eventEm.emit("userFinished", user)
                return
            }

            let recievedAnswer = false
            while(!recievedAnswer){
                await new Promise((resolve, reject) => {
                    this.socket.once("hostAnswer_"+String(user.id), (user_recieved, answer)=>{
                        if (user_recieved.id == user.id){
                            console.log(answer.data + ' answer ' + i + " of user " + user.name)
                            recievedAnswer = true
                            this.userAnswers[user_num][i] = answer.data
                            this.answerUsers[questionNum][user_num==this.questionUsers[questionNum][0] ? 0 : 1] = answer.data
                            resolve()
                        }
                        else{
                            console.log("you shouldn't be here")
                        }
                    })
                    this.socket.on('playerDisconnected_'+String(user.id),()=>{
                        console.log(user.id, "disconnected...")
                        recievedAnswer = true
                        this.num_answered[user_num]=-2
                        resolve()
                    })
                })

            }
            this.num_answered[user_num]++
            this.socket.emit("updateUserAnswers", this.num_answered, this.room.getUserList())
        }
        this.io.to(user.id).emit("userFinished")
        this.eventEm.emit("userFinished", user)

    }

    getQuestion(questionNum) {
        return this.questionsArr[questionNum]
    }

    async initQuestions(){
        let lst = await this.getQuestionsLstFromFile()
        var chooser = this.randomNoRepeats(lst);
        this.questionsArr = Array(this.questionUsers.length)
        for (let i = 0; i <this.questionsArr.length; i++){
            this.questionsArr[i] = chooser()
        }

    }

    async getQuestionsLstFromFile(){
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
            if ((this.num_answered[i] != this.numOfAnswers)&&(!this.disconnected[i])){
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
        if ((userCount === 0) ||(userCount === 1)){
            console.log('Error - not enough players')
            this.socket.emit('notEnoughPlayers')
            this.io.to(this.room.room_id).emit('notEnoughPlayers')
        }
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
            if ((validUsers === 0) ||(validUsers === 1)){
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