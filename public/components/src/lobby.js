'use strict';
import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";

function Lobby(props) {
    const {socket, room_id, users, startGameCallback } = props

    // React.useEffect(() => {
    const startGame=(event,game_num)=>{
        event.preventDefault()
        socket.emit("startingGame"+String(game_num))
        startGameCallback(game_num)
    }

    // }, [])

    return (      
    <div>
        <Chat socket={socket}/>
        <RoomInfo roomId={room_id} users={users}/>
        <form>
            <button onClick={event => startGame(event,1)}> Start Game 1 </button>
        </form>
        <form>
            <button onClick={event => startGame(event,2)}> Start Game 2 </button>
        </form>
        <form>
            <button onClick={event => startGame(event,3)}> Start Game 3 </button>
        </form>
    </div>);


    


}


export default Lobby