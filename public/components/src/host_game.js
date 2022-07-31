import Timer from "./timer.js";
'use strict';

function Player_Progress(props) {
    const {num_answered, user_list} = props

    if (!user_list){
        return
    }
    
    return (
    user_list.map(function(e, i) {
        return <li key={i}> {e}: {num_answered[i]}</li>;
      })
    )
}

function Display_Winners(props){
    const {userVotes, user_list} = props

    if (!user_list){
        return
    }
    
    var c = user_list.map(function(e, i) {
        return [e, userVotes[i]];
    });    

    c.sort(function(a,b){
        return b[1]-a[1]
    })

    return (
        c.map(function(e, i) {
            return <li key={i}> {e[0]} : {e[1]}</li>;
          })
        )
}

function Voting_Text(props){
    let {question, answerLeft, answerRight} = props
    return (<div>      
        <p>Question: {question}</p>
        <div>
            <p>Answer 1: {answerLeft}</p>
            <p>Answer 2: {answerRight}</p>
        </div>   
    </div>)

}

function Voting_Meme(props){
    let {question, answerLeft, answerRight} = props
    return (<div>      
        <p>Question:</p> <img src = {'data:image/jpeg;base64,' + question}></img>
        <div>
            <p>Answer 1: Top: {answerLeft.upper}, Bottom: {answerLeft.lower}</p>
            <p>Answer 2:  Top: {answerRight.upper}, Bottom: {answerRight.lower}</p>
        </div>   
    </div>)
}


function Voting_Host(props) {
    const {socket, user_list, goToLobby} = props
    const [currentQuestion, setCurrentQuestion] = React.useState(null)
    const [answerLeft, setAnswerLeft] = React.useState(null)
    const [answerRight, setAnswerRight] = React.useState(null)
    const [gameType, setGameType] = React.useState(null)
    const [votingAnswers, setVotingAnswers] = React.useState(null)


    React.useEffect(() => {
        socket.on('vote', function(user, vote) {    
            console.log(user.name, vote)
            socket.emit('hostVote_'+String(user.room_id), user, vote)
        })

        socket.on('endGame', function(userVotes) {    
            console.log(userVotes)
            setVotingAnswers((prev)=>{return [...userVotes]})
        })
        
        socket.on('voteOnAnswers',function(question,answer1,answer2,type) {
            console.log(question,answer1,answer2,type)
            setCurrentQuestion(question)
            setAnswerLeft(answer1)
            setAnswerRight(answer2)
            setGameType((prev)=>{return type})
        })
        return () => {
            socket.off('vote');
            socket.off('voteOnAnswers');
          };
    
    }, []);
    
    const getVoteHTML=()=>{
        if (gameType){
            if (gameType === "text"){
                return <Voting_Text question = {currentQuestion} answerLeft={answerLeft} answerRight={answerRight}></Voting_Text>
            }
            else if (gameType === "meme"){
                return <Voting_Meme question = {currentQuestion} answerLeft={answerLeft} answerRight={answerRight}></Voting_Meme>
            }
            else if (gameType === "drawing"){
                return <Voting_Drawing question = {currentQuestion} answerLeft={answerLeft} answerRight={answerRight}></Voting_Drawing>
            }
            else{
                
            }
        }
        else{
            console.log(gameType)
            return <p>No answers to vote on received</p>
        }
    }
    

    return (<div>
            {(votingAnswers) ? (
                <div>
                <Display_Winners userVotes={votingAnswers} user_list={user_list}/>
                <button onClick={goToLobby}> Return to lobby </button>
                </ div>
            ):(
            <div>
                <p>Vote:</p>
                {getVoteHTML()}
            </div>
            )}
        </div>)
}


function Game_Host(props) {
    const {socket, goToLobby} = props
    const [isQuestionPhase, setIsQuestionPhase] = React.useState(null)
    const [timeState, setTimeState] = React.useState({time_minutes:null, time_seconds:null, id:null})
    const [num_answered, setNum_answered] = React.useState(null)
    const [user_list, setUser_list] = React.useState(null)
    
    React.useEffect(() => {
        
        socket.on('questionPhaseEnd', function () {
            console.log('listening now')
            setIsQuestionPhase(false)
        })
        
        socket.on('startCountdown', function (time, id=null) {
            console.log(time)
            setIsQuestionPhase(true)
            setTimeState({time_minutes: time.minutes, time_seconds: time.seconds, id:id})
        })
        
        socket.on('answer', function(user, answer) {    
            socket.emit('hostAnswer_'+String(user.id), user, answer)
        })

        socket.on('updateUserAnswers', function (num_answered, user_list){
            console.log("update:", num_answered, user_list)
            setNum_answered((prev)=>{return [...num_answered]})
            setUser_list((prev)=>{return [...user_list]})
        })

        return () => {
            socket.off('startCountdown');
            socket.off('answer');
            socket.off('vote');
            socket.off('updateUserAnswers');
          };
        
    }, []);

    return (
        <div>
            <p>Game</p>
            {(isQuestionPhase) ? (
                <div>
                    <p>Answer your Questions</p>
                    <p>Time Left:</p>
                    <Timer initialMinute = {timeState.time_minutes} initialSeconds= {timeState.time_seconds} endCallback={()=>{socket.emit("endCountdown", timeState.id)}}/>
                    <Player_Progress num_answered={num_answered} user_list={user_list} />
                </div>
            ):(
                <Voting_Host socket={socket} user_list={user_list} goToLobby={goToLobby}/>
            )}
        </div>
      );

}

export default Game_Host
