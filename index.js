var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var validator = require('express-validator');
var mysql = require('mysql');
var bcrypt = require("bcrypt");
const port = 4000
// app.use(bodyParser.urlencoded())
var db = mysql.createConnection({host:"localhost", user:"root", password: "", });

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

// import controller
var AuthController = require('./controllers/AuthController');

// import Router file
var pageRouter = require('./routers/route');

var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require("i18n-express");
app.use(bodyParser.json());
var urlencodeParser = bodyParser.urlencoded({ extended: true });

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1200000
  }
}));

app.use(session({ resave: false, saveUninitialized: true, secret: 'nodedemo' }));
app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["ug","en","latin","uy","uz","af","kz","kg","tr"],
  textsVarName: 'translation'
}));

app.use('/public', express.static('public'));

app.get('/layouts/', function (req, res) {
  res.render('view');
});

// apply controller
AuthController(app);

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
const { decodeBase64 } = require('bcryptjs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Define All Route 
pageRouter(app);
app.get("/kakkokdb",(req, res) => {
  let sql = "CREATE DATABASE users";
  db.query(sql, (err) => {
    if (err){
      throw err;
    }
    res.send("database created");
  });
});
app.get('/', function (req, res) {
  res.redirect('/');
});

// http.listen(4000, function () {
//   console.log('listening on *:4000');
// });
app.listen(port, () => console.info(`App listening on port ${port}`))