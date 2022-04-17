require('dotenv').config();
var mongodb = require('mongodb');  
var mongoose=require('mongoose');

var mongoClient = mongodb.MongoClient;  
var url = "mongodb://localhost:27017/BillGeneratorDB";  
  
mongoose.connect(url, function(err, databases) {  
      if (err)   
      {  
        throw err;  
      }  
    //   var nodetestDB = databases.db("BillGeneratorDB"); //here  
    //   var UserCollection = nodetestDB.collection("User");    
    //   var User = {_id:111, UserName:"admin" , Password:"admin"};  
        
    //   UserCollection.insertOne(User, function(error, response) {  
    //       if (error) {  
    //           throw error;  
    //       }  
        
    //       console.log("1 document inserted");  
    //       databases.close();  
    //   });  
});