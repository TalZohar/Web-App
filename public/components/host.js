var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import RoomInfo from "./roomInfo.js";
import Chat from "./chat.js";
import Lobby from "./lobby.js";
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

    var _React$useState5 = React.useState(socket.connected),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        isConnected = _React$useState6[0],
        setIsConnected = _React$useState6[1];

    var _React$useState7 = React.useState(null),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        lastPong = _React$useState8[0],
        setLastPong = _React$useState8[1];

    var _React$useState9 = React.useState(null),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        isLobby = _React$useState10[0],
        setisLobby = _React$useState10[1];

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

        socket.on('startCountdown', function (time) {
            var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            setTimeout(function () {
                socket.emit("endCountdown", id);
            }, time);
        });

        socket.on('answer', function (user, answer) {
            console.log(user);
            console.log(answer);
            socket.emit('hostAnswer_' + String(user.id), user, answer);
        });

        socket.on('vote', function (user, vote) {
            console.log(user.name, vote);
            socket.emit('hostVote_' + String(user.room_id), user, vote);
        });

        socket.on('updateUserAnswers', function (num_answered, user_list) {
            console.log("urgent message");
            console.log("update:", num_answered, user_list);
        });

        // document.querySelector('#game1-btn').addEventListener('click', function(e) {
        //     e.preventDefault()
        //     socket.emit("startingGame1")
        //     startGameCallback(1)
        // })


        return function () {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, []);

    var sendPing = function sendPing() {
        socket.emit('ping');
    };

    // return (
    //   <div>
    //     <Chat socket={socket}/>
    //     <RoomInfo roomId={roomId} users={users}/>
    //     <p>Connected: { '' + isConnected }</p>
    //     <p>Last pong: { lastPong || '-' }</p>
    //     <button onClick={ sendPing }>Send ping</button>
    //   </div>
    // );
    return React.createElement(
        "div",
        null,
        isLobby ? React.createElement(Lobby, { socket: socket, room_id: roomId, users: users, startGameCallback: function startGameCallback(gameNum) {
                setisLobby(false);
            } }) : React.createElement(
            "p",
            null,
            "game"
        )
    );
}

var domContainer = document.querySelector('#root');
var root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(Host, null));