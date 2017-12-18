var express = require('express')
var app = express()
var bodyParser = require('body-parser');
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('UP')
})
app.get("/getall",function(req,res){
     if(req.headers["x-api-key"] === "somekey")
    res.send({"error":false,"result":"Wow"});
    else
    res.send({
        "error":true,
        "message":"Invalid Key"
    })
})
app.listen(process.env.PORT, () => console.log('Example app listening on port '+ process.env.PORT))