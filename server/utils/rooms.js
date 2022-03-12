class Rooms {
    constructor () {
        this.rooms = []
    }

    addRoom(room_id, host_id){
        let room = new Room(room_id, host_id)
        this.rooms.push(room)
        return room
    }

    getRoom(room_id){
        return this.rooms.filter((room) => room.room_id === room_id)[0]
    }

    removeRoom(room_id) {
        let room = this.getRoom(room_id)

        if(room){
            this.rooms = this.rooms.filter((room) => room.room_id !== room_id)
        }
        return room 
    }
    getRoomList () {
        let roomArray = this.rooms.map((room) => room.room_id)
        return roomArray
    }
}

class Room {
    constructor(room_id, host_id) {
        this.room_id = room_id
        this.host_id = host_id
        this.users = []
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]
    }
    
    removeUser(id) {
        let user = this.getUser(id)
        if(user){
            this.users = this.users.filter((user) => user.id !== id)
        }

        return user 
    }

    addUser(id, name) {
        let room_id = this.room_id
        let score = 0
        let user = {id, name, room_id, score}
        this.users.push(user)
        return user
    }

    getNumOfUsers() {
        return this.users.length
    }

    getUserList () {
        let namesArray = this.users.map((user) => user.name)
        return namesArray
    }

}


module.exports = {Rooms, Room}