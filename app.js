var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('UP')
})
app.post("/getall",function(req,res){
    res.send(req);
})
app.listen(process.env.PORT, () => console.log('Example app listening on port '+ process.env.PORT))