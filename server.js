//DP
require('dotenv').config()
const express = require('express')
const cors = require('cors')


//Express Server
var port = process.env.PORT || 8000;
const app  = express()
app.use(express.json())
app.use(cors())


//Routing
const urlRoute = require('./routes/UrlRoute')
app.use('/', urlRoute);

    

const { error } = require('./utils/Error');
app.all('*', (req, res, next) => {
  res.send(error('This route dosent exist',404))
});

//Connect to Database and start server
require('./db/MongoClient').connectDb().then(result => {
  if(result){
    app.listen(port, function() {
      console.log('Server listening on port ' + port);
    });
  } else{
    console.log('Failed to connect to Database');
    process.exit(0)
  } 
})