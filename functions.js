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

newDateFormatted = (timeStamp)=> {
  var dateFormat = new Date(timeStamp)
  var dateNew = `${dateFormat.getDate()}/${dateFormat.getMonth()}/${dateFormat.getFullYear()}`
  return dateNew;
}

newTimeFormatted = (timeStamp) => {
  var timeFormat = new Date(timeStamp)
  var timeNew = `${timeFormat.getHours}:${timeFormat.getMinutes}:${timeFormat.getSeconds}`
  return timeNew;
}

placeFetchAll = (place , keywordPlace) =>{
  if(place.includes(keywordPlace)){
      return true
  } else{
      return false
  }
}

isEmptyNew = obj => {
  return Object.keys(obj).length === 0;
}

module.exports = {
  newDate: newDate,
  newTime: newTime,
  placeFetch : placeFetch,
  isEmpty:isEmpty,
  newDateFormatted : newDateFormatted,
  newTimeFormatted: newTimeFormatted,
  placeFetchAll:placeFetchAll,
  isEmptyNew:isEmptyNew,
}

// exports.newDate = newDate
// exports.newTime = newTime
// exports.placeFetch = placeFetch
// exports.isEmpty = isEmpty
// exports.newDateFormatted = newDateFormatted
// exports.newTimeFormatted = newTimeFormatted
// exports.placeFetchAll = placeFetchAll
// exports.isEmptyNew = isEmptyNew
