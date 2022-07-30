let socket = io();

socket.on('connect', function (){
    let searchQuery = window.location.search.substring(1)
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}')
    socket.emit('join', params, function(err){
        if (err){
            console.log(params)
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No Error')
        }
    })
})

socket.on('disconnect', function (){
    console.log('disconnected from server')
})
socket.on('abrupt-disconnect', function (){
    alert("host disconnected")
    window.location.href = '/'
})
socket.on('startGame1', function(){
    console.log("starting game 1")
       

})
socket.on('question', function(data){
    console.log(data)
    //socket.emit('answer', data)
    setTimeout(function(){socket.emit('answer', data)}, 500);
})

socket.on('timeEnd', function(){
    console.log("recieve time End")
    socket.off('question')
    socket.on('question', function(data){
        console.log("emitting null")
        socket.emit('answer', {'data':null})
    })
})
socket.on('voting', function(){
    console.log('get vote')
    setTimeout(function(){socket.emit('vote', 0)}, 500);
})



document.querySelector('#submit-btn').addEventListener('click', function(e) {
    e.preventDefault()
    socket.emit("createMessage", {
        text: document.querySelector('input[name="message"]').value
    }, function() {

    })
})