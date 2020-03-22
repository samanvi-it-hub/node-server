const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const Cryptr = require('cryptr');
const _ = require('underscore')
app.use(bodyparser.json());
app.use(cors());

var mysqlConnection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'sis_community_management',
    multipleStatements:true
});
mysqlConnection.connect((err)=>{
    if(!err){
        
        console.log('Connection Success...')
    }else{
        console.log('Connection failed \n Error : '+JSON.stringify(err,undefined,2));
    }

});

app.listen(5000,()=>console.log('Server is running on 5000'));

app.post('/login',(req,res,next)=>{
    login = req.body;
    //console.log(login.userid);
    query = "SELECT * FROM sis_community_login  WHERE login_username=? AND login_password=?";
    mysqlConnection.query(query,[login.userid,login.password],(err,result,fields)=>{
        if(_.isEmpty(result) === true) {
            res.status(400).send('Bad Request')
        }else{
            console.log('data')
        }
    });
});    