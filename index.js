// import modules
var express = require('express')
const path = require('path');

// create a new instance of express
var app = express()

// public path
const publicPath = path.join(__dirname, '/../public/');

//port
const port = process.env.PORT || 3000

var http = require('http')
var server = http.createServer(app)
server.listen(port)

