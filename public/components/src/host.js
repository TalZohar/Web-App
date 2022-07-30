import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";
import Lobby from "./lobby.js";
'use strict';

let socket = io();

function Host() {
    const [roomId, setRoomId] = React.useState(null);
    const [users, setUsers] =  React.useState(null);
    const [isConnected, setIsConnected] = React.useState(socket.connected);
    const [lastPong, setLastPong] = React.useState(null);
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
        
        
        socket.on('startCountdown', function (time, id=null) {
            setTimeout(()=>{
                socket.emit("endCountdown", id)
            }, time);
        })
        
        socket.on('answer', function(user, answer) {    
            console.log(user)
            console.log(answer)
            socket.emit('hostAnswer_'+String(user.id), user, answer)
        })

        socket.on('vote', function(user, vote) {    
            console.log(user.name, vote)
            socket.emit('hostVote_'+String(user.room_id), user, vote)
        })
        
        
        socket.on('updateUserAnswers', function (num_answered, user_list){
            console.log("urgent message")
            console.log("update:", num_answered, user_list)
        })

        // document.querySelector('#game1-btn').addEventListener('click', function(e) {
        //     e.preventDefault()
        //     socket.emit("startingGame1")
        //     startGameCallback(1)
        // })
        

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
          };
    }, []);
  
    const sendPing = () => {
      socket.emit('ping');
    }
  
    // return (
    //   <div>
    //     <Chat socket={socket}/>
    //     <RoomInfo roomId={roomId} users={users}/>
    //     <p>Connected: { '' + isConnected }</p>
    //     <p>Last pong: { lastPong || '-' }</p>
    //     <button onClick={ sendPing }>Send ping</button>
    //   </div>
    // );
    return (
        <div>
            {(isLobby) ? (
                <Lobby socket={socket} room_id={roomId} users={users} startGameCallback={(gameNum)=>{setisLobby(false)}}/>) 
            :(
                <p>game</p>
            )}
        </div>
      );

}



const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<Host />);