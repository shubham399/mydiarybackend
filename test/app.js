var supertest = require("supertest");
var should = require("should");
var env = process.env.NODE_ENV || "development"
var host = require("../config/config")[env].host;
var port = process.env.PORT || 80

var server = supertest.agent(host+":"+port);

describe("Test if Server is UP",function(){
   it("checking correct input",function(done){
    server
    .get('/')
    // .expect("Content-type",/text/)
    .expect(200, done);
  });
});

// describe("Test if Server is UP",function(){
//   it("checking correct input",function(done){
//     server
//     .get('/')
//     // .expect("Content-type",/text/)
//     .expect(200, done);
//   });
// });
