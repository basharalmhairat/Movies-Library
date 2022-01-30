'use strict';
const express =require('express');
const cors =require('cors');

const Server= express();
Server.use(cors());
const { response } = require('express');
const { redirect } = require('express/lib/response');
 
const data =require('movies data/data.json')

function fav(id,name,image ){
this.id =id;
this.name=name;
this.image=this.image
}
function fff (req,res){
    let favirot=[];
    data.data.forEach(val => {
       let arr=new fav (val.id,val.name,val.image) 
    });
    return res.status(200).json(favirot);
}
Server.get('/',handelError)

function handelError(req,res){
return res,status(500).send("sorry somthing went wrong") 
}
Server.get('/',handelError2)

function handelError2(req,res){
return res,status(404).send("page not found ") 
}

Server.listen(3000,() =>{
console.log  ('my server worke');
}
)
