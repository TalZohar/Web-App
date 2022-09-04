
'use strict';

function Meme_Generator(props){ //meme caption generation logic for game 2
    const {img_url,topText,bottomText} = props

    const canvasRef = React.useRef(null) //using canvas obj for meme
    const contextRef = React.useRef(null)

    React.useEffect(()=>{//react code for displaying canvas object
        const canvas = canvasRef.current
        // let image = document.createElement('img');
        // let width=0
        // let height=0
        let image = document.createElement('img');
        image.src = img_url;

        image.onload = function () {
            let width = image.width;
            let height = image.height;
            callback_load(canvas,image,width,height) //create the canvas
        };

    
    })

    const callback_load=(canvas,image,width,height)=>{
        // image.src = img_url;
        console.log(image.src)
        const ctx = canvas.getContext("2d");

        console.log(height)
        console.log(width)
        console.log("NEWW")
        const heightRatio = height/width

        // Update canvas background
        canvas.height = canvas.width*heightRatio;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        // Prepare text

        width = canvas.width;
        height = canvas.height;
        const fontSize = Math.floor(width / 10);
        const yOffset = height / 25;

        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.floor(fontSize / 4);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.lineJoin = "round";
        ctx.font = `${fontSize}px sans-serif`;
        // Add top text
        ctx.textBaseline = "top";
        ctx.strokeText(topText, width / 2, yOffset);
        ctx.fillText(topText, width / 2, yOffset);
    
        // Add bottom text
        ctx.textBaseline = "bottom";
        ctx.strokeText(bottomText, width / 2, height - yOffset);
        ctx.fillText(bottomText, width / 2, height - yOffset);

        contextRef.current = ctx;
    };

    return ( 
        <div>
        <canvas 
        style={{width:"100%"}}
        ref={canvasRef}
        />
        </div>) //display the canvas

};


export default Meme_Generator