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

        socket.on('startGame1', function(){
            console.log("starting game 1")
            setisLobby(false)
        })
        
        
        document.querySelector('#submit-btn').addEventListener('click', function(e) {
            e.preventDefault()
            socket.emit("createMessage", {
                text: document.querySelector('input[name="message"]').value
            }, function() {
        
            })
            document.querySelector('input[name="message"]').value = ''
        })


        return () => {
            socket.off('connect');
            socket.off('disconnect');
          };
    }, []);


    
    return (
        <div>
            {(isLobby) ? (
                <div>
                    <p>Welcome to the room lobby</p>
                    <form id="message-form">
                        <input type = "text" name="message" placeholder="message" />
                        <button type="submit" id="submit-btn"> Submit</button>
                    </form>
                </div>
                ) 
            :(
                <Game_Player  socket={socket} endGameCallback={()=>{setisLobby(true)}} />
            )}

        </div>
      );

}



const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<Player />);
