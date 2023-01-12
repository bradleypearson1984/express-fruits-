//require dependencies 
const express = require('express');
const methodOverride = require('method-override');
//initialize the express application 
const app = express();

//configure settings 
require('dotenv').config(); 

console.log(process.env);
//require must be called BEFORE accessing
//.env variables 
const port = process.env.PORT;

//configure database 
const fruits = require('./models/fruits');


//mount middleware - special functions that perform a service on a request
/*
1- reading info from a request
2- modifying info from a request
3- process data from a form submission
*/

app.use(express.urlencoded({extended: false})) // .use() is used to plug in middleware functions
app.use(methodOverride('_method')); //this takes a special query parameter 
// this way it knows which request needs to be overridden 

app.use(express.static('public'));

//gives us access to a special object called req.body
//req.body is used to gather form input

//mount routes 
//INDUCES -mnemonic 

/*
Index
New
Delete
Update
Create
Edit
Show

*/
app.get('/', function(req, res) {
    res.redirect('/fruits');
});

//index -> GET /fruits  
app.get('/fruits', function(req, res) {
    const readyToEat = req.query.readyToEat
    if(readyToEat) {
        const filteredFruits = fruits.filter(function(f) {
            return f.readyToEat === (readyToEat === 'true'); 
        });
        res.render('index.ejs', { 
            fruits: filteredFruits, 
            title: 'Index Page' });
    } else {
        res.render('index.ejs', { 
            fruits: fruits, 
            title: 'Index Page' 
        });
    }
});

//NEW -GET fruits/new sends the user to a page where they can add a new
//fruit by filling out a form 

app.get('/fruits/new', function(req, res) {
    res.render('new.ejs', {
        title: 'Create a New Fruit'
    });
});

//DELETE route DELETE/fruits/:indexOfFruitsArray

app.delete('/fruits/:indexOfFruitsArray', function(req, res) {
    fruits.splice(req.params.indexOfFruitsArray, 1); //remove the item from the array
    res.redirect('/fruits'); //redirect back to index route
  });
//UPDATE = PUT /fruits/:indexOfFruitsArray
app.put('/fruits/:indexOfFruitsArray', function(req, res) {
    if(req.body.readyToEat === 'on') {
        req.body.readyToEat = true
    } else {
        req.body.readyToEat = false;
    }
    //set the fruit object to updated version
    fruits[req.params.indexOfFruitsArray] = req.body; 
    //redirect user to the fruits index
    res.redirect('/fruits');

});
//CREATE - POST / fruits =take form data and create new fruit with it
app.post('/fruits', function(req, res) {
    console.log(req.body);
    if(req.body.readyToEat === 'on') {
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    //req.body.readyToEat = !!req.body.readyToEat;
    // double bang = double negative forces a boolean 

    fruits.push(req.body);
    res.redirect('/fruits') //tells browser to make a GET request to /fruits 
});

//EDIT GET /fruits/:indexOfFruitsArray/edit - sending a page that
//allows a user to edit a fruit
app.get('/fruits/:indexOfFruitsArray/edit', function(req, res) {
    // 1)find the fruit that we need to edit
    const fruit = fruits[req.params.indexOfFruitsArray];
    const index = req.params.indexOfFruitsArray;
    res.render('edit.ejs', {
        fruit: fruits[req.params.indexOfFruitsArray],
        index: req.params.indexOfFruitsArray,
        title: 'Edit ' + fruit.name,
    });
    // 2)include the fruit to edit inside the edit.ejs template
    // 3) also include the index of the fruit we're editing 
    // 3.1) this way we'll be able to make the update afterwards

})
//show  -> GET /fruits/:someUniqueIdentifier
app.get('/fruits/:indexOfFruitsArray', function(req, res) {
    const fruit = fruits[req.params.indexOfFruitsArray];
    res.render('show.ejs', { 
        fruit: fruit, 
        title: fruit.name + ' details',
    });
});


//tell the app to listen on a dedicated port for requests 
app.listen(port, function() {
    console.log(`Express is listening on port:${port}`)
});

