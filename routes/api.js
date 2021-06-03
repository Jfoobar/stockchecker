'use strict';
const axios = require('axios').default;
const dbase = require('../dbase')
//console.log(dbase.findOneAndUpdateDB({ip:'1.1.1.4',stocks:[{stock:'msft',likes:1},{stock:'GOOG',likes:1}]}));

module.exports = function(app) {

  const getStock = async (stock, like,res) => {
			try {
				const response = await axios.get(
					`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
				);
			console.log(response.data.latestPrice);
        return {stock:response.data.symbol,price:response.data.latestPrice, like}
			} catch (error) {
				console.error(error.message)
        res.status(404).json({Msg:error.message, Details:`${stock} is not a valid stock symbol`})
			}
		}
	app.route('/api/stock-prices',).get(async (req,res) =>{
		const IP = req.ip;
    console.log(IP,req.query);
    
    if (Array.isArray(req.query.stock)){
      let results = [];
      req.query.stock.forEach(async(stock,i,arr)=>{
        results.push(await getStock(stock,req.query.like,res))
        if(i === arr.length-1 || i > 4)res.json(results)
      })
    //   try{
    //  (async(results)=>console.log(await results))();
    //   }catch(err) {console.log(err)}
    }else{
    const stockData = await getStock(req.query.stock,req.query.like,res);
      res.json({stockData})
    }
	})
};