'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function Game_Player(props) {
    var socket = props.socket,
        endGameCallback = props.endGameCallback;

    var _React$useState = React.useState(true),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        isQuestionPhase = _React$useState2[0],
        setIsQuestionPhase = _React$useState2[1];

    React.useEffect(function () {
        socket.on('endGame', function () {
            console.log('ending game');
            endGameCallback();
        });

        socket.on('question', function (data) {
            console.log(data);
            setTimeout(function () {
                socket.emit('answer', data);
            }, 500);
        });

        socket.on('timeEnd', function () {
            console.log("recieve time End");
            socket.off('question');
            socket.on('question', function (data) {
                console.log("emitting null");
                socket.emit('answer', { 'data': null });
            });
        });
        socket.on('voting', function () {
            console.log('get vote');
            setIsQuestionPhase(false);
        });
    }, []);

    return React.createElement(
        'div',
        null,
        React.createElement(
            'p',
            null,
            'Game'
        ),
        isQuestionPhase ? React.createElement(
            'p',
            null,
            'Answer the following question: '
        ) : React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                'Which Answer is better?'
            ),
            React.createElement(
                'form',
                null,
                React.createElement(
                    'button',
                    { onClick: socket.emit('vote', 0) },
                    ' Left '
                )
            ),
            React.createElement(
                'form',
                null,
                React.createElement(
                    'button',
                    { onClick: socket.emit('vote', 1) },
                    ' Right '
                )
            )
        )
    );
}

export default Game_Player;