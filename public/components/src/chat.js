// import uuidv4 from 'uuid/v4'
// import { v4 as uuidv4 } from 'uuid';
'use strict';

function Chat(props) {
    const {socket} = props
    const  [messages, setMessages] = React.useState([])

    React.useEffect(() => {
        socket.on('newMessage', function (message) {
            message["key"]= Math.floor(Math.random() * 10000);
            setMessages((prev)=>{
                // prev.push(message)
                return [...prev, message]
            })
        
        })
        
    }, [])

    return (      
    <div>

        <p>Chat: </p>
        {(messages.length > 0) ?
        messages.map(m => {
                return <li key={m.key}> {m.from}: {m.text}</li>;
        })
        :
        <p>no Messages</p>
        }
      </div>);


    


}


export default Chat