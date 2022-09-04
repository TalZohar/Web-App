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


function RoomInfo(props) { //get room info for display
    const {roomId, users} = props
    let usersAndId = []
    if (users){
        for (let i = 0; i < users.length; i++){
            usersAndId.push({user: users[i],id: i})
        }
    }
    return (
      <div>
        <h2><b>Room Id:</b> {roomId}</h2>
        <hr></hr>
        <h4>Players: </h4>
        {users
            ?  usersAndId.map(user => {
                return <li key={user.id}>{user.user}</li>;
              })
            : <p> No players joined yet</p>
        }
      </div>
    );

}

export default RoomInfo