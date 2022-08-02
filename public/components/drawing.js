'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function Drawing_Board(props) {
    var submitCallback = props.submitCallback;

    var canvasRef = React.useRef(null);
    var contextRef = React.useRef(null);

    var _React$useState = React.useState(false),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        isDrawing = _React$useState2[0],
        setIsDrawing = _React$useState2[1];

    React.useEffect(function () {
        var canvas = canvasRef.current;
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        var context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    var startDrawing = function startDrawing(_ref) {
        var nativeEvent = _ref.nativeEvent;
        var offsetX = nativeEvent.offsetX,
            offsetY = nativeEvent.offsetY;

        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    var finishDrawing = function finishDrawing() {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    var draw = function draw(_ref2) {
        var nativeEvent = _ref2.nativeEvent;

        if (!isDrawing) {
            return;
        }
        var offsetX = nativeEvent.offsetX,
            offsetY = nativeEvent.offsetY;

        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    var clear = function clear() {
        var canvas = canvasRef.current;
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextRef.current = context;
    };

    var onSubmit = function onSubmit(e) {
        var canvas = canvasRef.current;
        submitCallback(canvas.toDataURL());
        clear();
    };

    return React.createElement(
        "div",
        null,
        React.createElement("canvas", {
            onMouseDown: startDrawing,
            onMouseUp: finishDrawing,
            onMouseMove: draw,
            ref: canvasRef,
            style: { position: "fixed", top: 0, left: 0 }
        }),
        React.createElement(
            "button",
            { onClick: function onClick(e) {
                    return onSubmit(e);
                }, "class": "fixed_button_right btn btn-primary" },
            " Submit "
        ),
        React.createElement(
            "button",
            { onClick: function onClick(e) {
                    return clear();
                }, "class": "fixed_button_left btn-info" },
            " Clear "
        )
    );
}
export default Drawing_Board;