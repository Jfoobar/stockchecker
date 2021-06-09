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
<<<<<<< HEAD
			console.log(response.data.symbol,response.data.latestPrice);
        const {symbol,latestPrice} = await response.data
        return {symbol,latestPrice}
=======
			  console.log(response.data.latestPrice);
        return {stock:response.data.symbol,price:response.data.latestPrice}
>>>>>>> 01d628b10b1cfc4f687b6ab9f7a8624f20b5e943
			} catch (error) {
				console.error(error.message)
        res.status(404).json({Msg:error.message, Details:`${stock} is not a valid stock symbol`})
			}
		}
	app.route('/api/stock-prices',).get(async (req,res) =>{
		const IP = req.ip;
    console.log(IP,req.query);
<<<<<<< HEAD
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
=======
    
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
    if(req.query.like)
    res.json({stockData})

    }else{
      const stockData = await getStock(req.query.stock,res);
>>>>>>> 01d628b10b1cfc4f687b6ab9f7a8624f20b5e943
      res.json({stockData})
    }
	})
};