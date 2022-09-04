'use strict';
import Drawing_Board from "./drawing.js";
//yser in game logic
function Answers_Text(props){ //answer textbox for user.
    const {text, answerCallback} = props
    const [answer, setAnswer] = React.useState('')
    
    const handleChange = event => {
        setAnswer(event.target.value)
    }
    const onAnswer = (e) => {
        e.preventDefault()
        answerCallback(answer)
        setAnswer((prev)=>{return ''})
    }
    return (
        <div style={{'min-height': '100vh' ,'display': 'flex' ,'align-items': 'center' }}>    
        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
        <div class="jumbotron">
            <h3>Answer the following question:</h3>
            <p>{text}</p> 
            <input 
            type="text"
            id="inputAnswer"
            onChange={handleChange}
            value = {answer}
            />
            <button onClick={(e)=>onAnswer(e)}> Submit </button>
        </div>
        </div>
        </div>
    )
    
}

function Answers_Meme(props){ //display meme, upper and lower caption textboxes
    const {image, answerCallback} = props
    const [answerUpper, setAnswerUpper] = React.useState('')
    const [answerLower, setAnswerLower] = React.useState('')

    const handleChangeLower = event => {
        setAnswerLower(event.target.value)
    }
    const handleChangeUpper = event => {
        setAnswerUpper(event.target.value)
    }
    const onAnswer = (e) => {
        console.log('fmdjdj')
        console.log(image)
        e.preventDefault()
        answerCallback({upper: answerUpper, lower: answerLower})
        setAnswerUpper((prev)=>{return ''})
        setAnswerLower((prev)=>{return ''})
    }
    console.log(image)
    return (
        <div style={{'min-height': '100vh' ,'display': 'flex' ,'align-items': 'center' }}>    
        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
            <div class="jumbotron">

            <h3>Caption the meme:</h3>
            <input 
            class='input_bar'
            type="text"
            id="upperAnswer"
            onChange={handleChangeUpper}
            value = {answerUpper}
            placeholder={'Enter upper caption'}
            
            />
            <input 
            class='input_bar'
            type="text"
            id="lowerAnswer"
            onChange={handleChangeLower}
            value = {answerLower}
            placeholder={'Enter lower caption'}
            />
            <button onClick={(e)=>onAnswer(e)}> Submit </button>
            <div class="col align-self-center">
            {/* <div class="col-md-4 px-0"> */}
                <img src = {'data:image/jpeg;base64,'+image} class="mx-auto d-block img-fluid unlock-icon" ></img>
            </div>
            

            </div> 
        </div>
        </div>
    )
}

function Answers_Drawing(props){ //display question. user drawing logic
    const {text, answerCallback} = props
    

    const submitCallback = (canvas) =>{
        answerCallback(canvas)
    }
    return (       <div style={{'display': 'flex' ,'align-items': 'center' }}>    
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ">
        <div class="jumbotron">
        <h3> Draw the Following :{text}</h3>
        </div>
        </div>
        
        <Drawing_Board submitCallback={submitCallback} />

        </div>)

    
}

function Answers_Player(props){ //player answer display logic
    const {socket} = props
    const [recievedAllAnswers, setRecievedAllAnswers] = React.useState(false);
    const [activeQuestion, setActiveQuestion] = React.useState(null);
    const [waiting, setWaiting] = React.useState(true)


    React.useEffect(() => {
        socket.on('question', function(data){
            setActiveQuestion(data)
            console.log(data)
            setWaiting(false)
        })
        
        socket.on('timeEnd', function(){
            console.log("recieve time End")
            socket.off('question')
            socket.on('question', function(data){
                console.log("emitting null")
                socket.emit('answer', {'data':null})
            })
        })

        socket.on('userFinished', function(){
            console.log('userFinished')
            setRecievedAllAnswers(true)
        })

    }, [])

    const onAnswer = (data) => {
        socket.emit('answer', {'data': data})
        setWaiting(true)

    }

    const getQuestionHTML = () =>{
        if (activeQuestion){
            if (activeQuestion.type === "text"){
                return <Answers_Text text = {activeQuestion.data} answerCallback={onAnswer}></Answers_Text>
            }
            else if (activeQuestion.type === "meme"){
                return <Answers_Meme image = {activeQuestion.data} answerCallback={onAnswer}></Answers_Meme>
            }
            else if (activeQuestion.type === "drawing"){
                return <Answers_Drawing text = {activeQuestion.data} answerCallback={onAnswer}></Answers_Drawing>
            }
            else{
                console.log ("basa")
            }
        }
        else{
            return <p>Loading Questions...</p>
        }
    }

    return (      
        <div class="text-center vsc-initialized container-fluid">
            {(recievedAllAnswers) ? (
                 <div class="alert alert-info">
                  <h2>Waiting for other players to answer</h2> </div>)
            :(                        
              <div>{(waiting) ? (
                <div class="alert alert-info">
                 <h2>Waiting For the Next Question...</h2> </div>)
           :(        
            getQuestionHTML())}
            </div>        
                
            )}

        </div>);

}


function Game_Player(props) { //full game (quesion+voting) logic
    const {socket, retToLobby} = props
    const [isQuestionPhase, setIsQuestionPhase] = React.useState(true);
    const [recievedVote, setRecievedVote] = React.useState(false);
    const [gameEnded, setGameEnded] = React.useState(false);

    React.useEffect(() => {
        socket.on('endGame', function(){
            console.log('ending game')
            setGameEnded(true)
        })
        socket.on('returnToLobby', function(){
            console.log('return to lobby')
            retToLobby()
        })

        
        socket.on('voting', function(){
            console.log('get vote')
            setIsQuestionPhase(false)
            setRecievedVote(false)
        })
        
    }, [])

    const onVote=(e, vote)=>{
        e.preventDefault(); 
        socket.emit('vote', vote);
        setRecievedVote(true);
    }


    return (      
    <div class="text-center vsc-initialized container-fluid">
        {(gameEnded) ? (
            <div class="alert alert-info">
                <h2>Game Has Ended</h2> 
            </div>
            
        ):(
            (isQuestionPhase) ? (<Answers_Player socket={socket}/>) 
            :(
                (recievedVote) ? 
                (<div class="alert alert-info">
                    <h2>Every vote counts! </h2> 
                </div>
                ):
                (  
                <div style={{'min-height': '100vh' ,'display': 'flex' ,'align-items': 'center' }}>            
                <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column " >
                    <div class="jumbotron"> 
                        <h2>Which Answer is better?</h2>
                        <button className={"center_button"} style={{"backgroundColor":"white"}} onClick={(e)=>onVote(e,0)}> Answer 1 </button>
                        <button className={"center_button"} style={{"backgroundColor":"white"}} onClick={(e)=>onVote(e,1)}> Answer 2 </button>
                    </div>
                </div>
                </div>
                )
            )
        )}
       
    </div>);
}

export default Game_Player