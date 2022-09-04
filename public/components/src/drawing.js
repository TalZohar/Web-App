'use strict';

function Drawing_Board(props){ //drawing logic
    const {submitCallback} = props
    const canvasRef = React.useRef(null) 
    const contextRef = React.useRef(null)
    const [isDrawing, setIsDrawing] = React.useState(false)

    React.useEffect(()=>{
        const canvas = canvasRef.current
        canvas.width = window.innerWidth * 2
        canvas.height = window.innerHeight * 2
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`

        const context = canvas.getContext("2d")
        context.scale(2,2)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context
    }, [])

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    } //start drawing (mouse drawing)

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    } //finish drawing (mouse up)

    const draw = ({nativeEvent}) => {
        if (!isDrawing){
            return
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()

    } //get pos and draw

    const clear = () =>{
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextRef.current = context
    } //clear button

    const onSubmit = (e) => {
        const canvas = canvasRef.current
         submitCallback(canvas.toDataURL())
         clear()

    }

    return (
    <div>
    <canvas 
    onMouseDown={startDrawing}
    onMouseUp={finishDrawing}
    onMouseMove={draw}
    ref={canvasRef}
    style={{position: "fixed", top: 0, left: 0}}
    />
    <button onClick={(e)=>onSubmit(e)} class="fixed_button_right btn btn-primary"> Submit </button>
    <button onClick={(e)=>clear()} class="fixed_button_left btn-info"> Clear </button>
    </div>)
}
export default Drawing_Board