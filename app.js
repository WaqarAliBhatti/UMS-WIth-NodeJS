const express=require('express')
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const mysql=require('mysql');

require('dotenv').config();

const app=express();
const PORT=process.env.PORT|| 8000;

//parsing middleware
app.use(bodyParser.urlencoded({extended:false}))
//parsing application/json
app.use(bodyParser.json())

app.use(express.static('public'));
//set up template Engine Extension
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
//set up View Engine
app.set('view engine','hbs');

//Creating Pool
const pool=mysql.createPool({
    connectionLimit : 100,     
    host            :process.env.DB_HOST,
    user            :process.env.DB_USER,
    password        :'',
    database        :process.env.DB_NAME
     
})
//DB Connection
pool.getConnection((err,connection)=>{
    if(err) throw err; // throws error if NotConnected
    console.log('Connected as ID '+ connection.threadId);
})

const routes=require('./server/routes/user');
app.use('/',routes);

app.listen(PORT,(req,res)=>{
console.log("Server is running on Port %s",PORT)
})