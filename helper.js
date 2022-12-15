 newDate = (timeStamp)=> {
    var dateFormat = new Date(timeStamp)
    var dateNew = `${dateFormat.getDate()}/${dateFormat.getMonth()}/${dateFormat.getFullYear()}`
    return dateNew;
}

newTime = (timeStamp) => {
    var timeFormat = new Date(timeStamp)
    var timeNew = `${timeFormat.getHours}:${timeFormat.getMinutes}:${timeFormat.getSeconds}`
    return timeNew;
}

placeFetch = (place , keywordPlace) =>{
    if(place.includes(keywordPlace)){
        return true
    } else{
        return false
    }
}

isEmpty = obj => {
    return Object.keys(obj).length === 0;
}

module.exports = {
    newDate: newDate,
    newTime: newTime,
    placeFetch : placeFetch,
    isEmpty:isEmpty,
}

// exports.newDate = newDate
// exports.newTime = newTime
// exports.placeFetch = placeFetch
// exports.isEmpty = isEmpty
