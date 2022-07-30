'use strict';

import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";

function Lobby(props) {
    var socket = props.socket,
        room_id = props.room_id,
        users = props.users,
        startGameCallback = props.startGameCallback;

    // React.useEffect(() => {

    var startGame = function startGame(event, game_num) {
        event.preventDefault();
        socket.emit("startingGame" + String(game_num));
        startGameCallback(game_num);
    };

    // }, [])

    return React.createElement(
        "div",
        null,
        React.createElement(Chat, { socket: socket }),
        React.createElement(RoomInfo, { roomId: room_id, users: users }),
        React.createElement(
            "form",
            null,
            React.createElement(
                "button",
                { onClick: function onClick(event) {
                        return startGame(event, 1);
                    } },
                " Start Game 1 "
            )
        ),
        React.createElement(
            "form",
            null,
            React.createElement(
                "button",
                { onClick: function onClick(event) {
                        return startGame(event, 2);
                    } },
                " Start Game 2 "
            )
        ),
        React.createElement(
            "form",
            null,
            React.createElement(
                "button",
                { onClick: function onClick(event) {
                        return startGame(event, 3);
                    } },
                " Start Game 3 "
            )
        )
    );
}

export default Lobby;