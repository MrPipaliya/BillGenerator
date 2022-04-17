var mongoose = require('mongoose');
require('dotenv').config();
// connect mongoose
// mongoose.connect(process.env.DBURL,
//     {
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true
//     }
// ).then(()=>{
//     console.log('successful');
// }).catch((err)=>console.log('unsuccessful'));

//mongoose.connect(process.env.DBURL);

mongoose.connect('mongodb://Yagnik:FST75ebHF5N0lTFy@cluster0-shard-00-00.ppmrs.mongodb.net:27017,cluster0-shard-00-01.ppmrs.mongodb.net:27017,cluster0-shard-00-02.ppmrs.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-6p42f8-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true});//mongodb://localhost:27017/BillGeneratorDB
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;