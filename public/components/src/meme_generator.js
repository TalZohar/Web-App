
'use strict';

function Meme_Generator(props){
    const {img_url,topText,bottomText} = props

    const canvasRef = React.useRef(null) 
    const contextRef = React.useRef(null)

    React.useEffect(()=>{
        const canvas = canvasRef.current
        let image = document.createElement('img');
        image.src = img_url;
    

        const ctx = canvas.getContext("2d");
        let width = image.width;
        let height = image.height;
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
    
    })


    return (
        <div>
        <canvas 
        style={{width:"100%"}}
        ref={canvasRef}
        />
        </div>)

  

};


export default Meme_Generator