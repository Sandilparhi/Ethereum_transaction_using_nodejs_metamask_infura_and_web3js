const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

const mongoose = require('mongoose');
//MongoDB Connection
const MONGO_URL = "mongodb://localhost/Crypto"

mongoose.connect(MONGO_URL, {
    useNewUrlParser    : true,
    useUnifiedTopology : true
})
.then( () => {
    console.log("Database connected");
})
.catch( (eror) => {
    console.log("Database connection failed!");
    console.error(error);
    process.exit(1);
})


//Router access and use
const TransactionRoute = require('./routes/transactions')
app.use('/',TransactionRoute)


app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});