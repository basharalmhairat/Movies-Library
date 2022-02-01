'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = 3000;
const Server = express();
const axios = require('axios');
Server.use(cors());
const pg = require('pg');
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=78adfdabd78ae095f7ac8f72a8aac158&language=en-US`;


const client = new pg.Client(process.env.DATABASE_URL);

Server.get('/trending', trendmovie);
Server.get('/search', searchmovie);
Server.get('/tv', searchtv);
Server.get('/episode', tvepisode);
Server.post('/favorite', handelFavorite);

Server.post('/addmovie', handeladdmovie);
Server.get('/getmovie', handelgetmovie);

Server.use(handelError);
Server.use('*', handelError2);


function Movihit(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.overview = overview;
    this.poster_path = poster_path
}
let moviesdata = require('./moviesdata/data.json');
function Fav(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
function homePage(req, res) {
    let arr = new Fav(moviesdata.title, moviesdata.poster_path, moviesdata.overview);
    return res.status(200).json(error);
}

function trendmovie(req, res) {
    let newArr = [];
    axios.get(url)
        .then((resu) => {
            resu.data.trending.forEach(tren => {
                newArr.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));
            })
            resu.status(200).json(newArr);
        }).catch((err) => {
            handelError(err, req, res);
        }
        )
}



function searchmovie(req, res) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=78adfdabd78ae095f7ac8f72a8aac158&language=en-US&query=The&page=2`;
    axios.get(url)
        .then(res => {
            let trending = resu.data.trending.map(tren => {
                return new mov(tren.id, tren.title, tren.release_date, tren.overview);
            });
            res.status(200).json(tren);
        }).catch(err => {
            handelError(err, req, res);
        })
}


function searchtv(req, res) {
    let newTv = [];
    let url = `https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}?api_key=78adfdabd78ae095f7ac8f72a8aac158&language=en-US`;
    axios.get(url)
        .then(res => {
            resu.data.searchtv.forEach(tren => {
                newTv.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));

            });
            res.status(200).json(tren);
        }).catch(err => {
            handelError(err, req, res);
        })
}


function tvepisode(req, res) {
    let newep = [];
    let url = `https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}/episode/{episode_number}?api_key=78adfdabd78ae095f7ac8f72a8aac158&language=en-US`;
    axios.get(url)
        .then(res => {
            resu.data.tvepisode.forEach(tren => {
                newTv.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));

            });
            res.status(200).json(tren);
        }).catch(err => {
            handelError(err, req, res);
        })
}

function handeladdmovie(req,res){
    const mov = req.body;
    let sql = `INSERT INTO movies(title,id,release_date,poster_path,overview) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    let values=[Movihit.title,Movihit.release_date,Movihit.poster_path,Movihit.overview];
    client.query(sql,values).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
  }


  
function handelgetmovie(req,res){
    let sql = `SELECT * FROM movies;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}

function handelFavorite(req, res) {
    return res.status(200).send("welcome to my favorite page");
}

function handelError(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(error);
}

function handelError2(req, res) {
    return res.status(404).send("page not found ");
}

client.connect().then(() => {
    Server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})

