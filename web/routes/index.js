const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportlocal = require('passport-local');
const passportjwt = require('passport-jwt');
var blacklist = require('express-jwt-blacklist');
var jwtp = require('express-jwt');
const session = require('express-session');

const router = express.Router();
const datamodelds = require('../../datamodels/user');
const tokenmodels = require('../../datamodels/token');
const token = require('../../config/token');

router.get('/',(req,res)=>{
  res.send("Hello Tidyclean!");
});

router.post('/register',(req,res)=>{
  //console.log(req.body);
  const regUser = new datamodelds({
    fullname:req.body.fullname,
    username:req.body.username,
    email:req.body.email,
    phoneno:req.body.phoneno,
    password:req.body.password
  });
  //console.log(regUser);
  datamodelds.dbSave(regUser,(err,user)=>{
    if(err){
      
        if (err.name === 'MongoError' && err.code === 11000) {
            console.log('There was a duplicate key error');
        } 
    
      res.json({state:false,msg:"data not inserted!"})
    }else{
      res.json({state:true,msg:"data inserted!"})
    }
  })
});

router.post('/login',(req,res)=>{
  //res.send("Hello login!");
  const username = req.body.username;
  const password = req.body.password;

  datamodelds.searchUser(username,function(err,user){
    if(err) throw err;

    if(user){
      //console.log(user);
      datamodelds.matchpassword(password,user.password,function(err,match){
        if(err) throw err;
        if(match){
          //console.log({user});
         // res.json({state:true,msg:"Username, password mached!"});
         const obj = { _id: user._id,
          fullname:user.fullname,
          username:user.username,
          email:user.email,
          phoneno:user.phoneno,
          password:user.password,
          __v: user.__v };
      const newtoken = jwt.sign(obj,token.secrete,{expiresIn:86400},(err,newtoken)=>{
        if(err) {throw err;}
        else{
          const newtoken2 = new tokenmodels({
            token: newtoken
          });
          
          tokenmodels.tokenSave(newtoken2,(err,saved)=>{
            if(err) res.json({state:false,msg:err}) ;
            else{
                res.json({
                state:true,
                token:"Bearer "+newtoken,
                user:{
                  id: user._id,
                  fullname:user.fullname,
                  username:user.username,
                  email:user.email,
                  phoneno:user.phoneno,
                }
              });
            }
            });
        }
      });
        }else{
          res.json({state:false,msg:"Wrong password!"});
        }
      })
      
    }else{
      res.json({state:false,msg:"No user found!"});
    }
  })

});


router.get('/profile',token.verifytoken,(req,res)=>{
  var userdata = req.user;
  //console.log(req.session);
  res.json(userdata);

});

router.get('/about',token.verifytoken,(req,res)=>{
  var userdata = req.user;
  res.send("I'm "+userdata.fullname+". my user name is "+userdata.username);
});

router.get('/logout',token.verifytoken,(req,res)=>{
    const token = req.token;
    //console.log(token);
    tokenmodels.revokeToken(token,(err,removed)=>{
      if(err) throw err;
      else if(removed){
        res.json({state:true,msg:"successfully loged out!"});
      }else{
        res.json({state:false,msg:"no token found to revoke!"});
      }
    })
  
});





module.exports = router;