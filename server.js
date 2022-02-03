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
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.ABIKEY}&language=en-US`;


const client = new pg.Client(process.env.DATABASE_URL);

Server.get('/homepage1', homePage);
Server.get('/trending', trendmovie);
Server.get('/search', searchmovie);
Server.get('/tv', searchtv);
Server.get('/episode', tvepisode);
Server.post('/favorite', handelFavorite);

Server.post('/addmovie', handeladdmovie);
Server.get('/getmovie', handelgetmovie);

Server.get('/onemovie/:id', onemovieHandler);
Server.put('/updatemovie/:id/:name', updatemovieHandler);
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

function trendmovie(req, res) {
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
    // let userSearch = req.query.userSearch;
    // console.log(userSearch);
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.ABIKEY}&language=en-US&query=spiderman&page=2`;
    console.log(url);
    axios.get(url)
        .then(res => {
            let tren = res.data.results.map(mov => {
                return new Movihit(mov.id, mov.title, mov.release_date, mov.overview);
            });
            res.status(200).json(tren);
        }).catch(error => {
            handelError(error, req, res);
        });
}


function searchtv(req, res) {
    let newTv = [];
    let url = `https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}?api_key=${process.env.ABIKEY}&language=en-US`;
    axios.get(url)
        .then(res => {
            resu.data.searchtv.forEach(tren => {
                newTv.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));

            });
            res.status(200).json(newTv);
        }).catch(error => {
            handelError(error, req, res);
        });
}


function tvepisode(req, res) {
    let newep = [];
    let url = `https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}/episode/{episode_number}?api_key=${process.env.ABIKEY}&language=en-US`;
    axios.get(url)
        .then(res => {
            resu.data.tvepisode.forEach(tren => {
                newep.push(new Movihit(tren.id, tren.title, tren.release_date, tren.overview));

            });
            res.status(200).json(newep);
        }).catch(error => {
            handelError(error, req, res);
        })
}

function handeladdmovie(req, res) {
    const mov = req.body;
    let sql = `INSERT INTO movies(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4,) RETURNING *;`
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

    let sql = `SELECT * FROM movies WHERE id=${req.Dune.id};`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        handelError(error, req, res)
    });
}

function updatemovieHandler(req, res) {
    const id = req.Dune.id;
    console.log(req.Dune.name);
    const movieli = req.body;
    const sql = `UPDATE movies SET title =$1, release_date = $2, poster_path = $3 ,overview = $4,id=$7 RETURNING *;`;
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

function handelFavorite(req, res) {
    return res.status(200).send("welcome to my favorite page");
}
function Error(status, responseText) {
    this.status = status;
    this.responseText = responseText;
}

function handelError(error, req, res) {
    let obj = new Error(500, `${error}`);
    res.status(500).send(obj);
    // const err = {
    //     status: 500,
    //     messgae: error
    // }
    //  res.status(500).send(obj);
}

function handelError2(req, res) {
    return res.status(404).send("page not found ");
}

client.connect().then(() => {
    Server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})

