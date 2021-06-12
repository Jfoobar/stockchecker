
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

const createEntry = async (ip,stocks)=>{
  try{
       Client.init();
       const client = new Client(ip,stocks);
       const result = await client.save()
       console.log(result)
  }catch{(err)=>console.log(err)};
}

const findOneAndUpdateDB = async (ip,stocks)=>{
  try{
    const foundOne = await Client.findOne(ip).exec();
      if(!foundOne){
       createEntry(ip,stocks);
     }else{
     console.log(`Found ${foundOne}`);
     //like logic
     if(foundOne.stocks.likes){
       console.log("already liked");
       return 1;
     }else return 0;
    }
    } catch{console.log(err)};
 };

 module.exports = {findOneAndUpdateDB};