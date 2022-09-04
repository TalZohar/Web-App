// import node modules
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// import our modules
const {generateMessage} = require('./utils/message')
const {isRealString, isValidRoom} = require('./utils/stringCheck');
const { Users} = require('./utils/users')
const { Rooms, Room} = require('./utils/rooms')
const {Game1,Game2,Game3} = require('./games/games.js')


// create http server + express + socket
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server)

let users = new Users()
let rooms = new Rooms()

const publicPath = path.join(__dirname, '/../public/');
app.use(express.static(publicPath));
// app.use(express.static(path.join(__dirname, '/games/')));

io.on('connection', (socket) =>{ //player trying to connect
    let isHost = false
    console.log("A new user just connected")

    socket.on('getAvailable', (callback)=> { //returns available rooms to join
        callback(rooms.getRoomList())
    } )

    socket.on('createLobby', (params, callback) => {//host creating lobby
        if (!isValidRoom(params.room_id, rooms)){
            return callback('non valid room id')
        }
        isHost = rooms.addRoom(params.room_id, socket.id)
        
        // tell join screen that a new room was created
        io.emit("updateAvailable", rooms.getRoomList())
        callback()
    })

    socket.on('join', (params, callback) =>{ //player joining lobby
        if(!isRealString(params.name)){
            return callback('Invalid name')
        }
        let room = rooms.getRoom(params.room_id)
        if(!room){
            return callback('No such room')
        }
        // update room list
        socket.join(params.room_id)
        room.addUser(socket.id, params.name)

        // update user list
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room_id)
        
        io.to(room.host_id).emit('updateUsersList', room.getUserList() )
        io.to(room.host_id).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room`))
        callback()
    })
    
    socket.on('createMessage', (message, callback) => { //lobby message system
        let user = users.getUser(socket.id)

        if(user && isRealString(message.text)){
            let room = rooms.getRoom(user.room_id)
            io.to(room.host_id).emit('newMessage', generateMessage(user.name, message.text))
        }
        callback("me")

    })

    socket.on('startingGame', (game_num) => { //host decided to start game
        console.log(`starting game ${game_num} for room ${isHost.room_id}`)
        let game=0
        let room_copy =  isHost.getClone(new Room)

        if(game_num==1){ //creat game object
            game = new Game1(io, socket, room_copy, 2)
        }
        else if(game_num==2){
            game = new Game2(io, socket, room_copy, 2)
        }
        else if(game_num==3){
            game = new Game3(io, socket, room_copy, 2)
        }
        let room = rooms.getRoom(isHost.room_id)

        io.to(isHost.room_id).emit('startGame')
        room.current_game = game
        setTimeout(function(){game.startGame()}, 500); //start game
    })

    socket.on("answer", (answer)=>{ //recieving answer from player, and sending it to the host
        let user = users.getUser(socket.id)
        let room = rooms.getRoom(user.room_id)
        // console.log("recieved answer " + user.name + " " + answer.data)
        io.to(room.host_id).emit('answer', user, answer)
    })

    socket.on("returnToLobby", ()=>{ //end of game logic
        io.to(isHost.room_id).emit('returnToLobby')
    })



    socket.on("vote", (vote)=>{ //recieving vote from player and directing it to the host
        let user = users.getUser(socket.id)
        let room = rooms.getRoom(user.room_id)
        io.to(room.host_id).emit('vote', user, vote)
    })
    
    socket.on('disconnect', ()=>{ //player disconnection/host logic
        if (isHost){
            let room = rooms.removeRoom(isHost.room_id)
            io.to(room.room_id).emit("abrupt-disconnect")
            io.emit("updateAvailable", rooms.getRoomList())
            console.log(`end of room ${isHost.room_id}`)
            console.log(`remaining rooms: ${rooms.getRoomList()}`)
        }
        else {
            let user = users.removeUser(socket.id)
            if (user){
                let room = rooms.getRoom(user.room_id)
                if (room){
                    room.removeUser(user.id)
                    io.to(room.host_id).emit('updateUsersList', room.getUserList())
                    io.to(room.host_id).emit('newMessage', generateMessage('Admin', `see ya later ${user.name}, begone from ${user.room_id}`))
                    if(room.current_game){
                        console.log(user.id, "...disconnected...")
                        io.to(room.host_id).emit('playerDisconnected', user) //let host know player disconnented
                        room.current_game.num_disconnected+=1
                        room.current_game.disconnected[user.user_num]=true
                    }

                }
            }
        }

    })

})


// server listen
server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
})