let isRealString = (str) => {
    return typeof str == 'string' && str.trim().length > 0
}

let isValidRoom = (str, rooms)=>{
    if (!isRealString(str)){
        return false
    }
    return !rooms.getRoom(str)
}

module.exports = {isRealString, isValidRoom}