const Timer = (props) => { //react timer logic for countdown display
    const {initialMinute = 0,initialSeconds = 0, endCallback=()=>{}} = props;
    const [ minutes, setMinutes ] = React.useState(initialMinute);
    const [seconds, setSeconds ] =  React.useState(initialSeconds);
    React.useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                    endCallback()
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    return (
        <div>
        { minutes === 0 && seconds === 0
            ? null
            : <h1> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1> 
        }
        </div>
    )
    }

export default Timer