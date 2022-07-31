'use strict';

function Answers_Text(props){
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
        <div>
            <p>{text}</p>
            <input 
            type="text"
            id="inputAnswer"
            onChange={handleChange}
            value = {answer}
            />
            <button onClick={(e)=>onAnswer(e)}> Submit </button>
        </div>
    )
    
}

function Answers_Meme(props){
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
        console.log(image)
        e.preventDefault()
        answerCallback({upper: answerUpper, lower: answerLower})
        setAnswerUpper((prev)=>{return ''})
        setAnswerLower((prev)=>{return ''})
    }
    console.log(image)
    return (
        <div>
            <input 
            type="text"
            id="upperAnswer"
            onChange={handleChangeUpper}
            value = {answerUpper}
            />
            
            <img src = {'data:image/jpeg;base64,'+image}></img>

            <input 
            type="text"
            id="lowerAnswer"
            onChange={handleChangeLower}
            value = {answerLower}
            />
            <button onClick={(e)=>onAnswer(e)}> Submit </button>
        </div>
    )
}

function Answers_Drawing(props){
    const {text, answerCallback} = props
    
}

function Answers_Player(props){
    const {socket} = props
    const [recievedAllAnswers, setRecievedAllAnswers] = React.useState(false);
    const [activeQuestion, setActiveQuestion] = React.useState(null);

    React.useEffect(() => {
        socket.on('question', function(data){
            setActiveQuestion(data)
            console.log(data)
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
        return socket.emit('answer', {'data': data})
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
            return <p>No Questions received</p>
        }
    }

    return (      
        <div>
            {(recievedAllAnswers) ? (
                 <p> Waiting for other players to answer </p>)
            :(
                <div>
                    <p>Answer the following question:</p>
                    {getQuestionHTML()}
                </div>
            )}

        </div>);

}


function Game_Player(props) {
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
    <div>
        <p>Game</p>
        {(gameEnded) ? (
            <p>Game Has Ended</p>
        ):(
            (isQuestionPhase) ? (<Answers_Player socket={socket}/>) 
            :(
                (recievedVote) ? 
                (<p> Every vote counts! </p>):
                (              
                <div>
                    <p>Which Answer is better?</p>
                    <button onClick={(e)=>onVote(e,0)}> Left </button>
                    <button onClick={(e)=>onVote(e,1)}> Right </button>
                </div>
                )
            )
        )}
       
    </div>);
}

export default Game_Player