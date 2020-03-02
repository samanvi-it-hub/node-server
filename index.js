const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');

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

app.post('/register',(req,res)=>{
    let com = req.body;
    console.log("request body",req.body)
    var datetime = new Date();
    console.log(com);
    // mysqlConnection.query("INSERT INTO sis_community SET sis_community_name=?, sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_modify_date=?,	sis_community_created_by=?,	sis_community_modify_by=? ",[com.comname,com.Type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.tower,'1',datetime,datetime,"swapna","swapna"],(err,rows,fields)=>{
    //     if(err){
    //         console.log('query error',err)
    //     }else{
    //         res.send(rows);
    //     }
    // })
    try{
        mysqlConnection.query("INSERT INTO sis_community SET sis_community_name=?,sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_modify_date=?,	sis_community_created_by=?,	sis_community_modify_by=?",[com.comname,com.Type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.tower,'1',datetime,datetime,"swapna","swapna"], (err, rows, fields) => {   
            for(i=1;i<=com.villa;i++)
                {
                    mysqlConnection.query("INSERT INTO sis_community_users SET sis_community_id=?,sis_community_user_id=?,	sis_community_user_name=?,sis_community_user_username=?,sis_community_user_password=?,sis_community_user_role=?,sis_community_user_status=?,sis_community_user_creation_date=?,sis_community_user_modify_date=?,sis_community_user_created_by=?,sis_community_user_modify_by=?",['2',i,com.comname+i,com.comname+i,"12345","1","1",datetime,datetime,"swapna","swapna"]);
                }
            res.send(rows);
           
        });
    }catch(err){
        console.log(err);
    }
    
});

app.post('/Owner',(req,res)=>{
    let own = req.body;
    mysqlConnection.query("INSERT INTO Owners SET HouseNum=?,Owner=?,Email=?,Ph=?,UserId=?,password=?",[own.house_no,own.ownername,own.email,own.ph,own.userName,own.password], (err, rows, fields) => {   
        if (!err){
            res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
});

app.post('/Supervisor',(req,res)=>{
    let sup = req.body;
    mysqlConnection.query("INSERT INTO supervisor SET SupervisorName=?,Ph=?,UserId=?,password=?",[sup.supname,sup.ph,sup.userName,sup.password], (err, rows, fields) => {   
        if (!err){
            res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
});

app.post('/login',(req,res)=>{
    let login = req.body;
    if(login.userid === 'admin' && login.password === 'admin'){
        res.status(200).json({response:'admin',data:{name:'ganesh',email:'ganesh@gmail.com'}});
        //res.send({admin})
   
    // } else{
    //     mysqlConnection.query("SELECT sis_community_user_role FROM sis_community_users WHERE sis_community_user_username=? AND sis_community_user_password=?",[login.userid,login.password], (err, rows, fields) => {   
    //         res.send(rows)
    //     })


    }
    // console.log("request data", login)
    // mysqlConnection.query("SELECT * FROM sis_community_users WHERE sis_community_user_username=? AND sis_community_user_password=?",[login.userid,login.password], (err, rows, fields) => { 
    //     if (!err){
    //         res.send(rows);
    //     } else{
    //         console.log(err);
    //     }   
    // })
});


// GET ALL Employees
app.get('/type',(req,res)=>{
    mysqlConnection.query("SELECT sis_community_type_id,sis_community_type_name FROM sis_community_type",(err,rows,fields)=>{
        if(!err){
            //console.log(rows[1].e_id);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});

// GET DATA FROM COMMUNITY TABLE
app.get('/communitydata', (req,res) =>{
    mysqlConnection.query("SELECT sis_community_name FROM sis_community", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

