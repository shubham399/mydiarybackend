var express = require('express')
var app = express()
var bodyParser = require('body-parser');
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('UP')
})
app.post("/getall",function(req,res){
    res.send(req);
})
app.listen(process.env.PORT, () => console.log('Example app listening on port '+ process.env.PORT))