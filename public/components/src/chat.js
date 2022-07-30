'use strict';

function Chat(props) {
    const {socket} = props
    const  [messages, setMessages] = React.useState([])

    React.useEffect(() => {
        socket.on('newMessage', function (message) {
            let temp = [...messages]
            message["key"]=messages.length
            temp.push(message)
            console.log(temp)
            setMessages((prev)=>{
                prev.push(message)
                return prev
            })
            let li = document.createElement('li')
            li.innerText = `${message.from}: ${message.text}`
        
            document.querySelector('body').appendChild(li)
        })
        
    }, [])

    return (      
    <div>
        <p>Chat: </p>
        {(messages.length > 0) ?
        messages.map(m => {
                return <li key={m.key}> {m.from}: {m.text}"</li>;
        })
        :
        <p>no Messages</p>
        }
      </div>);


    


}


export default Chat