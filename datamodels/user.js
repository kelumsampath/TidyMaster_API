const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const userSchema = new schema({
    fullname:{type:String,required:true},
    username:{type:String,required:true, unique:true},
    email:{type:String,required:true},
    phoneno:{type:Number,required:true},
    password:{type:String,required:true}

});

const datamodels = module.exports = mongoose.model("datamodels",userSchema);

module.exports.dbSave = function(regUser,callback){

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(regUser.password, salt, function(err, hash) {
                //console.log(hash);
                regUser.password = hash;
                if(err){
                    throw err;
                }else{
                    regUser.save(err, callback);
                   
                    
                }
            });
        });

};


module.exports.searchUser = function(username,callback){
    const query = {username:username};
    datamodels.findOne(query,callback);
}; 



module.exports.matchpassword = function(password,hash,callback){
    //console.log(password+" "+hash);
    bcrypt.compare(password, hash, function(err, res) {
        if(err) throw  err;
        if (res){
            callback(null,res);
        } else{
            callback(null,res);
        }
       // console.log(res);
    });
}

module.exports.searchUser;