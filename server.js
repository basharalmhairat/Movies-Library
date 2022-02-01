'use strict';
const express =require('express');
const cors =require('cors');
const PORT = 3000;
const Server= express();
const axios =require('axios');
Server.use(cors());
let url = `https://www.themoviedb.org/movie/634649-spider-man-no-way-home?api_key=78adfdabd78ae095f7ac8f72a8aac158`;

function Movihit(id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.overview = overview;
}
let moviesdata =require('./moviesdata/data.json');
function Fav(title,poster_path,overview ){
this.title =title;
this.poster_path=poster_path;
this.overview=overview;
}
function homePage (req,res){ 
       let arr=new Fav (moviesdata.title,moviesdata.poster_path,moviesdata.overview) ;
    return res.status(200).json(arr);
}
Server.get('/trending',trendmovie);
function trendmovie(req,res){
    let newArr = [];
axios.get(url)
.then((resu)=>{
    resu.data.trending.forEach(tren =>{
        newArr.push(new Movihit(tren.id,tren.title,tren.release_date,tren.overview));
    })
    resu.status(200).json(newArr);
}).catch((err)=>{
}
)
}


Server.get('/search',searchmovie);
function searchmovie(req,res){
    let url = `https://www.themoviedb.org/movie/634649-spider-man-no-way-home?api_key=78adfdabd78ae095f7ac8f72a8aac158`;
    axios.get(url)
    .then(res=>{
        let trending = resu.data.trending.map(tren =>{
            return new mov(tren.id,tren.title,tren.release_date,tren.overview);
        });
        res.status(200).json(tren);  
     }).catch(err=>{

    })
}

Server.get('/favorite',handelFavorite);
function handelFavorite(req,res){
return res.status(200).send("welcome to my favorite page") ;
 }
  Server.get('/',handelError);
 function handelError(req,res){
  return res.status(500).send("sorry somthing went wrong") ;
  }
 Server.get('*',handelError2);
function handelError2(req,res){
return res.status(404).send("page not found ") ;
}
Server.listen(PORT,() =>{
console.log  ('my server working');
}
)
