var supertest = require("supertest");
var should = require("should");
var env = process.env.NODE_ENV || "development"
var host = "https://uat.mydiaries.cf";
var port =  443

var server = supertest.agent(host);

describe("Test if "+host+" is UP",function(){
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
