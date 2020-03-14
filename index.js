const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('samanvi-it-hyderabad');

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



// data insert into community table and owners table 
app.post('/register',(req,res)=>{
    let com = req.body;
    //console.log("request body",req.body)
    var datetime = new Date();
    //console.log(com);
        mysqlConnection.query("INSERT INTO sis_community SET sis_community_name=?,sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_modify_date=?,	sis_community_created_by=?,	sis_community_modify_by=?",[com.comname,com.Type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.tower,'1',datetime,datetime,"admin","admin"], (err, result) => {   

            if(!err){
               // console.log(result.insertId)
                com_id=result.insertId;
                if(com.check==true)
                {
                    // console.log("ganesh", com.check);
                    if(com.Type=='1')
                    {
                        for(i=1;i<=com.tower;i++)
                            {
                                mysqlConnection.query("INSERT INTO sis_community_owners SET sis_community_id=?,role_id=?,owner_name=?,owner_username=?,owner_password=?,owner_status=?,owner_created_date=?,owner_modify_date=?,owner_created_by=?,owner_modify_by=?",[com_id,"2",com.comname+i,com.comname+i,"12345","1",datetime,datetime,"admin","admin"],(err, result) => {
                                    if (!err) {
                                        own_id=result.insertId;
                                        mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[com_id,own_id,com.comname+i,"12345","2","1","admin","admin",datetime,datetime],(err, result) =>{
                                            if(!err){
                                                console.log('data enter into owners, login-1')
                                            }else{
                                                console.log(err)
                                            }
                                        });        

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
            
            
        });
      
});




app.post('/owner',(req,res)=>{
    own = req.body;
    // console.log(own);
    var datetime = new Date();
    mysqlConnection.query("UPDATE sis_community_owners SET owner_name=?,owner_username=?,owner_password=?,owner_phone=?,owner_email=?,owner_house_num=?,owner_h_total_area=?,owner_h_cons_area=?,house_type=?,owner_modify_date=?,owner_modify_by=? WHERE owner_id=?",[own.name,own.username,own.password,own.phone,own.email,own.house_num,own.h_t_area,own.h_c_area,own.h_type,datetime,own.name,own.id], (err, rows, fields) => {   
        if (!err){
            mysqlConnection.query("UPDATE sis_community_login SET login_username=?,login_password=?,login_modify_by=?,login_modify_date=? WHERE owner_id=?",[own.username,own.password,own.name,datetime,own.id], (err, rows, fields)=>{
                if(!err){
                    console.log('super')
                }else{
                    console.log(err);
                }
            });
            //res.send(rows);
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.post('/supervisor',(req,res)=>{
    var datetime = new Date();
    let sup = req.body;
    //console.log(sup);
    mysqlConnection.query("INSERT INTO sis_community_employees SET emp_name=?,emp_phone=?,role_id=?,emp_username=?,emp_password=?,sis_community_id=?,emp_status=?,emp_created_by=?,emp_modify_by=?,emp_created_date=?,emp_modify_date=?",[sup.name,sup.phone,"4",sup.username,sup.password,sup.comm_id,"1","admin","admin",datetime,datetime], (err, result) => {   
        if (!err){
            sup_id=result.insertId;
            mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[sup.comm_id,sup_id,sup.username,sup.password,"4","1","admin","admin",datetime,datetime],(err, result)=>{
                if(!err){
                    console.log('oko')
                }else{
                    console.log(err)
                }
            });
        } 
        else{
            console.log(err);
        }   
    });
    res.end();
});

app.post('/employee',(req,res)=>{
    var datetime = new Date();
    let emp = req.body;
    mysqlConnection.query("INSERT INTO sis_community_employees SET emp_name=?,emp_phone=?,role_id=?,sis_community_id=?,emp_status=?,emp_created_by=?,emp_modify_by=?,emp_created_date=?,emp_modify_date=?",[emp.name,emp.phone,"6",emp.comm_id,"1","admin","admin",datetime,datetime], (err, rows, fields ) => {   
      if (!err){
           res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.post('/tenant',(req,res)=>{
    var datetime = new Date();
    let tent = req.body;
    console.log(req.body);
    mysqlConnection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,owner_id=?,owner_house_num=?,tent_username=?,tent_password=?,tent_name=?,tent_phone=?,tent_email=?,tent_status=?,tent_tennure=?,tent_created_by=?,tent_modify_by=?,tent_created_date=?,tent_modify_date=?",[tent.com_id,tent.own_id,tent.owner_house_num,tent.username,tent.password,tent.name,tent.phone,tent.email,"1",datetime,tent.own_name,tent.own_name,datetime,datetime], (err, result ) => {   
      if (!err){
        tent_id=result.insertId;
          if(tent.check==true)
          {
            mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[tent.com_id,tent_id,tent.username,tent.password,"3","1",tent.own_name,tent.own_name,datetime,datetime],(err, result )=>{
                if(!err){
                    console.log('ok');
                }else{
                    console.log(err);
                }
            });
          }
        //    res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.get('/comm_names',(req,res)=>{
    var datetime = new Date();
    let board = req.body;
    mysqlConnection.query("SELECT * FROM sis_community", (err, rows,fields) => {   
      if (!err){
           res.send(rows);
        } else{
            console.log(err);
        }   
    })
});

app.post('/add_boardmember',(req,res)=>{
    var datetime = new Date();
    let bm = req.body;
    mysqlConnection.query("INSERT INTO sis_community_boardmembers SET sis_community_id=?,owner_h_num=?,boardmember_name=?,boardmember_designantion=?,boardmember_phone=?,boardmember_email=?,boardmember_tenure=?,boardmember_created_by=?,boardmember_modify_by=?,boardmember_created_date=?,boardmember_modify_date=?",[bm.com_id,bm.h_num,bm.bmname,bm.bmrole_id,bm.bmphone,bm.bmemail,datetime,"admin","admin",datetime,datetime], (err, result ) => {   
      if (!err){
        bm_id=result.insertId;
        mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[bm.com_id,bm_id,bm.username,bm.password,bm.bmrole_id,"1","admin","admin",datetime,datetime],(err, result )=>{
            if(!err){
                console.log('ok')
            }else{
                console.log(err);
            }
        });
           //res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
    //console.log(bm);
    res.end();
});

// app.post('/login',(req,res,next)=>{
//         login = req.body;
//         console.log(login);
//         try{
//             query = ("SELECT * FROM sis_community_login  WHERE login_username=? AND login_password=?")
//             mysqlConnection.query(query,[login.userid,login.password],(err,result,fields)=>{
//             if(!err){
//                 if(result == Object){
//                     console.log('ok')
//                     res.send('object')
//                 }
                
//             }else{
//                 res.send(err)
//             }
//         });
//         }catch(err){
//             console.log(err);
//         }
        
                


app.post('/login',(req,res,next)=>{
    login = req.body;
    console.log(login);
    mysqlConnection.query("SELECT * FROM sis_community_login  WHERE login_username=? AND login_password=?",[login.userid,login.password],(err,result,fields)=>{
        if(!err){
            console.log("role_id",result[0].role_id);  
            console.log("username",result[0].login_username);
            
            if(result[0].role_id == 1){
                res.send(result);
            } else if(result[0].role_id == 2 ) {
                roleid=result[0].role_id;
                username=result[0].login_username;
                mysqlConnection.query("SELECT * FROM sis_community_owners  WHERE role_id=? AND owner_username=? ",[roleid,username],(err,rows,fields)=>{
                    if(!err){
                        console.log("OWNER-DATA",rows);
                        res.send(rows);
                    }else{
                        console.log(err);
                    }
                } );
            } else if(result[0].role_id == 3 ) {
                roleid=result[0].role_id;
                username=result[0].login_username;
                mysqlConnection.query("SELECT * FROM sis_community_tenant  WHERE role_id=? AND tent_username=? ",[roleid,username],(err,rows,fields)=>{
                    if(!err){
                        console.log("TENANT-DATA",rows);
                        res.send(rows);
                    }else{
                        console.log(err);
                    }
                } );
            } else if(result[0].role_id == 4 ) {
                roleid=result[0].role_id;
                username=result[0].login_username;
                mysqlConnection.query("SELECT * FROM sis_community_employees  WHERE role_id=? AND emp_username=? ",[roleid,username],(err,rows,fields)=>{
                    if(!err){
                        console.log("SUPERVISOR-DATA",rows);
                        res.send(rows);
                    }else{
                        console.log(err);
                    }
                } );   
            } 
        } else{
            console.log(err);
            res.send(err);
        }
    });   
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
    mysqlConnection.query("SELECT * FROM sis_community", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

app.get('/communityroles', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('5','7','8','9','10','11','12')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

app.get('/tenantsdata', (req,res) =>{
    mysqlConnection.query("SELECT tent_name,tent_phone,tent_email,tent_status FROM sis_community_tenant", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

