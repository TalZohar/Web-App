'use strict';

import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";

function Lobby(props) {
    var socket = props.socket,
        room_id = props.room_id,
        users = props.users,
        startGameCallback = props.startGameCallback;


    var startGame = function startGame(event, game_num) {
        event.preventDefault();
        socket.emit("startingGame", game_num);
        startGameCallback(game_num);
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { "class": "row" },
            React.createElement(
                "div",
                { "class": "col-md-6" },
                React.createElement(Chat, { socket: socket })
            ),
            React.createElement(
                "div",
                { "class": "col-md-6" },
                React.createElement(
                    "div",
                    { "class": "jumbotron",
                        style: { "opacity": 0.9, "justify-content": "space-around", "margin": "10px", "padding": "20px", "border-radius": "30px", "display": "flex", "flex-direction": "column" } },
                    React.createElement(RoomInfo, { roomId: room_id, users: users })
                ),
                React.createElement("hr", null),
                React.createElement(
                    "div",
                    { "class": "btn-group btn-group-justified" },
                    React.createElement(
                        "button",
                        { "class": "btn btn-dark", onClick: function onClick(event) {
                                return startGame(event, 1);
                            } },
                        " Start Game 1 "
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-dark", onClick: function onClick(event) {
                                return startGame(event, 2);
                            } },
                        " Start Game 2 "
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-dark", onClick: function onClick(event) {
                                return startGame(event, 3);
                            } },
                        " Start Game 3 "
                    )
                )
            )
        )
    );
}

export default Lobby;