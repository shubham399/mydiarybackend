var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var redis = require("redis");
const redisurl =process.env.REDIS_URL;
var client = redis.createClient({url:redisurl});
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('UP')
});
app.post('/add',function(req,res)
{
    if(req.headers["x-api-key"] === "somekey")
    {
    client.set("key",req.body.key);
    res.send("SCCESS")
    }
    else
    res.send({
        "error":true,
        "message":"Invalid Key"
    })
})
app.get("/getall",function(req,res){
     if(req.headers["x-api-key"] === "somekey")
    {
         client.get("key",function(err, reply){
            if(reply !=null)
             res.send(reply);
             else
             res.send("Error");
         });
    }
    else
    res.send({
        "error":true,
        "message":"Invalid Key"
    })
})
app.listen(process.env.PORT, () => console.log('Example app listening on port '+ process.env.PORT))