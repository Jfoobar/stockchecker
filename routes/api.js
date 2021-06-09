'use strict';
const axios = require('axios').default;
const dbase = require('../dbase')
//console.log(dbase.findOneAndUpdateDB({
//ip:'1.1.1.4',stocks:[{stock:'msft',likes:1},{stock:'GOOG',likes:1}]}));

module.exports = function(app) {

  const getStock = async (stock,res) => {
			try {
				const response = await axios.get(
					`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
				);
			  console.log(response.data.latestPrice);
        const {symbol,latestPrice} = response.data
        return {stock:symbol,price:latestPrice}
			} catch (error) {
				console.error(error.message)
        res.status(404).json({Msg:error.message, Details:`${stock} is not a valid stock symbol`})
			}
		}
	app.route('/api/stock-prices',).get(async (req,res) =>{
		const IP = req.ip;
    console.log(IP,req.query);
    
    if (Array.isArray(req.query.stock)){
      const asyncLoop = async ()=>{
        let results = [];
        for(let stock of req.query.stock){
          let stockInfo = await getStock(stock)
          results.push(stockInfo)
        }
        return results;
    }
    const stockData = await asyncLoop();
    if(req.query.like) stockData.likes =  1; //not in json, todo
    res.json({stockData})
    console.log(stockData)

    }else{
      const stockData = await getStock(req.query.stock,res);
      res.json({stockData})
    }
	})
};