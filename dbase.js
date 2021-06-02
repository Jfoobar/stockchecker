
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => console.log("connected to DB"))
.catch((err)=>console.log(err));

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    ip:String,
    stocks:Schema.Types.Mixed
  });

let Client = mongoose.model("Client",clientSchema);

const createEntry = (ip,stocks)=>{
       Client.init()
       const client = new Client(ip,stocks)
       client.save()
       .then((result)=> console.log(result))
       .catch((err)=>console.log(err));
}

const findOneAndUpdateDB = (ip,stocks)=>{
   Client.findOne(ip,(err,foundOne)=>{
     if(!foundOne){
       createEntry(ip,stocks);
     }else{
     if(err) {return console.log(err)}
     }
   }).then((result)=>console.log(`Found ${result}`))
     .catch((err)=>console.log(err))
 };

 module.exports = {findOneAndUpdateDB}