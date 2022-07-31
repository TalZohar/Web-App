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
        <div >
              <nav className="navbar navbar-dark" style={{"backgroundColor": "#C95B0C"}}>
            <a className="navbar-brand" href="#">Navbar</a>
            </nav>
            {(isLobby) ? (
                <div className="h-100 d-flex align-items-center justify-content-center" >
                    <div className="grid">

                    <div className="row align-items-center  justify-content-center">
                        <p>Welcome to the room lobby</p>
                    </div>
                        <div className="row align-items-center  justify-content-center">
                        <input type = "text" name="message" placeholder="message" />
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
