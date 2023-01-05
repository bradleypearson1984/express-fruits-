//require dependencies 
const express = require('express');

//initialize the express application 
const app = express();

//configure settings 
require('dotenv').config(); 

console.log(process.env);
//require must be called BEFORE accessing
//.env variables 
const port = process.env.PORT;

//configure database 
const fruits = ['apple', 'banana', 'pear'];
//mount middleware

//mount routes 
//INDUCES -mnemonic 
//index -> GET /fruits  
app.get('/fruits', function(req, res){
    res.send(fruits);
});
//show  -> GET /fruits/:someUniqueIdentifier
app.get('/fruits/:indexOfFruitsArray', function(req, res) {
    const fruit = fruits[req.params.indexOfFruitsArray];
    res.send(fruit);
});
//tell the app to listen on a dedicated port for requests 
app.listen(port, function() {
    console.log(`Express is listening on port:${port}`)
});

