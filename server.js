const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
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








/*-------------------------------------------------ADMIN DASHBOARD QUERIES--------------------------------------------------------------------*/


/*========================COMMUNITY REGISTRATION=================================================================*/


app.post('/register', (req,res)=>{
    let com = req.body;
    console.log("REQUETBODY",req.body);
    var datetime = new Date();
    //console.log('BLOCK-DATA', com.blocks['0'].block);
    mysqlConnection.query("INSERT INTO sis_community SET sis_community_name=?,sis_community_sname=?,sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_modify_date=?,	sis_community_created_by=?,	sis_community_modify_by=?",[com.comname,com.comshortname,com.type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.number_of_blocks,'1',datetime,datetime,"admin","admin"], (err, result) =>{
        com_id=result.insertId;
        console.log('GANESHHHHHH',com_id);
        if(!err){
            if(com.type == '1'){
                console.log('TYPE', com.type)
                console.log('GANESH',com_id);
                com.blocks.forEach(function(value, index, array){
                    console.log('BLOCKS',value.block);
                    console.log('FLATS', value.flats);
                    no_of_units=value.flats;
                    console.log('TOTAL', no_of_units);
                
                mysqlConnection.query("INSERT INTO sis_community_blocks SET sis_community_id=?,block_name=?,no_of_units=?,blocks_created_by=?,blocks_modify_by=?,blocks_created_date=?,blocks_modify_date=?",[com_id,value.block,value.flats,"admin","admin",datetime,datetime],(err,rows,fields)=>{
                    if(!err){
                        if(com.check==true){
                            for(i=1;i<=value.flats;i++)
                                    {
                                        mysqlConnection.query("INSERT INTO sis_community_owners SET sis_community_id=?,role_id=?,owner_status=?,owner_created_date=?,owner_modify_date=?,owner_created_by=?,owner_modify_by=?",[com_id,"2","1",datetime,datetime,"admin","admin"],(err, result) => {
                                        if (!err) { 
                                        own_id=result.insertId;
                                        console.log('OWNER-ID',own_id);
                                        console.log('OWNER-ID-TYPE',typeof(own_id));
                                        // console.log('OWNER-ID-LENGTH',own_id);
                                        for(j=own_id;j<=own_id;j++){
                                            console.log('deepika(innerloop)');
                                            mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[com_id,j,com.comname+value.block+j,"12345","2","1","admin","admin",datetime,datetime],(err, result) =>{
                                            if(!err){
                                                console.log('data inserted into login table for apartments');
                                            }else{
                                                console.log(err)
                                            }
                                            });
                                        }
                                        }else{
                                            console.log(err)
                                        }
                                        });  
                                       // console.log('ganesh')   
                                    }
                        }

                    }else{
                        console.log(err);
                    }
                });
            }); 

            }else if(com.type == '2'){
                if(com.check==true){
                    console.log('VILLA', com.villa)
                    console.log('ID',com_id)
                    for(i=1;i<=com.villa;i++)
                       
                        {
                            mysqlConnection.query("INSERT INTO sis_community_owners SET sis_community_id=?,role_id=?,owner_status=?,owner_created_date=?,owner_modify_date=?,owner_created_by=?,owner_modify_by=?",[com_id,"2","1",datetime,datetime,"admin","admin"],(err, result) =>{
                                if (!err){
                                    own_id=result.insertId;
                                    for(j=own_id;j<=own_id;j++){
                                        mysqlConnection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_modify_by=?,login_created_date=?,login_modify_date=?",[com_id,own_id,com.comname+j,"12345","2","1","admin","admin",datetime,datetime],(err, result) =>{
                                            if(!err){
                                                console.log('data enter into owners, login-2')
                                            }else{
                                                console.log(err);
                                            }
                                        });

                                    }
                                   
                                }else{
                                    console.log(err)
                                }
                            });
                            console.log('harika')
                                    
                        }

                }


            }else{
                console.log('ERROR AT VILLA DATA')

            }
        } else{
            console.log('ERROR AT INSERT DATA',err)
        }
    });
    res.end();   
})


