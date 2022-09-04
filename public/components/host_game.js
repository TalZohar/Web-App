var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import Timer from "./timer.js";
import Meme_Generator from "./meme_generator.js";
// import generateMemeCanvas from "./meme_generator.js";
'use strict';
//logic for host while game

function Player_Progress(props) {
    //display player answer prograss
    var num_answered = props.num_answered,
        user_list = props.user_list;


    if (!user_list) {
        return;
    }

    return user_list.map(function (e, i) {
        return React.createElement(
            "li",
            { key: i },
            " ",
            e,
            ": ",
            num_answered[i]
        );
    });
}

function Display_Winners(props) {
    //display winners at end of game
    var userVotes = props.userVotes,
        user_list = props.user_list;


    if (!user_list) {
        return;
    }

    var c = user_list.map(function (e, i) {
        return [e, userVotes[i]];
    });

    c.sort(function (a, b) {
        return b[1] - a[1];
    });

    return c.map(function (e, i) {
        return React.createElement(
            "li",
            { key: i },
            " ",
            e[0],
            " : ",
            e[1]
        );
    });
}

function Voting_Text(props) {
    //voting g1
    var question = props.question,
        answerLeft = props.answerLeft,
        answerRight = props.answerRight;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            "Question: ",
            question
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "h4",
                null,
                "Answer 1: ",
                answerLeft
            ),
            React.createElement(
                "h4",
                null,
                "Answer 2: ",
                answerRight
            )
        )
    );
}

function Voting_Meme(props) {
    //voting g2 (display voting)
    var memeMaker = function memeMaker(img, upper, lower) {
        var url = 'data:image/jpeg;base64,' + img;
        return React.createElement(Meme_Generator, { img_url: url, topText: upper, bottomText: lower });
    };

    var question = props.question,
        answerLeft = props.answerLeft,
        answerRight = props.answerRight;

    console.log(question);
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { "class": "row" },
            React.createElement(
                "div",
                { "class": "col-md-6", style: { "padding-right": "20px", "border-right": "1px solid #ccc" } },
                memeMaker(question, answerLeft.upper, answerLeft.lower)
            ),
            React.createElement(
                "div",
                { "class": "col-md-6" },
                memeMaker(question, answerRight.upper, answerRight.lower)
            )
        )
    );
}

function Voting_Drawing(props) {
    //votig g3 (display drawing)
    var question = props.question,
        answerLeft = props.answerLeft,
        answerRight = props.answerRight;

    console.log(answerLeft);

    React.useEffect(function () {
        // const canvasLeft = canvasLeftRef.current
        // const canvasRight = canvasRightRef.current

        // const contextLeft = canvasLeft.getContext("2d")
        // const contextRight = canvasRight.getContext("2d")

        //contextLeft.drawImage(answerLeft, 0, 0)
        // contextRight.drawImage(answerRight, 0, 0)
    }, []);

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            question
        ),
        React.createElement(
            "div",
            { "class": "row" },
            React.createElement(
                "div",
                { "class": "col-md-6", style: { "padding-right": "20px", "border-right": "1px solid #ccc" } },
                React.createElement(
                    "div",
                    null,
                    React.createElement("img", { src: answerLeft, "class": "mx-auto d-block img-fluid unlock-icon" })
                )
            ),
            React.createElement(
                "div",
                { "class": "col-md-6" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("img", { src: answerRight, "class": "mx-auto d-block img-fluid unlock-icon" })
                )
            )
        )
    );
}

