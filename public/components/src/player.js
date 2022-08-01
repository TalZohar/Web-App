'use strict';
import Game_Player from "./player_game.js";

let socket = io();

function Player() {
    const [roomId, setRoomId] = React.useState(null);
    const [isLobby, setisLobby] = React.useState(true);
  
    React.useEffect(() => {
        socket.on('connect', function (){
            let searchQuery = window.location.search.substring(1)
            let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}')
            socket.emit('join', params, function(err){
                if (err){
                    console.log(params)
                    alert(err)
                    window.location.href = '/'
                }else{
                    console.log('No Error')
                }
            })
            setRoomId(params.room_id)
            setisLobby(true)
        })

        socket.on('disconnect', function (){
            console.log('disconnected from server')
        })
        socket.on('abrupt-disconnect', function (){
            alert("host disconnected")
            window.location.href = '/'
        })

        socket.on('startGame', function(){
            console.log("starting game")
            setisLobby(false)
        })
        socket.on('notEnoughPlayers', function (){
            setisLobby(true)
            alert("Not enough players")
        })


        return () => {
            socket.off('connect');
            socket.off('disconnect');
          };
    }, []);

    const msgSubmit = (e) => {
        e.preventDefault()
        socket.emit("createMessage", {
            text: document.querySelector('input[name="message"]').value
        }, function() {
    
        })
        document.querySelector('input[name="message"]').value = ''
    }

    
    return (
        <div class='root' >

            {(isLobby) ? (
                <div class="cover-container d-flex w-100 h-100 p-3 mx-auto" style={{'display': 'flex' ,'align-items': 'center','align-self':'center'}}>
                    <div class="jumbotron col-lg-6 col-md-6 col-sm-6 col-xs-6 offset-3 float-md-center" style={{"backgroundColor":"#FFFFFF","width":"70%"}}> 
                    {/* <div className="grid"> */}
                        <div className="d-flex align-items-center justify-content-center text-center">
                            <h2>Welcome to the room lobby</h2>
                        </div>
                        <div className="d-flex row align-items-center  justify-content-center">
                            <input  type = "text" name="message" placeholder="message" class='input_bar'/>
                            <button onClick={event => msgSubmit(event)}> Submit </button>
                        </div>
                    </div>

                </div>
                ) 
            :(
                <Game_Player socket={socket} retToLobby={()=>{setisLobby(true)}} />
            )}

        </div>
      );

}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<Player />);
