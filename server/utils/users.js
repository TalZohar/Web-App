class Users {
    constructor (name, age) {
        this.users = []
    }

    addUser(id, name, room_id){
        let user = {id, name, room_id}
        this.users.push(user)
        return user
    }

    getUserList (room_id) {
        let users = this.users.filter((user) => user.room_id === room_id)
        let namesArray = users.map((user) => user.name)
 
        return namesArray
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
}

module.exports = {Users}