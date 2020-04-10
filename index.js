require("dotenv").config(); // for securely storing database information
const express=require('express');
const mysql=require('mysql');
const app=express();

const port=process.env.PORT || 3000;

//connection of database
var connection=mysql.createConnection({
    host: "remotemysql.com",
    user: "pcZ0OkiicI",
    password: "VM6g25BYW7",
    database: 'pcZ0OkiicI',
    multipleStatements:true  
});

//checking if the database is connected or not
connection.connect((err) => {
    if(err){
        console.log(err);
    }
    else {
        console.log('Connected to database...');
    }
});

app.get('/suggestions',(req,res)=>{

    var q=req.query.q;
    var latitude=req.query.latitude;
    var longitude=req.query.longitude;

    //checking if the latitude and longitude are present in query string.
    if(latitude && longitude){

         var sql=`select name,lat,longi from geoname where name like '${q}%';SELECT name,lat,longi,(3959 * acos(cos(radians(${latitude})) * cos(radians(lat)) * cos(radians(longi)-radians(${longitude}))+sin(radians(${latitude})) *sin(radians(lat )))) AS distance FROM geoname  HAVING distance < 28 ORDER BY distance `;

            connection.query(sql,(error,result,fields)=>{
            if(error){
                    res.status(500).send(error.message);
                }
                if(result.length==0){
                    // console.log("Result not found");
                    res.json({suggestion:[]});
                }
                else{
                    res.json({suggestion:result});
                }
            })
    }
    else {
        connection.query(`select name,lat,longi from geoname where name like '${q}%' ORDER BY name DESC`,(error,result,fields)=>{
                    if(error){
                            res.send(error.message);
                        }
                        if(result.length==0){
                            res.json({suggestion:[]});
                        }
                        else{
                            res.json({suggestion:result});
                        }
                    })
    }
});




app.listen(port,()=>{console.log(`server is running at ${port} port...`)});