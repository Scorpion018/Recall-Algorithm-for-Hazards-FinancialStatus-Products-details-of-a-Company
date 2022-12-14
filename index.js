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
 console.log(recallTitle)
 console.log(recallDescription)
 fetch(url)
  .then(res => res.json())
  .then(json => {
    data = json
})
 res.render("Main", {
  path: data,
  path1 : [{
    title:recallTitle,
    desc : recallDescription
  }]
});
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


app.listen(port, () => {
  console.log(`Listening to port ${port}`)
});
