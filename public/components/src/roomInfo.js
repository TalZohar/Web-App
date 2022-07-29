'use strict';
function getUsersHTML(users){
    if (!users){
        return
    }
    let ol = document.createElement('ol')
        
    users.forEach(function (user){
        let li = document.createElement('li')
        li.innerHTML = user;
        ol.appendChild(li)
    })
    return ol    
}


function RoomInfo(props) {
    const {roomId, users} = props
  
    return (
      <div>
        <p>id: {roomId}</p>
        <p>users: </p>
        {users
            ?  users.map(user => {
                return <li key="user">{user}</li>;
              })
            : <p> No players joined yet</p>
        }
      </div>
    );

}

export default RoomInfo