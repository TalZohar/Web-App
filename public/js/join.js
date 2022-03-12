let socket = io()
socket.on('updateAvailable', function (rooms){
    let ol = document.createElement('ol')

    rooms.forEach(function (room_id){
        let li = document.createElement('li')
        li.innerHTML = room_id;
        ol.appendChild(li)
    })
    
    let roomsList = document.querySelector('#available')
    roomsList.innerHTML = "";
    roomsList.appendChild(ol)
})

socket.emit('getAvailable', function (rooms){
    let ol = document.createElement('ol')

    rooms.forEach(function (room_id){
        let li = document.createElement('li')
        li.innerHTML = room_id;
        ol.appendChild(li)
    })
    
    let roomsList = document.querySelector('#available')
    roomsList.innerHTML = "";
    roomsList.appendChild(ol)
})
