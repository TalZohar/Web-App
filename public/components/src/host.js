import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";
import Lobby from "./lobby.js";
import Game_Host from "./host_game.js"
'use strict';

let socket = io();


function Host() {
    const [roomId, setRoomId] = React.useState(null);
    const [users, setUsers] =  React.useState(null);
    const [isLobby, setisLobby] = React.useState(null);
  
    React.useEffect(() => {

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
        

        return () => {
            socket.off('connect');
            socket.off('disconnect');
          };
    }, []);
  
    const goToLobby =()=>{
        setisLobby(true)
        socket.emit('returnToLobby')
    }

    return (
        <div>
            <nav className="navbar navbar-dark" style={{"backgroundColor": "black"}}>
            <a className="navbar-brand" href="#">web-app</a>
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