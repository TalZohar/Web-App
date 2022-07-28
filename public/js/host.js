let socket = io();

socket.on('connect', function (){
    let searchQuery = window.location.search.substring(1)
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}')
    socket.emit('createLobby', params, function(err){
        if (err){
            console.log(params)
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No Error')
        }
    })
    let id = document.querySelector('#id')
    id.innerHTML =  params.room_id 
    console.log(params.room_id)

})

socket.on('updateUsersList', function (users){
    let ol = document.createElement('ol')

    users.forEach(function (user){
        let li = document.createElement('li')
        li.innerHTML = user;
        ol.appendChild(li)
    })
    
    let usersList = document.querySelector('#players')
    usersList.innerHTML = "";
    usersList.appendChild(ol)
})


socket.on('newMessage', function (message) {
    console.log("newMessage", message)
    let li = document.createElement('li')
    li.innerText = `${message.from}: ${message.text}`

    document.querySelector('body').appendChild(li)
})

socket.on('startCountdown', function (time=60) {
    setTimeout(()=>{}, time);
    socket.emit("endCountdown")
})

socket.on('answer', function(user, answer) { 
    console.log(user)
    console.log(answer)
    socket.emit(('hostAnswer_'+String(user.id)), user, answer)
})


document.querySelector('#game1-btn').addEventListener('click', function(e) {
    e.preventDefault()
    socket.emit("startingGame1")
})