// import uuidv4 from 'uuid/v4'
// import { v4 as uuidv4 } from 'uuid';
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Chat(props) {
    var socket = props.socket;

    var _React$useState = React.useState([]),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        messages = _React$useState2[0],
        setMessages = _React$useState2[1];

    React.useEffect(function () {
        socket.on('newMessage', function (message) {
            message["key"] = Math.floor(Math.random() * 10000);
            setMessages(function (prev) {
                // prev.push(message)
                return [].concat(_toConsumableArray(prev), [message]);
            });
        });
    }, []);

    return React.createElement(
        'div',
        { 'class': 'chat' },
        React.createElement(
            'h2',
            null,
            'Chat: '
        ),
        messages.length > 0 ? messages.map(function (m) {
            return React.createElement(
                'li',
                { key: m.key },
                ' ',
                React.createElement(
                    'b',
                    null,
                    m.from
                ),
                ': ',
                m.text
            );
        }) : React.createElement(
            'p',
            null,
            'no Messages'
        )
    );
}

export default Chat;