'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = 3000;
const Server = express();
const axios = require('axios');
Server.use(cors());
Server.use(express.json());
const pg = require('pg');



const client = new pg.Client(process.env.DATABASE_URL);

Server.get('/', homePage);
Server.get('/trending', trendmovie);
Server.get('/search', searchmovie);
Server.get('/toprated', movietoprated);
Server.get('/popular', popularmovie);
Server.get('/favorite', handelFavorite);

Server.post('/addmovie', handeladdmovie);
Server.get('/getmovie', handelgetmovie);

Server.get('/onemovie/:id', onemovieHandler);
Server.put('/updatemovie/:id', updatemovieHandler);
Server.delete('/deletemovie/:id', deletemovieHandler);

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
    return res.status(200).json(arr);
}

function handelFavorite(req, res) {
    return res.status(200).send("welcome to my favorite page");
}

function trendmovie(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.ABIKEY}&language=en-US`;
    let newArr = [];
    axios.get(url)
        .then((result) => {
            result.data.results.forEach(tren => {
                newArr.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));
            })
            res.status(200).json(newArr);
        }).catch((error) => {
            handelError(error, req, res);
        }
        )
}



function searchmovie(req, res) {
    let newArr = [];
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.ABIKEY}&language=en-US&query=Dune&page=2`;
    axios.get(url)
        .then((result) => {
            result.data.results.forEach(tren => {
                newArr.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));
            })
            res.status(200).json(newArr);
        }).catch(error => {
            handelError(error, req, res);
        });
}


function movietoprated(req, res) {
    let newArr = [];
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.ABIKEY}&language=en-US&page=1&include_adult=false`;
    console.log(req);
    axios.get(url)
    .then((result) => {
        result.data.results.forEach(tren => {
            newArr.push(new Movihit(tren.id,tren.name, tren.title, tren.release_date, tren.overview));
        })
        res.status(200).json(newArr);
    }).catch((error) => {
        handelError(error, req, res);
    }
    )
}


function popularmovie(req, res) {
    let newArr = [];
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.ABIKEY}&language=en-US&page=1&include_adult=false`;
    axios.get(url)
    
    .then((result) => {
        result.data.results.forEach(tren => {
            newArr.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));
        })
        res.status(200).json(newArr);
    }).catch((error) => {
        handelError(error, req, res);
    }
    )
}

function handeladdmovie(req, res) {
    const mov = req.body;
    let sql = `INSERT INTO movies(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values = [mov.title, mov.release_date, mov.poster_path, mov.overview];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        handelError(error, req, res)
    });
}



function handelgetmovie(req, res) {
    let sql = `SELECT * FROM movies;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        handelError(error, req, res)
    });
}

function onemovieHandler(req, res) {

    let sql = `SELECT * FROM movies WHERE id=${req.params.id};`;
    client.query(sql).then(data=>{
        res.status(200).json(data.rows);
     }).catch(error=>{
         errorHandler(error,req,res)
     });
 }

function updatemovieHandler(req, res) {
     const id = req.params.id;
    const movieli = req.body;
    const sql = `UPDATE movies SET title =$1, release_date = $2, poster_path = $3 ,overview =$4 WHERE id=$5 RETURNING *;`;
    let values = [movieli.title, movieli.release_date, movieli.poster_path, movieli.overview, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        handelError(error, req, res)
    });
}

function deletemovieHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM movies WHERE id=${id};`
    client.query(sql).then(() => {
        res.status(200).send("The movie has been deleted");
    }).catch(error => {
        handelError(error, req, res)
    });
}


function Error(status, responseText) {
    this.status = status;
    this.responseText = responseText;
}

function handelError(error, req, res) {
    let obj = new Error(500, `${error}`);
    res.status(500).send(obj);
}

function handelError2(req, res) {
    return res.status(404).send("page not found ");
}

client.connect().then(() => {
    Server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})

