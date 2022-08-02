import Timer from "./timer.js";
import Meme_Generator from "./meme_generator.js";
// import generateMemeCanvas from "./meme_generator.js";
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
    const memeMaker=(img,upper,lower)=>{
        let url = 'data:image/jpeg;base64,' + img
        return <Meme_Generator img_url={url} topText = {upper} bottomText = {lower} />
    }

    let {question, answerLeft, answerRight} = props
    return (<div>      
        <div class = "row">
            <div class="col-md-6" style={{"padding-right":"20px","border-right": "1px solid #ccc"}}>
            {memeMaker(question, answerLeft.upper, answerLeft.lower)}
            </div>
            <div class="col-md-6">
            {memeMaker(question, answerRight.upper, answerRight.lower)}
            </div>
        </div> 
        
        {/* <div><img src = {'data:image/jpeg;base64,' + question} class="mx-auto d-block img-fluid unlock-icon"></img></div> */}
        
  
    </div>)
}

function Voting_Drawing(props){
    let {question, answerLeft, answerRight} = props
    console.log(answerLeft)
        
    React.useEffect(()=>{
        // const canvasLeft = canvasLeftRef.current
        // const canvasRight = canvasRightRef.current

        // const contextLeft = canvasLeft.getContext("2d")
        // const contextRight = canvasRight.getContext("2d")

        //contextLeft.drawImage(answerLeft, 0, 0)
       // contextRight.drawImage(answerRight, 0, 0)
    }, [])

    return (<div>      
        <h3>{question}</h3>
        <div class = "row">
        <div class="col-md-6" style={{"padding-right":"20px","border-right": "1px solid #ccc"}}>
        <div><img src = {answerLeft} class="mx-auto d-block img-fluid unlock-icon" ></img></div>
        </div>
        <div class="col-md-6">
        <div><img src = {answerRight} class="mx-auto d-block img-fluid unlock-icon"></img></div>
        </div>
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
                <h2>Pick your favorite</h2>
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