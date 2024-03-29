'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Drawing_Board from "./drawing.js";
//yser in game logic
function Answers_Text(props) {
    //answer textbox for user.
    var text = props.text,
        answerCallback = props.answerCallback;

    var _React$useState = React.useState(''),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        answer = _React$useState2[0],
        setAnswer = _React$useState2[1];

    var handleChange = function handleChange(event) {
        setAnswer(event.target.value);
    };
    var onAnswer = function onAnswer(e) {
        e.preventDefault();
        answerCallback(answer);
        setAnswer(function (prev) {
            return '';
        });
    };
    return React.createElement(
        'div',
        { style: { 'min-height': '100vh', 'display': 'flex', 'align-items': 'center' } },
        React.createElement(
            'div',
            { 'class': 'cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ' },
            React.createElement(
                'div',
                { 'class': 'jumbotron' },
                React.createElement(
                    'h3',
                    null,
                    'Answer the following question:'
                ),
                React.createElement(
                    'p',
                    null,
                    text
                ),
                React.createElement('input', {
                    type: 'text',
                    id: 'inputAnswer',
                    onChange: handleChange,
                    value: answer
                }),
                React.createElement(
                    'button',
                    { onClick: function onClick(e) {
                            return onAnswer(e);
                        } },
                    ' Submit '
                )
            )
        )
    );
}

function Answers_Meme(props) {
    //display meme, upper and lower caption textboxes
    var image = props.image,
        answerCallback = props.answerCallback;

    var _React$useState3 = React.useState(''),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        answerUpper = _React$useState4[0],
        setAnswerUpper = _React$useState4[1];

    var _React$useState5 = React.useState(''),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        answerLower = _React$useState6[0],
        setAnswerLower = _React$useState6[1];

    var handleChangeLower = function handleChangeLower(event) {
        setAnswerLower(event.target.value);
    };
    var handleChangeUpper = function handleChangeUpper(event) {
        setAnswerUpper(event.target.value);
    };
    var onAnswer = function onAnswer(e) {
        console.log('fmdjdj');
        console.log(image);
        e.preventDefault();
        answerCallback({ upper: answerUpper, lower: answerLower });
        setAnswerUpper(function (prev) {
            return '';
        });
        setAnswerLower(function (prev) {
            return '';
        });
    };
    console.log(image);
    return React.createElement(
        'div',
        { style: { 'min-height': '100vh', 'display': 'flex', 'align-items': 'center' } },
        React.createElement(
            'div',
            { 'class': 'cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ' },
            React.createElement(
                'div',
                { 'class': 'jumbotron' },
                React.createElement(
                    'h3',
                    null,
                    'Caption the meme:'
                ),
                React.createElement('input', {
                    'class': 'input_bar',
                    type: 'text',
                    id: 'upperAnswer',
                    onChange: handleChangeUpper,
                    value: answerUpper,
                    placeholder: 'Enter upper caption'

                }),
                React.createElement('input', {
                    'class': 'input_bar',
                    type: 'text',
                    id: 'lowerAnswer',
                    onChange: handleChangeLower,
                    value: answerLower,
                    placeholder: 'Enter lower caption'
                }),
                React.createElement(
                    'button',
                    { onClick: function onClick(e) {
                            return onAnswer(e);
                        } },
                    ' Submit '
                ),
                React.createElement(
                    'div',
                    { 'class': 'col align-self-center' },
                    React.createElement('img', { src: 'data:image/jpeg;base64,' + image, 'class': 'mx-auto d-block img-fluid unlock-icon' })
                )
            )
        )
    );
}

function Answers_Drawing(props) {
    //display question. user drawing logic
    var text = props.text,
        answerCallback = props.answerCallback;


    var submitCallback = function submitCallback(canvas) {
        answerCallback(canvas);
    };
    return React.createElement(
        'div',
        { style: { 'display': 'flex', 'align-items': 'center' } },
        React.createElement(
            'div',
            { 'class': 'cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ' },
            React.createElement(
                'div',
                { 'class': 'jumbotron' },
                React.createElement(
                    'h3',
                    null,
                    ' Draw the Following :',
                    text
                )
            )
        ),
        React.createElement(Drawing_Board, { submitCallback: submitCallback })
    );
}

