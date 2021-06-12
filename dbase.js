
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
  }catch (error){(error)=>console.log(error)};
}

const findOneAndUpdateDB = async (ip,stocks)=>{
  try{
    const foundOne = await Client.findOne(ip).exec();
      if(!foundOne){
       const newOne = await createEntry(ip,stocks);
       if(newOne.stocks.likes && newOne.stocks.likes===1){
         return 1;
       }else return 0;
     }else{
     console.log(`Found ${foundOne}`);
     if(foundOne.stocks.likes){
       console.log("already liked");
       return 1;
     } else return 0;
    }
    } catch (error) {console.log(error)};
 };

 module.exports = {findOneAndUpdateDB};