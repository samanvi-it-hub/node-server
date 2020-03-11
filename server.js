const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('samanvi-it-hyderabad');

app.use(bodyparser.json());
app.use(cors());

var connection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'sis_community_management',
    multipleStatements:true
});

connection.connect((err)=>{
    if(!err){
        console.log('Connection Success...')
    }else{
        console.log('Connection failed \n Error : '+JSON.stringify(err,undefined,2));
    }
});

app.listen(5000,()=>console.log('Server is running on 5000'));

// data insert into community table and owners table 
app.post('/register',(req,res)=>{
    let com = req.body;
    var datetime = new Date();
    // console.log(com)
    mysqlConnection.query("INSERT INTO sis_community SET sis_community_name=?,sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_modify_date=?,	sis_community_created_by=?,	sis_community_modify_by=?",[com.comname,com.Type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.tower,'1',datetime,datetime,"swapna","swapna"], (err, result) => {
        
    });
});






