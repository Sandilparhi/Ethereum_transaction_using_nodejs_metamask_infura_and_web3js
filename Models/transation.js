const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    from:{
        type : String,
        required :true
    },
    to:{
        type : String,
        required :true
    },
    value:{
        type : String,
        required :true
    },
    gasLimit:{
        type : String,
        required :true
    },
    gasPrice:{
        type : String,
        required :true
    },
    Hash:{
        type : String,
        require : true
    }},
    {
        timestamps:true
    },
);

module.exports = mongoose.model('Transaction', transactionSchema)