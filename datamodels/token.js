const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const tokenSchema = new schema({
    token:{type:String,required:true},
});

const tokenmodels = module.exports = mongoose.model("tokenmodels",tokenSchema);

module.exports.tokenSave = function(newtoken2,callback){
    //console.log(newtoken2);
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("dcdc", salt, function(err, hash) {
            if(err){
                throw err;
            }else{
                newtoken2.save(err, callback);
               
                
            }
        });
    });

};

module.exports.matchtoken = function(token,callback){
    const query = {token:token};
    tokenmodels.findOne(query,callback);
}; 

module.exports.revokeToken = function(token,callback){
    const query = {token:token};
    tokenmodels.remove(query,callback);
}; 