/*===============================================================================================================*/


/*=====START==============================get all community data=======================================================*/
app.get('/communitydata', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})
/*===================================================================================================================*/


/*=============================================get community roles===========================================*/
app.get('/communityroles', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('5','7','8','9','10','11','12')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})
/*=========================================================================================*/






/*======START============================get community id for input field display====================================*/
app.get('/communitytype/:id', (req,res)=>{
    id = req.params.id
    mysqlConnection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })

})
/*========STOP=====================================================================*/


/*===============================LOGIN====================================*/

app.post('/login',(req,res,next)=>{
    login = req.body;
    console.log(login);
    mysqlConnection.query("SELECT * FROM sis_community_login  WHERE login_username=? AND login_password=?",[login.userid,login.password],(err,result,fields)=>{
        if(_.isEmpty(result) === true) {
            res.status(400).send('Bad Request')
        }else{
            //console.log('data')
            if(!err){
                console.log("role_id",result[0].role_id);  
                console.log("OWNER-ID",result[0].owner_id);
                console.log("username",result[0].login_username);
                
                if(result[0].role_id == 1){
                    res.send(result);
                } else if(result[0].role_id == 2 ) {
                    roleid=result[0].role_id;
                    ownerid=result[0].owner_id;
                    console.log("ROLE IN INNER",roleid); 
                    username=result[0].login_username;
                    mysqlConnection.query("SELECT * FROM sis_community_owners  WHERE role_id=? AND owner_id=? ",[roleid,ownerid],(err,rows,fields)=>{
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
        }
        
    });   
});
/*=========================================================================*/

/*--------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------OWNER DASHBOARD QUERIES--------------------------------------------------------------------*/
/*===============================OWNER PROFILE==========================================*/
app.post('/owner',(req,res)=>{
    own = req.body;
    console.log(own);
    var datetime = new Date();
    mysqlConnection.query("UPDATE sis_community_owners SET owner_name=?,owner_username=?,owner_password=?,owner_phone=?,owner_email=?,owner_house_num=?,owner_modify_date=?,owner_modify_by=? WHERE owner_id=?",[own.name,own.username,own.password,own.phone,own.email,own.house_num,datetime,own.name,own.id], (err, rows, fields) => {   
        if (!err){
            mysqlConnection.query("UPDATE sis_community_login SET login_username=?,login_password=?,login_modify_by=?,login_modify_date=? WHERE owner_id=?",[own.username,own.password,own.name,datetime,own.id], (err, rows, fields)=>{
                if(!err){
                    console.log('sussess')
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

/*=========================================================================*/


/*===========================OWNER HOUSE DETAILS==============================================*/
app.post('/housedetails',(req,res)=>{
    var datetime = new Date();
    let hd = req.body;
    console.log(hd)
    mysqlConnection.query("INSERT INTO sis_community_units SET sis_community_id=?,owner_id=?,house_num=?,constructed_area=?,carpet_area=?,type=?,no_of_lights=?,no_of_fans=?,no_of_bedrooms=?,halls=?,kitchen=?,no_of_ac=?,unit_created_by=?,unit_modify_by=?,unit_created_date=?,unit_modify_date=?",[hd.community_id,hd.owner_id,hd.h_num,hd.total_area,hd.carpet_area,hd.h_type,hd.lights,hd.fans,hd.bedrooms,hd.halls,hd.kitchen,hd.ac,'owner','owner',datetime,datetime], (err, result) => {  
      if (!err){
          unitid = result.insertId;
          mysqlConnection.query("UPDATE sis_community_owners SET unit_id=? WHERE sis_community_id=? AND owner_id=?",[unitid,hd.community_id,hd.owner_id],(err,res)=>{
              if(!err){
                console.log('owner table updated with unit id')
              }else{
                console.log(err)
              }
          })
            console.log('owner house data success...');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

/*=========================================================================*/

/*==============================OWNER ADD TENANT===========================================*/


app.post('/owneraddtenant',(req,res)=>{
    var datetime = new Date();
    let ten = req.body;
    console.log(ten)
    mysqlConnection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,owner_id=?,role_id=?,owner_house_num=?,tent_username=?,tent_password=?,tent_name=?,tent_phone=?,tent_email=?,tent_status=?,tent_tennure=?,tent_created_by=?,tent_modify_by=?,tent_created_date=?,tent_modify_date=? ",[ten.com_id,ten.own_id,"3",ten.owner_house_num,ten.username,ten.password,ten.name,ten.phone,ten.email,"1",ten.aggrementdate,'owner','owner',datetime,datetime], (err, rows, fields ) => {   
      if (!err){
            console.log('tenant data enter success...');
        } else{
            console.log(err);
        }   
    })
    res.end();
});
/*=========================================================================*/

/*---------------------------------------------------------------------------------------------------------------------*/



/*-------------------------------------------------SUPERVISOR DASHBOARD QUERIES--------------------------------------------------------------------*/

app.get('/getCommData/:id', (req,res) =>{
    id = req.params.id
    console.log(id);
    mysqlConnection.query("SELECT sis_community_name FROM sis_community  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})


/*==============================PAYMENTS AND MAINTANCE=======================================*/


app.post('/commmaintenance', (req,res) =>{
    var datetime = new Date();
    var maintenance;
    let men = req.body;
    mysqlConnection.query("SELECT * FROM sis_community_maintenance  WHERE sis_community_id=? AND block=?",[men.Communityname,men.block_id],(err,rows,fields)=>{
        if(!err){
           if(_.isEmpty(rows) === true) {
    mysqlConnection.query("SELECT sis_community_maintenance FROM sis_community  WHERE sis_community_id=? ",[men.Communityname],(err,results,rows,fields)=>{
        if(!err){
            Object.keys(results).forEach(function(key)
            {
                var cost=results[key];
                maintenance=cost.sis_community_maintenance;
            })
            mysqlConnection.query("SELECT * FROM sis_community_units  WHERE sis_community_id=? AND block=?",[men.Communityname,men.block_id],(err,result,rows,fields)=>{
                if(!err){
                    Object.keys(result).forEach(function(key)
                    {
                        var hnum=result[key];
                        console.log(maintenance);
                        console.log(hnum.house_num);
                        mysqlConnection.query("INSERT INTO sis_community_maintenance SET sis_community_id=?,owner_house_num=?,block=?,flat_num=?,maintanance_month=?,maintenance_amt=?,main_created_by=?,main_modify_by=?,main_created_date=?,main_modify_date=?",[men.Communityname,hnum.house_num,men.block_id,hnum.flat_num,men.startdate,maintenance,"admin","admin",datetime,datetime], (err, rows, fields ) => {   
                            if (!err){
                                 res.send('Inserted');
                                 //res.redirect('/maintenance');
                              } else{
                                  console.log(err);
                              }   
                          })
                    })
                }else{
                    console.log(err)
                }
            })
        }else{
            console.log(err)
        }
    })
    
    }
    else{
        res.send(rows);  
    }
    }
    else{
        console.log(err)
    }
})

})

app.post('/maintenance', (req,res) =>{
    let men = req.body;
    mysqlConnection.query("SELECT * FROM sis_community_maintenance  WHERE sis_community_id=? AND block=?",[men.Communityname,men.block_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})

app.post('/recipt', (req,res) =>{
    let men = req.body;
    mysqlConnection.query("SELECT * FROM sis_community_payments  WHERE sis_community_id=? AND block=?",[men.Communityname,men.block_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})

app.get('/main_receipt/:id', (req,res) =>{
    id = req.params.id
    console.log(id);
    let men = req.body;
    console.log(men);
    mysqlConnection.query("SELECT * FROM sis_community_payments  WHERE invoice_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})
app.get('/mainowner/:id/:data', (req,res) =>{
    id = req.params.id
    data = req.params.data
    console.log(id);
    let men = req.body;
    console.log(men);
    mysqlConnection.query("SELECT * FROM sis_community_payments  WHERE sis_community_id=? AND owner_house_num=?",[id,data],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})

app.get('/paymentmode', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community_payment_mode  WHERE mode_status=? ",['1'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

app.post('/payment', (req,res) =>{
    let pay = req.body;
    var datetime = new Date();
    console.log(pay);
    if(pay.mode_id=='1'){
    mysqlConnection.query("INSERT INTO sis_community_payments SET invoice_id=?,sis_community_id=?,owner_house_num=?,maintanance_month=?,maintenance_amt=?,payment_mode=?,payment_status=?,payment_created_by=?,payment_modify_by=?,payment_created_date=?,payment_modify_date=? ",[pay.modata,pay.com_id,pay.owner,pay.maintenance_month,pay.m_due,pay.mode_id,'1',"admin","admin",datetime,datetime],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
}
else{
    mysqlConnection.query("INSERT INTO sis_community_payments SET invoice_id=?,sis_community_id=?,owner_house_num=?,maintanance_month=?,maintenance_amt=?,payment_mode=?,payment_status=?,payment_created_by=?,payment_modify_by=?,payment_created_date=?,payment_modify_date=? ",[pay.modata,pay.com_id,pay.owner,pay.maintenance_month,pay.m_due,pay.mode_id,'2',"admin","admin",datetime,datetime],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
}

})

app.get('/pendingPament', (req,res) =>{
    mysqlConnection.query("SELECT * FROM sis_community_payments  WHERE payment_status=?",['2'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

app.post('/pamentsapproval',(req,res)=>{
    var datetime = new Date();
    let pay = req.body;
    mysqlConnection.query("UPDATE sis_community_payments SET payment_status=?,payment_modify_by=?,payment_modify_date=?",['1',"admin",datetime], (err, rows, fields ) => {   
      if (!err){
           res.send('Inserted');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.get('/getcomdata/:id', (req,res) =>{
    id = req.params.id
    mysqlConnection.query("SELECT * FROM sis_community  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
    

})

app.get('/getblockdata/:id', (req,res) =>{
    id = req.params.id
    mysqlConnection.query("SELECT * FROM sis_community_blocks  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
    

})


app.post('/attendence', (req,res) =>{
    let att = req.body;
    var datetime = new Date();
    console.log(att);
    att.empl.forEach(function(value, index, array){
  mysqlConnection.query("INSERT INTO sis_community_attendence SET sis_community_id=?,date=?,emp_id=?,in_time=?,attendence_status=?",[att.com_id,att.date,value.id,value.in_time,value.status],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
})
})

app.post('/attendenceupdate', (req,res) =>{
    let att = req.body;
    var datetime = new Date();
    console.log(att);
    att.empl.forEach(function(value, index, array){
  mysqlConnection.query("UPDATE sis_community_attendence SET out_time=? WHERE attendence_id=?",[value.out_time,value.id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
})
})

app.get('/getsuperemployeedata/:id', (req,res) =>{
    id = req.params.id
    date = req.params.date
    mysqlConnection.query("SELECT * FROM sis_community_employees  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
    

})

app.get('/gettodayemps/:id/:date', (req,res) =>{
    id = req.params.id
    date = req.params.date
    console.log(date);
    mysqlConnection.query("SELECT * FROM sis_community_attendence JOIN sis_community_employees ON sis_community_attendence.emp_id=sis_community_employees.emp_id  WHERE sis_community_attendence.sis_community_id=? AND sis_community_attendence.date=?",[id,date],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
    

})

app.get('/ownerallcomplaints/:comp_id/:owner_id/:unit_id', (req,res) =>{
    comp_id = req.params.comp_id
    owner_id = req.params.owner_id
    unit_id=req.params.unit_id
    console.log(comp_id);
    mysqlConnection.query("SELECT * FROM sis_community_complaints WHERE sis_community_id=? AND owner_id=? AND unit_id=?",[comp_id,owner_id,unit_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
            console.log("sucess");
        }else{
            console.log(err)
        }
    })
    console.log("wer");
    

})


app.get('/allcomplaints/:comp_id', (req,res) =>{
    comp_id = req.params.comp_id
    
    mysqlConnection.query("SELECT * FROM sis_community_complaints WHERE sis_community_id=? AND status IN ('NOTSTARTED','OPEN','INPROGRESS')",[comp_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
            console.log("sucess");
        }else{
            console.log(err)
        }
    })
    console.log("wer");
    

})

app.post('/ownercomplaint',(req,res)=>{
    var datetime = new Date();
    let complaint= req.body;
    console.log(complaint)
    mysqlConnection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,owner_id=?,unit_id=?,complaint=?,complaint_description=?,owner_comments=?,complaint_date=?,urgent=?,status=?,created_by=?,modify_by=?,created_date=?,modify_date=?",[complaint.communityid,complaint.ownerid,complaint.unitid,complaint.complaint,complaint.Description,complaint.comments,datetime,complaint.urgent,"NOTSTARTED","gj","hhj",datetime,datetime], (err, rows, fields ) => {   
      if (!err){
            console.log('success...');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.post('/complaint',(req,res)=>{
    var datetime = new Date();
    let complaint= req.body;
    console.log(complaint)
    mysqlConnection.query("SELECT * FROM sis_community_complaints WHERE comp_id=?",[complaint.comp_id], (err, rows, fields ) => {   
      if (!err){
            if(rows.status==null)
            {
                mysqlConnection.query("UPDATE sis_community_complaints SET start_date=?,emp_id=?,status=? WHERE comp_id=?",[complaint.start_date,complaint.empid,complaint.status,complaint.comp_id],(err, rows, fields)=>{
                    if (!err){
                        console.log('success...');
                    } else{
                        console.log(err);
                    }    
                })
                mysqlConnection.query("INSERT INTO sis_complaint_history SET complaint_id =?,date=?,sup_comments=?,status=?,created_by=?,modify_by=?,created_date=?,modify_date=?",[complaint.comp_id,datetime,complaint.sup_comments,complaint.status,"sd","sd",datetime,datetime],(err, rows, fields)=>{
                    if (!err){
                        console.log('success...');
                    } else{
                        console.log(err);
                    } 
                })
            }
            if(rows.status=="OPEN")
            {
               
                mysqlConnection.query("INSERT INTO sis_complaint_history SET complaint_id =?,date=?,sup_comments=?,status=?,created_by=?,modify_by=?,created_date=?,modify_date=?",[complaint.comp_id,datetime,complaint.sup_comments,complaint.status,"sd","sd",datetime,datetime],(err, rows, fields)=>{
                    if (!err){
                        console.log('success...');
                    } else{
                        console.log(err);
                    } 
                })
            }
        } else{
            console.log(err);
        }   
    })
    res.end();
});
app.post('/complaints', (req,res) =>{
    
    
    let com = req.body;
    console.log(com);
    mysqlConnection.query("SELECT * FROM sis_community_complaints  WHERE status=?",[com.search],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
            console.log(rows);
        }else{
            console.log(err)
        }
    });

})

app.get('/history/:id', (req,res) =>{
    id = req.params.id
    console.log(id);
    let men = req.body;
    console.log(men);
    mysqlConnection.query("SELECT * FROM sis_complaint_history  WHERE complaint_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})

app.post('/cancel', (req,res) =>{
    let cancel = req.body;
    
    mysqlConnection.query("UPDATE sis_community_complaints SET status=?,cancel_comments=? WHERE comp_id=?",["CANCEL",cancel.cancel_comments,cancel.comp_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})


app.post('/addcomplaints',(req,res)=>{
    var datetime = new Date();
    let complaint= req.body;
    console.log(complaint)
    mysqlConnection.query("SELECT * FROM sis_community_units WHERE sis_community_id=? AND house_num=?",[complaint.communityid,complaint.hnum], (err,results, rows, fields ) => {   
      if (!err){
        Object.keys(results).forEach(function(key)
        {
        var set=results[key];
           owner_id=set.owner_id ;
           unit_id=set.unit_id;
           console.log(owner_id);
           console.log(unit_id);
        })
           mysqlConnection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,owner_id=?,unit_id=?,complaint=?,complaint_description=?,owner_comments=?,complaint_date=?,urgent=?,created_by=?,modify_by=?,created_date=?,modify_date=?",[complaint.communityid,owner_id,unit_id,complaint.complaint,complaint.Description,complaint.comments,datetime,complaint.urgent,"gj","hhj",datetime,datetime], (err, rows, fields ) => {   
            if (!err){
                  console.log('success...');
              } else{
                  console.log(err);
              }   
          })
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.post('/addtaskdaily',(req,res)=>{
    var datetime = new Date();
    let complaint= req.body;
    console.log(complaint)
    mysqlConnection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,complaint=?,complaint_date=?,emp_id=?,status=?,created_by=?,modify_by=?,created_date=?,modify_date=?",[complaint.communityid,complaint.taskname,datetime,complaint.empid,"NOTSTARTED","gj","hhj",datetime,datetime], (err, rows, fields ) => {   
      if (!err){
            console.log('success...');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.get('/tasklist', (req,res) =>{
    id = req.params.id
    console.log(id);
    
    mysqlConnection.query("SELECT * FROM sis_community_tasklist",(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})

app.post('/addotherdues', (req,res) =>{
    let main = req.body;
    var datetime = new Date();
    console.log(main);
    main.empl.forEach(function(value, index, array){
  mysqlConnection.query("UPDATE sis_community_maintenance SET otherdues=?,discounts=?,total=? WHERE invoice_id=?",[value.others,value.discounts,value.maintenance_amt+value.due+value.others-value.discounts,value.id],(err,rows,fields)=>{
        if(!err){
           // res.send(rows)
        }else{
            console.log(err)
        }
    })
})
})

app.post('/addvendor',(req,res)=>{
    var datetime = new Date();
    let vendor= req.body;
    console.log(vendor)
    mysqlConnection.query("INSERT INTO sis_community_vendors SET sis_community_id=?,vendor_name=?,vendor_phone=?,vendor_email =?,vendor_address=?,created_by=?,modify_by=?,created_date=?,modify_date=?",[vendor.communityid,vendor.vendor_name,vendor.phone,vendor.email,vendor.Address,"gj","hhj",datetime,datetime], (err, rows, fields ) => {   
      if (!err){
            console.log('success...');
        } else{
            console.log(err);
        }   
    })
    res.end();
});

app.get('/allcommvendors/:id', (req,res) =>{
    id = req.params.id
    console.log(id);
    
    mysqlConnection.query("SELECT * FROM sis_community_vendors  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})


app.post('/adminownerreports', (req,res) =>{
    let owner= req.body;
    console.log(owner)
   
    mysqlConnection.query("SELECT * FROM sis_community_owners  WHERE sis_community_id=?",[owner.community_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})

app.post('/admintenantreports', (req,res) =>{
    let tenant= req.body;
    console.log(tenant)
   
    mysqlConnection.query("SELECT * FROM sis_community_tenant  WHERE sis_community_id=?",[tenant.community_idid],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})


app.post('/adminresidentreports', (req,res) =>{
    let resi= req.body;
    console.log(resi)
   
    mysqlConnection.query("SELECT * FROM sis_community_units  WHERE sis_community_id=?",[resi.community_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });
  
})

app.post('/vendors', (req,res) =>{
    let vendor= req.body;
    console.log(vendor)
    mysqlConnection.query("SELECT * FROM sis_community_vendors  WHERE sis_community_id=?",[vendor.community_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
        }
    });

})