function Answers_Player(props) {
    //player answer display logic
    var socket = props.socket;

    var _React$useState7 = React.useState(false),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        recievedAllAnswers = _React$useState8[0],
        setRecievedAllAnswers = _React$useState8[1];

    var _React$useState9 = React.useState(null),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        activeQuestion = _React$useState10[0],
        setActiveQuestion = _React$useState10[1];

    var _React$useState11 = React.useState(true),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        waiting = _React$useState12[0],
        setWaiting = _React$useState12[1];

    React.useEffect(function () {
        socket.on('question', function (data) {
            setActiveQuestion(data);
            console.log(data);
            setWaiting(false);
        });

        socket.on('timeEnd', function () {
            console.log("recieve time End");
            socket.off('question');
            socket.on('question', function (data) {
                console.log("emitting null");
                socket.emit('answer', { 'data': null });
            });
        });

        socket.on('userFinished', function () {
            console.log('userFinished');
            setRecievedAllAnswers(true);
        });
    }, []);

    var onAnswer = function onAnswer(data) {
        socket.emit('answer', { 'data': data });
        setWaiting(true);
    };

    var getQuestionHTML = function getQuestionHTML() {
        if (activeQuestion) {
            if (activeQuestion.type === "text") {
                return React.createElement(Answers_Text, { text: activeQuestion.data, answerCallback: onAnswer });
            } else if (activeQuestion.type === "meme") {
                return React.createElement(Answers_Meme, { image: activeQuestion.data, answerCallback: onAnswer });
            } else if (activeQuestion.type === "drawing") {
                return React.createElement(Answers_Drawing, { text: activeQuestion.data, answerCallback: onAnswer });
            } else {
                console.log("basa");
            }
        } else {
            return React.createElement(
                'p',
                null,
                'Loading Questions...'
            );
        }
    };

    return React.createElement(
        'div',
        { 'class': 'text-center vsc-initialized container-fluid' },
        recievedAllAnswers ? React.createElement(
            'div',
            { 'class': 'alert alert-info' },
            React.createElement(
                'h2',
                null,
                'Waiting for other players to answer'
            ),
            ' '
        ) : React.createElement(
            'div',
            null,
            waiting ? React.createElement(
                'div',
                { 'class': 'alert alert-info' },
                React.createElement(
                    'h2',
                    null,
                    'Waiting For the Next Question...'
                ),
                ' '
            ) : getQuestionHTML()
        )
    );
}

function Game_Player(props) {
    //full game (quesion+voting) logic
    var socket = props.socket,
        retToLobby = props.retToLobby;

    var _React$useState13 = React.useState(true),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        isQuestionPhase = _React$useState14[0],
        setIsQuestionPhase = _React$useState14[1];

    var _React$useState15 = React.useState(false),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        recievedVote = _React$useState16[0],
        setRecievedVote = _React$useState16[1];

    var _React$useState17 = React.useState(false),
        _React$useState18 = _slicedToArray(_React$useState17, 2),
        gameEnded = _React$useState18[0],
        setGameEnded = _React$useState18[1];

    React.useEffect(function () {
        socket.on('endGame', function () {
            console.log('ending game');
            setGameEnded(true);
        });
        socket.on('returnToLobby', function () {
            console.log('return to lobby');
            retToLobby();
        });

        socket.on('voting', function () {
            console.log('get vote');
            setIsQuestionPhase(false);
            setRecievedVote(false);
        });
    }, []);

    var onVote = function onVote(e, vote) {
        e.preventDefault();
        socket.emit('vote', vote);
        setRecievedVote(true);
    };

    return React.createElement(
        'div',
        { 'class': 'text-center vsc-initialized container-fluid' },
        gameEnded ? React.createElement(
            'div',
            { 'class': 'alert alert-info' },
            React.createElement(
                'h2',
                null,
                'Game Has Ended'
            )
        ) : isQuestionPhase ? React.createElement(Answers_Player, { socket: socket }) : recievedVote ? React.createElement(
            'div',
            { 'class': 'alert alert-info' },
            React.createElement(
                'h2',
                null,
                'Every vote counts! '
            )
        ) : React.createElement(
            'div',
            { style: { 'min-height': '100vh', 'display': 'flex', 'align-items': 'center' } },
            React.createElement(
                'div',
                { 'class': 'cover-container d-flex w-100 h-100 p-3 mx-auto flex-column ' },
                React.createElement(
                    'div',
                    { 'class': 'jumbotron' },
                    React.createElement(
                        'h2',
                        null,
                        'Which Answer is better?'
                    ),
                    React.createElement(
                        'button',
                        { className: "center_button", style: { "backgroundColor": "white" }, onClick: function onClick(e) {
                                return onVote(e, 0);
                            } },
                        ' Answer 1 '
                    ),
                    React.createElement(
                        'button',
                        { className: "center_button", style: { "backgroundColor": "white" }, onClick: function onClick(e) {
                                return onVote(e, 1);
                            } },
                        ' Answer 2 '
                    )
                )
            )
        )
    );
}

export default Game_Player;