'use strict';
const express =require('express');
const cors =require('cors');
const Server= express();
Server.use(cors());

 
let moviesdata =require('./moviesdata/data.json')

function Fav(title,poster_path,overview ){
this.title =title;
this.poster_path=poster_path;
this.overview=overview;
}
function homePage (req,res){ 
       let arr=new Fav (moviesdata.title,moviesdata.poster_path,moviesdata.overview) ;
    return res.status(200).json(arr);
}
Server.get('/favorite',handelFavorite)

function handelFavorite(req,res){
return res.status(200).send("welcome to my favorite page") ;
 }
  Server.get('/',handelError)

 function handelError(req,res){
  return res.status(500).send("sorry somthing went wrong") ;
  }
 Server.get('/',handelError2)

function handelError2(req,res){
return res.status(404).send("page not found ") ;
}

Server.listen(3000,() =>{
console.log  ('my server working');
}
)
