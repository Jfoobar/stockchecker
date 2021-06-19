
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

const createEntry = async (ob)=>{
  try{
       Client.init();
       const client = new Client({ip:ob.ip,stocks:ob.stocks});
       const result = await client.save();
       return result;
  }catch (error){(error)=>console.log(`create error: ${error}`)};
}

const findOneAndUpdateDB = async (ob)=>{
  console.log(`this was passed:${JSON.stringify(ob.stocks)}\n`);
  try{
    const foundOne = await Client.findOne({ip:ob.ip}).exec();
      if(!foundOne){
       const newOne = await createEntry(ob);
       console.log(`new one: ${newOne}`);
       if(ob.stocks[0].likes && ob.stocks[0].likes===1){
         return 1;
       }else return 0;
     }
     else if(ob.stocks[0].likes && !foundOne.stocks
      .find((el)=>{if(el.stock===ob.stocks[0].stock)return el.hasOwnProperty('likes')})){

      console.log(`Found ${foundOne} that needs like`);
      //update
      foundOne.stocks.push(ob.stocks[0])//stock.likes = 1;
      foundOne.markModified('stocks');
      const updatedOne = await foundOne.save();
      console.log(`Updated: ${updatedOne}`);
      return 1;
     }
     else{
     console.log(`Found ${foundOne}`);
     if(foundOne.stocks
      .find((el)=>{if(el.stock===ob.stocks[0].stock)return el.hasOwnProperty('likes')})){
       console.log("already liked");
       return 1;
      }else return 0;
    }
    } catch (error) {console.log(error)};
 };

 module.exports = {findOneAndUpdateDB};