
'use strict';

function Meme_Generator(props) {
    var img_url = props.img_url,
        topText = props.topText,
        bottomText = props.bottomText;


    var canvasRef = React.useRef(null);
    var contextRef = React.useRef(null);

    React.useEffect(function () {
        var canvas = canvasRef.current;
        var image = document.createElement('img');
        image.src = img_url;

        var ctx = canvas.getContext("2d");
        var width = image.width;
        var height = image.height;
        console.log(height);
        console.log(width);
        console.log("NEWW");
        var heightRatio = height / width;

        // Update canvas background
        canvas.height = canvas.width * heightRatio;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        // Prepare text

        width = canvas.width;
        height = canvas.height;
        var fontSize = Math.floor(width / 10);
        var yOffset = height / 25;

        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.floor(fontSize / 4);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.lineJoin = "round";
        ctx.font = fontSize + 'px sans-serif';
        // Add top text
        ctx.textBaseline = "top";
        ctx.strokeText(topText, width / 2, yOffset);
        ctx.fillText(topText, width / 2, yOffset);

        // Add bottom text
        ctx.textBaseline = "bottom";
        ctx.strokeText(bottomText, width / 2, height - yOffset);
        ctx.fillText(bottomText, width / 2, height - yOffset);

        contextRef.current = ctx;
    });

    return React.createElement(
        'div',
        null,
        React.createElement('canvas', {
            style: { width: "100%" },
            ref: canvasRef
        })
    );
};

export default Meme_Generator;