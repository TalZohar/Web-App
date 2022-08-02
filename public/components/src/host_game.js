import Timer from "./timer.js";
'use strict';

function Player_Progress(props) {
    const {num_answered, user_list} = props

    if (!user_list){
        return
    }
    
    return (
    user_list.map(function(e, i) {
        return (<li key={i}> {e}: {num_answered[i]}</li>);
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
        <h3>Question: {question}</h3>
        <div>
            <h4>Answer 1: {answerLeft}</h4>
            <h4>Answer 2: {answerRight}</h4>
        </div>   
    </div>)

}

function Voting_Meme(props){
    let {question, answerLeft, answerRight} = props
    return (<div style={{'min-height': '100vh'}}>      
        <div><h3>Question: Who Captioned the Meme Better?</h3> </div>
        <div>
            <h4>Answer 1: Top: {answerLeft.upper}, Bottom: {answerLeft.lower}</h4>
            <h4>Answer 2:  Top: {answerRight.upper}, Bottom: {answerRight.lower}</h4>
        </div> 
        <div><img src = {'data:image/jpeg;base64,' + question} class="mx-auto d-block img-fluid unlock-icon"></img></div>
        
  
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
            socket.emit(('hostVote_'+String(user.room_id)), user, vote)
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
        socket.on('playerDisconnected', function (user){
            console.log('user disconnected')
            socket.emit('playerDisconnected_voting')
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
    

    return (<div class="text-center vsc-initialized container-fluid">
            {(votingAnswers) ? (
                <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
                <div class="jumbotron"> 
                    <h2>Scorings</h2>
                    <hr></hr>
                    <Display_Winners userVotes={votingAnswers} user_list={user_list}/>
                    <button className={"center_button"} style={{"backgroundColor":"white"}} onClick={goToLobby}> Return to lobby </button>
                </ div>
                </ div>
            ):(
            <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
                <div class="jumbotron"> 
                <h2>Vote: who answered better?</h2>
                <hr></hr>
                {getVoteHTML()}
                </div>
            </div>
            )}
        </div>)
}


function Game_Host(props) {
    const {socket, goToLobby} = props
    const [isQuestionPhase, setIsQuestionPhase] = React.useState("loading")
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

        socket.on('playerDisconnected', function (user){
            socket.emit('playerDisconnected_'+String(user.id))

        })

        return () => {
            socket.off('startCountdown');
            socket.off('answer');
            socket.off('vote');
            socket.off('updateUserAnswers');
          };
        
    }, []);

    return (
        <div class="text-center vsc-initialized container-fluid">
            {(isQuestionPhase=="loading") ? (
                <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
                <div class="jumbotron"> 
                    <h2>Loading Questions </h2> 
                </div>
                </div>
            ):(
            (isQuestionPhase) ? (
                <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
                    <div class="jumbotron"> 
                    <h3>Answer Your Questions</h3>
                     <hr></hr>
                    <p>Time Left:</p>
                    <Timer initialMinute = {timeState.time_minutes} initialSeconds= {timeState.time_seconds} endCallback={()=>{socket.emit("endCountdown", timeState.id)}}/>
                    </div>

                    <div class="text-left jumbotron" style={{opacity: 0.9, padding: "0.1%"}}>

                    <Player_Progress num_answered={num_answered} user_list={user_list} />
                    </div>

                </div>
            ):(
                <Voting_Host socket={socket} user_list={user_list} goToLobby={goToLobby}/>
            ))}
        </div>
      );

}

export default Game_Host