function Voting_Host(props) {
    //voting logic
    var socket = props.socket,
        user_list = props.user_list,
        goToLobby = props.goToLobby;

    var _React$useState = React.useState(null),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        currentQuestion = _React$useState2[0],
        setCurrentQuestion = _React$useState2[1];

    var _React$useState3 = React.useState(null),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        answerLeft = _React$useState4[0],
        setAnswerLeft = _React$useState4[1];

    var _React$useState5 = React.useState(null),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        answerRight = _React$useState6[0],
        setAnswerRight = _React$useState6[1];

    var _React$useState7 = React.useState(null),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        gameType = _React$useState8[0],
        setGameType = _React$useState8[1];

    var _React$useState9 = React.useState(null),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        votingAnswers = _React$useState10[0],
        setVotingAnswers = _React$useState10[1];

    React.useEffect(function () {
        socket.on('vote', function (user, vote) {
            console.log(user.name, vote);
            socket.emit('hostVote_' + String(user.room_id), user, vote);
        });

        socket.on('endGame', function (userVotes) {
            console.log(userVotes);
            setVotingAnswers(function (prev) {
                return [].concat(_toConsumableArray(userVotes));
            });
        });

        socket.on('voteOnAnswers', function (question, answer1, answer2, type) {
            console.log(question, answer1, answer2, type);
            setCurrentQuestion(question);
            setAnswerLeft(answer1);
            setAnswerRight(answer2);
            setGameType(function (prev) {
                return type;
            });
        });
        socket.on('playerDisconnected', function (user) {
            console.log('user disconnected');
            socket.emit('playerDisconnected_voting');
        });
        return function () {
            socket.off('vote');
            socket.off('voteOnAnswers');
            socket.off('playerDisconnected');
        };
    }, []);

    var getVoteHTML = function getVoteHTML() {
        if (gameType) {
            if (gameType === "text") {
                return React.createElement(Voting_Text, { question: currentQuestion, answerLeft: answerLeft, answerRight: answerRight });
            } else if (gameType === "meme") {
                return React.createElement(Voting_Meme, { question: currentQuestion, answerLeft: answerLeft, answerRight: answerRight });
            } else if (gameType === "drawing") {
                return React.createElement(Voting_Drawing, { question: currentQuestion, answerLeft: answerLeft, answerRight: answerRight });
            } else {
                console.log('hsdhdhshs');
            }
        } else {
            console.log(gameType);
            return React.createElement(
                "p",
                null,
                "Loading Answers..."
            );
        }
    };

    return React.createElement(
        "div",
        { "class": "text-center vsc-initialized container-fluid" },
        votingAnswers ? //vote finished or not
        React.createElement(
            "div",
            { "class": "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column " },
            React.createElement(
                "div",
                { "class": "jumbotron" },
                React.createElement(
                    "h2",
                    null,
                    "Scorings"
                ),
                React.createElement("hr", null),
                React.createElement(Display_Winners, { userVotes: votingAnswers, user_list: user_list }),
                React.createElement(
                    "button",
                    { className: "center_button", style: { "backgroundColor": "white" }, onClick: goToLobby },
                    " Return to lobby "
                )
            )
        ) : React.createElement(
            "div",
            { "class": "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column " },
            React.createElement(
                "div",
                { "class": "jumbotron" },
                React.createElement(
                    "h2",
                    null,
                    "Pick your favorite"
                ),
                React.createElement("hr", null),
                getVoteHTML()
            )
        )
    );
}

function Game_Host(props) {
    //game logic
    var socket = props.socket,
        goToLobby = props.goToLobby;

    var _React$useState11 = React.useState("loading"),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        isQuestionPhase = _React$useState12[0],
        setIsQuestionPhase = _React$useState12[1];

    var _React$useState13 = React.useState({ time_minutes: null, time_seconds: null, id: null }),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        timeState = _React$useState14[0],
        setTimeState = _React$useState14[1];

    var _React$useState15 = React.useState(null),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        num_answered = _React$useState16[0],
        setNum_answered = _React$useState16[1];

    var _React$useState17 = React.useState(null),
        _React$useState18 = _slicedToArray(_React$useState17, 2),
        user_list = _React$useState18[0],
        setUser_list = _React$useState18[1];

    React.useEffect(function () {

        socket.on('questionPhaseEnd', function () {
            console.log('listening now');
            setIsQuestionPhase(false);
        });

        socket.on('startCountdown', function (time) {
            var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            //countdown
            console.log(time);
            setIsQuestionPhase(true);
            setTimeState({ time_minutes: time.minutes, time_seconds: time.seconds, id: id });
        });

        socket.on('answer', function (user, answer) {
            socket.emit('hostAnswer_' + String(user.id), user, answer);
        });

        socket.on('updateUserAnswers', function (num_answered, user_list) {
            console.log("update:", num_answered, user_list);
            setNum_answered(function (prev) {
                return [].concat(_toConsumableArray(num_answered));
            });
            setUser_list(function (prev) {
                return [].concat(_toConsumableArray(user_list));
            });
        });

        socket.on('playerDisconnected', function (user) {
            socket.emit('playerDisconnected_' + String(user.id));
        });

        return function () {
            socket.off('startCountdown');
            socket.off('answer');
            socket.off('vote');
            socket.off('updateUserAnswers');
            socket.off('playerDisconnected');
        };
    }, []);

    return React.createElement(
        "div",
        { "class": "text-center vsc-initialized container-fluid" },
        isQuestionPhase == "loading" ? //voting phase
        React.createElement(
            "div",
            { "class": "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column " },
            React.createElement(
                "div",
                { "class": "jumbotron" },
                React.createElement(
                    "h2",
                    null,
                    "Loading Questions "
                )
            )
        ) : isQuestionPhase ? //question phase
        React.createElement(
            "div",
            { "class": "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column " },
            React.createElement(
                "div",
                { "class": "jumbotron" },
                React.createElement(
                    "h3",
                    null,
                    "Answer Your Questions"
                ),
                React.createElement("hr", null),
                React.createElement(
                    "p",
                    null,
                    "Time Left:"
                ),
                React.createElement(Timer, { initialMinute: timeState.time_minutes, initialSeconds: timeState.time_seconds, endCallback: function endCallback() {
                        socket.emit("endCountdown", timeState.id);
                    } })
            ),
            React.createElement(
                "div",
                { "class": "text-left jumbotron", style: { opacity: 0.9, padding: "0.1%" } },
                React.createElement(Player_Progress, { num_answered: num_answered, user_list: user_list })
            )
        ) : React.createElement(Voting_Host, { socket: socket, user_list: user_list, goToLobby: goToLobby })
    );
}

export default Game_Host;