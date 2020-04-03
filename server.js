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
    database:'sis_community_system',
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

app.get('/empsuproles', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('4','6')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})   

app.get('/ownertenantroles', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('2','3')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})      

app.get('/communitydata', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

app.post('/addemployeesupervisor',(req,res)=>{
    var datetime = new Date();
    let es = req.body;
    // console.log(emp);
    mysqlConnection.query("INSERT INTO sis_community_employees SET emp_name=?,emp_phone=?,emp_email=?,role_id =?,emp_username=?,emp_password=?,sis_community_id=?,emp_status=?,emp_created_by=?,emp_modify_by=?,emp_created_date=?,emp_modify_date=?",[es.empname,es.empphone,es.empemail,es.role_id,es.username,es.password,es.comm_id,'1',"admin","admin",datetime,datetime], (err, rows, fields ) => {   
      if (!err){
            console.log('employee data enter success...');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.post('/addownertenant',(req,res)=>{
    var datetime = new Date();
    let ot = req.body;
    // console.log(emp);
    if(ot.role_id==2){
    mysqlConnection.query("INSERT INTO sis_community_owners SET sis_community_id=?,role_id=?,owner_name=?,owner_username=?,owner_password=?,owner_phone=?,owner_email=?,owner_house_num=?,owner_status=?,owner_tennure=?,owner_created_date=?,owner_modify_date=?,owner_created_by=?,owner_modify_by=?",[ot.comm_id,ot.role_id,ot.name,ot.username,ot.password,ot.phone,ot.email,ot.house_num,"1",ot.aggrementdate,"admin","admin",datetime,datetime], (err, rows, fields ) => {   
      if (!err){
            console.log('owner data enter success...');
        } else{
            console.log(err);
        }   
    })
    }
    else{
       mysqlConnection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,role_id=?,owner_house_num=?,tent_username=?,tent_password=?,tent_name=?,tent_phone=?,tent_email=?,tent_status=?,tent_tennure=?,tent_created_by=?,tent_modify_by=?,tent_created_date=?,tent_modify_date=?",[ot.comm_id,ot.role_id,ot.house_num,ot.username,ot.password,ot.name,ot.phone,ot.email,"1",ot.aggrementdate,"admin","admin",datetime,datetime], (err, rows, fields ) => {   
              if (!err){
                    console.log('owner data enter success...');
                } else{
                    console.log(err);
                }   
            })  
    }
    res.end();
});

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









// data insert into community table and owners table 
app.post('/register',(req,res)=>{
    let com = req.body;
    let no_of_units=0;
    //console.log("request body",req.body)
    var datetime = new Date();
    console.log('BLOCK-DATA', com.blocks['0'].block);
        mysqlConnection.query("INSERT INTO sis_community SET sis_community_name=?,sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_modify_date=?,	sis_community_created_by=?,	sis_community_modify_by=?",[com.comname,com.Type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.number_of_blocks,'1',datetime,datetime,"admin","admin"], (err, result) => {   

            if(!err){
                com_id=result.insertId;
               console.log(result.insertId)
                if(com.number_of_blocks!=0){
                        com.blocks.forEach(function(value, index, array){
                            console.log(value.block);
                            console.log(value.flats);
                            no_of_units=no_of_units+value.flats;
                            console.log(no_of_units);
                            mysqlConnection.query("INSERT INTO sis_community_blocks SET sis_community_id=?,block_name=?,no_of_units=?,blocks_created_by=?,blocks_modify_by=?,blocks_created_date=?,blocks_modify_date=?",[com_id,value.block,value.flats,"admin","admin",datetime,datetime],(err,rows,fields)=>{
                            if(!err){
                                //console.log(rows[1].e_id);
                               
                              //  res.send(rows);
                              if(com.check==true)
                {
                    // console.log("ganesh", com.check);
                    if(com.Type=='1')
                    {
                        for(i=1;i<=no_of_units;i++)
                            {
                                mysqlConnection.query("INSERT INTO sis_community_owners SET sis_community_id=?,role_id=?,owner_name=?,owner_username=?,owner_password=?,owner_status=?,owner_created_date=?,owner_modify_date=?,owner_created_by=?,owner_modify_by=?",[com_id,"2",com.comname+i,com.comname+i,"12345","1",datetime,datetime,"admin","admin"],(err, result) => {
                                    if (!err) {
                                        own_id=result.insertId;
                                        // mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[com_id,own_id,com.comname+i,"12345","2","1","admin","admin",datetime,datetime],(err, result) =>{
                                        //     if(!err){
                                        //         console.log('data enter into owners, login-1')
                                        //     }else{
                                        //         console.log(err)
                                        //     }
                                        // });        

                                    }else{
                                        console.log(err)
                                    }
                                });  
                            }
                        res.end();
                    }
                    if(com.Type=='2')
                    {
                        for(i=1;i<=com.villa;i++)
                        {
                            mysqlConnection.query("INSERT INTO sis_community_owners SET sis_community_id=?,role_id=?,owner_name=?,owner_username=?,owner_password=?,owner_status=?,owner_created_date=?,owner_modify_date=?,owner_created_by=?,owner_modify_by=?",[com_id,"2",com.comname+i,com.comname,"12345","1",datetime,datetime,"admin","admin"],(err, result) =>{
                                if (!err){
                                    own_id=result.insertId;
                                    mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[com_id,own_id,com.comname,"12345","2","1","admin","admin",datetime,datetime],(err, result) =>{
                                        if(!err){
                                            console.log('data enter into owners, login-2')
                                        }else{
                                            console.log(err);
                                        }
                                    });
                                }else{
                                    console.log(err)
                                }
                            });
                                    
                        }
                        res.end();
                    }
                }
                            }else{
                                console.log(err);
                            }
                        })
                          });
                          console.log(no_of_units);    
                }else{
                    console.log('error');
                }

                 

            }else{
                console.log(err);
            } 
            
        });   
});



