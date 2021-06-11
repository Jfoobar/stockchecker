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
        const arr = req.query.stock
        for(let stock in arr){
          let stockInfo = await getStock(arr[stock])
          results.push(stockInfo)
          if(req.query.like)results[stock].likes = 1
        }
        return results;
    }
    const stockData = await asyncLoop();
    res.json({stockData})
    console.log(stockData)

    }else{
      const stockData = await getStock(req.query.stock,res);
      res.json({stockData})
    }
	})
};