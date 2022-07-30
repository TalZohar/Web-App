'use strict';

function Game_Player(props) {
    const {socket, endGameCallback} = props
    const [isQuestionPhase, setIsQuestionPhase] = React.useState(true);

    React.useEffect(() => {
        socket.on('endGame', function(){
            console.log('ending game')
            endGameCallback()
        })

        socket.on('question', function(data){
            console.log(data)
            setTimeout(function(){socket.emit('answer', data)}, 500);
        })
        
        socket.on('timeEnd', function(){
            console.log("recieve time End")
            socket.off('question')
            socket.on('question', function(data){
                console.log("emitting null")
                socket.emit('answer', {'data':null})
            })
        })
        socket.on('voting', function(){
            console.log('get vote')
            setIsQuestionPhase(false)
        })
        
    }, [])


    return (      
    <div>
        <p>Game</p>
        {(isQuestionPhase) ? (
                <p>Answer the following question: </p>) 
            :(
                <div>
                    <p>Which Answer is better?</p>
                    <form>
                        <button onClick={socket.emit('vote', 0)}> Left </button>
                    </form>
                    <form>
                        <button onClick={socket.emit('vote', 1)}> Right </button>
                    </form>
                </div>
            )}
    </div>);
}

export default Game_Player