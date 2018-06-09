const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
var blacklist = require('express-jwt-blacklist');

const app = express();
const port = process.env.PORT || 3000;
const user = require('./web/routes');
const config = require('./config/database');

http.createServer(app).listen(port,(err)=>{
  if (err) {
    console.error(err);
  } else {
    console.log("App listen to port:"+port);
  }
});

const connectDB = mongoose.connect(config.database,(err)=>{
if(err){
  console.log("Warning! Database not connected");
}else{
  console.log("Database connected"); 
}
});

app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
app.get('/',(req,res)=>{
  res.send("Hello App!");
});*/

app.use('/',user);

app.use(passport.initialize());
app.use(passport.session());

