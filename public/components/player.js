'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Game_Player from "./player_game.js";

var socket = io();

function Player() {
    var _React$useState = React.useState(null),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        roomId = _React$useState2[0],
        setRoomId = _React$useState2[1];

    var _React$useState3 = React.useState(true),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        isLobby = _React$useState4[0],
        setisLobby = _React$useState4[1];

    React.useEffect(function () {
        socket.on('connect', function () {
            var searchQuery = window.location.search.substring(1);
            var params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
            socket.emit('join', params, function (err) {
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

        socket.on('disconnect', function () {
            console.log('disconnected from server');
        });
        socket.on('abrupt-disconnect', function () {
            alert("host disconnected");
            window.location.href = '/';
        });

        socket.on('startGame', function () {
            console.log("starting game");
            setisLobby(false);
        });
        socket.on('notEnoughPlayers', function () {
            setisLobby(true);
            alert("Not enough players");
        });

        return function () {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    var msgSubmit = function msgSubmit(e) {
        e.preventDefault();
        socket.emit("createMessage", {
            text: document.querySelector('input[name="message"]').value
        }, function () {});
        document.querySelector('input[name="message"]').value = '';
    };

    return React.createElement(
        'div',
        { 'class': 'root' },
        isLobby ? React.createElement(
            'div',
            { 'class': 'cover-container d-flex w-100 h-100 p-3 mx-auto', style: { 'display': 'flex', 'align-items': 'center', 'align-self': 'center' } },
            React.createElement(
                'div',
                { 'class': 'jumbotron col-lg-6 col-md-6 col-sm-6 col-xs-6 offset-3 float-md-center', style: { "backgroundColor": "#FFFFFF", "width": "70%" } },
                React.createElement(
                    'div',
                    { className: 'd-flex align-items-center justify-content-center text-center' },
                    React.createElement(
                        'h2',
                        null,
                        'Welcome to the room lobby'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'd-flex row align-items-center  justify-content-center' },
                    React.createElement('input', { type: 'text', name: 'message', placeholder: 'message', 'class': 'input_bar' }),
                    React.createElement(
                        'button',
                        { onClick: function onClick(event) {
                                return msgSubmit(event);
                            } },
                        ' Submit '
                    )
                )
            )
        ) : React.createElement(Game_Player, { socket: socket, retToLobby: function retToLobby() {
                setisLobby(true);
            } })
    );
}

var domContainer = document.querySelector('#root');
var root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(Player, null));