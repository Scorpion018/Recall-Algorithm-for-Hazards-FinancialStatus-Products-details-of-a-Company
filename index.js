var express = require('express');
var ejs = require('ejs');
var port = 8080;
var app = express();
const Pool = require('pg').Pool
var cors = require('cors')
const bodyParser = require("body-parser");    
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
var helper = require('./helper');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'newpass',
  port: 5432,
})

pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to postgreSQL");
});

let data = ''
let recallTitle = ''
let recallDescription = ''
let arrayName =[
  {
    title : recallTitle,
    desc : recallDescription
  }
]

app.get("/", (req, res) => {
  res.sendFile("./index.html", {
      root: __dirname,
  });
});


app.post('/set' , (req,res)=>{
  let url = `https://www.saferproducts.gov/RestWebServices/Recall?format=json&RecallTitle=${recallTitle}`
  if(req.body.titleRecall){
    recallTitle = req.body.titleRecall
    arrayName.title = req.body.titleRecall
  }
  if(req.body.descTitle){
    recallDescription = req.body.descTitle
    arrayName.desc = req.body.descTitle
    url = `https://www.saferproducts.gov/RestWebServices/Recall?format=json&RecallTitle=${recallTitle}&RecallDescription=${recallDescription}`
  }
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
setTimeout(()=>{
  res.render("Main", {
    path: data,
    path1 : [{
      title:recallTitle,
      desc : recallDescription
    }]
  });
},6000)
// res.json(data)
})

app.post('/states', (req, res) => {
  let sql = `select * from csv2016`
  if(req.body.year_filing_for && req.body.states_name === undefined && req.body.establishment_name === undefined){
    sql = `select * from csv${req.body.year_filing_for}`
  } else if(req.body.states_name && req.body.establishment_name === undefined && req.body.year_filing_for === undefined){
    sql = `select * from csv2016 where state='${req.body.states_name}'`
  }else if(req.body.establishment_name && req.body.year_filing_for === undefined && req.body.states_name === undefined ){
    sql = `select * from csv2016 where establishment_name LIKE '%${req.body.establishment_name}' OR establishment_name LIKE '%${req.body.establishment_name}%' OR establishment_name LIKE '${req.body.establishment_name}%'`
  }else if(req.body.year_filing_for && req.body.states_name &&  req.body.establishment_name === undefined ){
    sql = `select * from csv${req.body.year_filing_for} where state='${req.body.states_name}'`
  } else if(req.body.year_filing_for && req.body.establishment_name  && req.body.states_name === undefined){
    sql = `select * from csv${req.body.year_filing_for} where establishment_name LIKE '%${req.body.establishment_name}' OR establishment_name LIKE '%${req.body.establishment_name}%' OR establishment_name LIKE '${req.body.establishment_name}%'`
  } else if(req.body.states_name && req.body.establishment_name && req.body.year_filing_for === undefined){
    sql = `select * from csv2016 where state='${req.body.states_name}' AND  establishment_name LIKE '%${req.body.establishment_name}' OR establishment_name LIKE '%${req.body.establishment_name}%' OR establishment_name LIKE '${req.body.establishment_name}%'`;
  }else if(req.body.states_name && req.body.establishment_name && req.body.year_filing_for){
    sql = `select * from csv${req.body.year_filing_for} where state='${req.body.states_name}' AND  establishment_name LIKE '%${req.body.establishment_name}' OR establishment_name LIKE '%${req.body.establishment_name}%' OR establishment_name LIKE '${req.body.establishment_name}%'`;
  }
  console.log('Query',sql)
  pool.query(sql, (err, results) => {
      if (err) {
          throw err;
      } else {
        res.json(results.rows)
              // res.render("Index", {
                  // path: results.rows,
              // });
      }
  })
})

app.get('/earthquake' , (req,res)=>{
  let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&minmagnitude=5`
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
setTimeout(()=>{
  const newData = data.features
  res.render("Earthquake", {
    path: newData,
    helper:helper
  });
  // res.json(newData)
},3000)
})

app.post('/earth' , (req,res)=>{
let dateStart = req.body.startDate;
let dateEnd = req.body.endDate
let pathNew = [
  {
  placeData : req.body.place,
  }
]
let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dateStart}&endtime=${dateEnd}`
fetch(url)
 .then(res => res.json())
 .then(json => {
   data = json
})
console.log(req.body.place ? 'EarthquakePlace' : 'Earthquake')
console.log('URL', url)
if(helper.isEmpty(data)){
  res.sendFile("./noData.html", {
    root: __dirname,
})} else{
  // setTimeout(()=>{
  //   const newData = data.features
  //     res.render(req.body.place ? 'EarthquakePlace' : 'Earthquake', {
  //     path: newData,
  //     helper:helper,
  //     path1 : pathNew
  //   });
  //   console.log(url)
  // },6000)
  if(req.body.place){
  setTimeout(()=>{
    const newData = data.features
      res.render(req.body.place ? 'EarthquakePlace' : 'Earthquake', {
      path: newData,
      helper:helper,
      path1 : pathNew
    });
    console.log(url)
  },6000)
} else {
  setTimeout(()=>{
    const newData = data.features
    res.render("Earthquake", {
      path: newData,
      helper:helper,
      path1 : pathNew
    });
    console.log(url)
  },6000)
}
}
})

app.get('/watersource' , (req,res)=>{
  let url = `https://waterwatch.usgs.gov/webservices/realtime?region=ks&format=json`
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
setTimeout(()=>{
  res.json(data)
},6000)
console.log(url)
})

app.post('/watersource' , (req,res)=>{
  let regionPlace = req.body.regionName
  let url = `https://waterwatch.usgs.gov/webservices/realtime?region=${regionPlace}&format=json`
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
setTimeout(()=>{
  res.json(data)
},6000)
console.log(url)
})


app.get('/floodsource' , (req,res)=>{
  let url = ` https://waterwatch.usgs.gov/webservices/flood?region=10&format=json`
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
setTimeout(()=>{
  res.json(data)
},6000)
console.log(url)
})


app.post('/floodsource' , (req,res)=>{
  let floodPlace = req.body.floodRegionName
  let url = ` https://waterwatch.usgs.gov/webservices/flood?region=${floodPlace}&format=json`
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
setTimeout(()=>{
  res.json(data)
},6000)
console.log(url)
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`)
});
