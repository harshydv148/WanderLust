const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({//Here passport local mongoose apne aap username or password ki 2 field
    email:{                    //apne aap save kra deta h bhale hi usey hum yha define kre ya na kre 
        type:String,           //isliye yha hum bus email ko save krenge but uska mtlb h ki yha 
        required: true         //username , password or email 3 fields h + hashing or salting bhi 
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema)