class Rooms { //rooms object that contains all the rooms in exsistence
    constructor () {
        this.rooms = []
    }

    addRoom(room_id, host_id){ //add room
        let room = new Room(room_id, host_id)
        this.rooms.push(room)
        return room
    }

    getRoom(room_id){ // get room by id
        return this.rooms.filter((room) => room.room_id === room_id)[0]
    }

    removeRoom(room_id) { //remove room
        let room = this.getRoom(room_id)

        if(room){
            this.rooms = this.rooms.filter((room) => room.room_id !== room_id)
        }
        return room 
    }
    getRoomList () { //get lst of all rooms (room objs)
        let roomArray = this.rooms.map((room) => room.room_id)
        return roomArray
    }
}

class Room { //single room obj
    constructor(room_id, host_id) {
        this.room_id = room_id
        this.host_id = host_id
        this.users = []
        this.current_game=null
    }

    getUser(id) { //get user (in room) by id
        return this.users.filter((user) => user.id === id)[0]
    }
    
    removeUser(id) {//remove user from room
        let user = this.getUser(id)
        if(user){
            this.users = this.users.filter((user) => user.id !== id)
        }

        return user 
    }

    addUser(id, name) {// add user to room
        let room_id = this.room_id
        let score = 0
        let user = {id, name, room_id, score}
        this.users.push(user)
        return user
    }

    getNumOfUsers() {
        return this.users.length
    }

    getUserList() { //get all users in room
        let namesArray = this.users.map((user) => user.name)
        return namesArray
    }

    getClone(newRoom){ //get clone object of the room
        newRoom.room_id = this.room_id
        newRoom.host_id = this.host_id
        newRoom.users = []
        newRoom.current_game=this.current_game
        for(let i = 0; i <this.users.length; i++){
            newRoom.users[i]=this.users[i]
        }
        return newRoom

    }

}


module.exports = {Rooms, Room}