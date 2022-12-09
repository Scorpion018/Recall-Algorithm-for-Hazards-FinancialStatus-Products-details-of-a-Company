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
let recallTitle = 'child'
let recallDescription = 'toys'
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
  if(req.body.titleRecall){
    recallTitle = req.body.titleRecall
    arrayName.title = req.body.titleRecall
  }
  if(req.body.descTitle){
    recallDescription = req.body.descTitle
    arrayName.desc = req.body.descTitle
  }
 console.log(recallTitle)
 console.log(recallDescription)
 fetch(`https://www.saferproducts.gov/RestWebServices/Recall?format=json&RecallTitle=${recallTitle}&RecallDescription=${recallDescription}`)
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
})

app.post('/states', (req, res) => {
  var sql = `select * from csv${req.body.year_filing_for} where state='${req.body.states_name}' AND  establishment_name LIKE '%${req.body.establishment_name}' OR establishment_name LIKE '%${req.body.establishment_name}%' OR establishment_name LIKE '${req.body.establishment_name}%'`;
  // var sql = `select * from csv${req.body.year_filing_for} where state='${req.body.states_name}'`;
  console.log('Query',sql)
  pool.query(sql, (err, results) => {
      if (err) {
          throw err;
      } else {
              res.render("Index", {
                  path: results.rows,
              });
      }
  })
})


app.listen(port, () => {
  console.log(`Listening to port ${port}`)
});
