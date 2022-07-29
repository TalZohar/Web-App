var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Timer = function Timer(props) {
    var _props$initialMinute = props.initialMinute,
        initialMinute = _props$initialMinute === undefined ? 0 : _props$initialMinute,
        _props$initialSeconds = props.initialSeconds,
        initialSeconds = _props$initialSeconds === undefined ? 0 : _props$initialSeconds,
        _props$endCallback = props.endCallback,
        endCallback = _props$endCallback === undefined ? function () {} : _props$endCallback;

    var _React$useState = React.useState(initialMinute),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        minutes = _React$useState2[0],
        setMinutes = _React$useState2[1];

    var _React$useState3 = React.useState(initialSeconds),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        seconds = _React$useState4[0],
        setSeconds = _React$useState4[1];

    React.useEffect(function () {
        var myInterval = setInterval(function () {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval);
                    endCallback();
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);
        return function () {
            clearInterval(myInterval);
        };
    });

    return React.createElement(
        "div",
        null,
        minutes === 0 && seconds === 0 ? null : React.createElement(
            "h1",
            null,
            " ",
            minutes,
            ":",
            seconds < 10 ? "0" + seconds : seconds
        )
    );
};

export default Timer;