'use strict';
import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";

function Lobby(props) {
    const {socket, room_id, users, startGameCallback } = props

    const startGame=(event,game_num)=>{
        event.preventDefault()
        socket.emit("startingGame",(game_num))
        startGameCallback(game_num)
    }


    return (      
    <div>
        <div class="row">
        <div class="col-md-6">
        <Chat socket={socket}/>
        </div>
        <div class="col-md-6">
        <div class="jumbotron" 
        style={{"opacity": 0.9, "justify-content": "space-around","margin":"10px","padding":"20px","border-radius":"30px","display":"flex","flex-direction": "column"}}>
        <RoomInfo roomId={room_id} users={users}/>
        </div>
        <hr></hr>
        <div class="btn-group btn-group-justified">
        <button class="btn btn-dark" onClick={event => startGame(event,1)}> Start Game 1 </button>
        <button class="btn btn-dark" onClick={event => startGame(event,2)}> Start Game 2 </button>
        <button  class="btn btn-dark" onClick={event => startGame(event,3)}> Start Game 3 </button>        
        </div>
        </div>
        </div>

    </div>);


    


}


export default Lobby