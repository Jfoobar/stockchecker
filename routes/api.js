'use strict';
const axios = require('axios').default;
const dbase = require('../dbase')
//console.log(dbase.findOneAndUpdateDB({ip:'1.1.1.4',stocks:[{stock:'msft',likes:1},{stock:'GOOG',likes:1}]}));

module.exports = function(app) {

  const getStock = async (stock,res) => {
			try {
				const response = await axios.get(
					`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
				);
			console.log(response.data.symbol,response.data.latestPrice);
        const {symbol,latestPrice} = await response.data
        return {symbol,latestPrice}
			} catch (error) {
				console.error(error.message)
        res.status(404).json({Msg:error.message, Details:`${stock} is not a valid stock symbol`})
			}
		}
	app.route('/api/stock-prices',).get(async (req,res) =>{
		const IP = req.ip;
    console.log(IP,req.query);
    let stockArr = {}
      
    if(Array.isArray(req.query.stock)){
     for(let i=0;i<req.query.stock.length,i++;){
     stockArr.push(await getStock(req.query.stock[i],res))
     console.log(stockArr)
     }
    }
    else{
    const stockData = await getStock(req.query.stock,res);
      stockData.likes = req.query.like
      res.json({stockData})
    }
	})
};