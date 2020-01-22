const mysql = require('mysql');
const express = require('express');
const t = express();
const bodyparser = require('body-parser');
const cors = require('cors');



//t.use(bodyparser.json());

t.use(bodyparser.json());
t.use(bodyparser.urlencoded({extended: false}));
t.use(cors());

var mysqlConnection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'facility',
    multipleStatements:true
});

mysqlConnection.connect((err)=>{
    if(!err){
        console.log('Connection Success...')
    }else{
        console.log('Connection failed \n Error : '+JSON.stringify(err,undefined,2));
    }

});

t.listen(5000,()=>console.log('Server is running on 5000'));

t.post('/register',(req,res)=>{
    let com = req.body;
    console.log(com);
    mysqlConnection.query("INSERT INTO community SET ComunityName=?,Email=?,Address=?,Type=?,No_of_Villas=?,No_of_towers=?,UserName=?,Password=?",[com.comname,com.email,com.address,com.Type,com.villa,com.tower,com.userName,com.password], (err, rows, fields) => {   
        if (!err){
            res.send('Inserted');
            mysqlConnection.query("CREATE TABLE Owners(HouseNum INT AUTO_INCREMENT PRIMARY KEY,OwnerName varchar(255),Email varchar(20),Ph varchar(20),UserId varchar(25),password varchar(20))");
        } else{
            console.log(err);
        }   
    })
    
});

t.post('/Owner',(req,res)=>{
    let own = req.body;
    mysqlConnection.query("INSERT INTO owner SET HouseNum=?,OwnerName=?,Email=?,Ph=?,UserId=?,Password=?",[own.HouseNum,own.OwnerName,own.Email,own.Ph,own.UserId,own.Password], (err, rows, fields) => {   
        if (!err){
            res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
});

t.post('/Supervisor',(req,res)=>{
    let sup = req.body;
    mysqlConnection.query("INSERT INTO supervisor SET SupervisorName=?,Ph=?,UserId=?,password=?",[sup.SupervisorName,sup.Ph,sup.UserId,sup.password], (err, rows, fields) => {   
        if (!err){
            res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
});
