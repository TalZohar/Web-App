var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";
import Lobby from "./lobby.js";
import Game_Host from "./host_game.js";
'use strict';

var socket = io();

function Host() {
    var _React$useState = React.useState(null),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        roomId = _React$useState2[0],
        setRoomId = _React$useState2[1];

    var _React$useState3 = React.useState(null),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        users = _React$useState4[0],
        setUsers = _React$useState4[1];

    var _React$useState5 = React.useState(null),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        isLobby = _React$useState6[0],
        setisLobby = _React$useState6[1];

    React.useEffect(function () {

        socket.on('connect', function () {
            var searchQuery = window.location.search.substring(1);
            var params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
            socket.emit('createLobby', params, function (err) {
                if (err) {
                    console.log(params);
                    alert(err);
                    window.location.href = '/';
                } else {
                    console.log('No Error');
                }
            });
            setRoomId(params.room_id);
            setisLobby(true);
        });

        socket.on('updateUsersList', function (users) {
            setUsers(users);
        });

        return function () {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    var goToLobby = function goToLobby() {
        setisLobby(true);
        socket.emit('returnToLobby');
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "nav",
            { className: "navbar navbar-dark", style: { "backgroundColor": "black" } },
            React.createElement(
                "a",
                { className: "navbar-brand", href: "#" },
                "web-app"
            )
        ),
        isLobby ? React.createElement(Lobby, { socket: socket, room_id: roomId, users: users, startGameCallback: function startGameCallback(gameNum) {
                setisLobby(false);
            } }) : React.createElement(Game_Host, { socket: socket, goToLobby: goToLobby })
    );
}

var domContainer = document.querySelector('#root');
var root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(Host, null));