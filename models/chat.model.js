const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chat = new Schema({
    users:[
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
},{timestampe:true});


module.exports = mongoose.model("Chat",chat);