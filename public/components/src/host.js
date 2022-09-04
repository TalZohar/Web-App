import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";
import Lobby from "./lobby.js";
import Game_Host from "./host_game.js"
'use strict';

let socket = io();

// host component is responsible for all player host. 

function Host() {
    const [roomId, setRoomId] = React.useState(null);
    const [users, setUsers] =  React.useState(null);
    const [isLobby, setisLobby] = React.useState(null);
  
    React.useEffect(() => {
        // when connecting, get room info from url request
        socket.on('connect', function (){
            let searchQuery = window.location.search.substring(1)
            let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}')
            socket.emit('createLobby', params, function(err){
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
        
        socket.on('updateUsersList', function (users){
            setUsers(users)
        })
        // game doesn't start if server dedcided not enouph player

        socket.on('notEnoughPlayers', function (){
            setisLobby(true)
            alert("Not enough players")
        })
        
        // to avoid dup

        return () => {
            socket.off('connect');
            socket.off('disconnect');
          };
    }, []);
  
    const goToLobby =()=>{
        setisLobby(true)
        socket.emit('returnToLobby')
    }

    // call fro lobby or game_host component respective to inner state
    return (
        <div>
            <nav className="navbar navbar-dark" style={{"backgroundColor": "black"}}>
            <a className="navbar-brand" href="#">Quizapp</a>
            </nav>
            {(isLobby) ? (
                <Lobby socket={socket} room_id={roomId} users={users} startGameCallback={(gameNum)=>{setisLobby(false)}}/>) 
            :(
                <Game_Host socket={socket} goToLobby={goToLobby}/>
            )}
        </div>
      );

}



const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<Host />);