'use strict';
const axios = require('axios').default;
const dbase = require('../dbase')
//console.log(dbase.findOneAndUpdateDB({
//ip:'1.1.1.4',stocks:[{stock:'msft',likes:1},{stock:'GOOG',likes:1}]}));

module.exports = function(app) {
  const getStock = async (stock,res) => {
	  try {
			const response = await axios.get(
				`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
        const {symbol,latestPrice} = response.data
        return {stock:symbol,price:latestPrice}
		}catch (error) {
				console.error(error.message)
        res.status(404).json({Msg:error.message, Details:`${stock} is not a valid stock symbol`})
			}
		}
	app.route('/api/stock-prices',).get(async (req,res) =>{
		const IP = req.ip;
    const symbol = req.query.stock;
    console.log(`${IP} submited this:${req.query}`);
    
    if (Array.isArray(symbol)){
      const asyncLoop = async ()=>{
        let results = [];
        const arr = symbol;
        let tempArr = [];
        for(let x in arr){
          if (x>2)break;
          let stockInfo = await getStock(arr[x])
          results.push(stockInfo)
          if(req.query.like ==='true'){
          tempArr[x] = await dbase.findOneAndUpdateDB({ip:IP,stocks:
          {stock:arr[x].toUpperCase(),likes:1}})
          }else{
            tempArr[x] = await dbase.findOneAndUpdateDB({ip:IP,stocks:
              {stock:arr[x].toUpperCase()}})
          }
        }
        results[0].rel_likes = tempArr[0]-tempArr[1]
        results[1].rel_likes = tempArr[1]-tempArr[0]
        console.log(results)
        return results;
      }
      const stockData = await asyncLoop();
      res.json({stockData})
      console.log(stockData)
    }else{
      const stockData = await getStock(req.query.stock,res);
      if(req.query.like ==='true'){
        stockData.likes = await dbase.findOneAndUpdateDB({ip:IP,stocks:
        {stock:symbol.toUpperCase(),likes:1}});
      }else{
        stockData.likes = await dbase.findOneAndUpdateDB({ip:IP,stocks:
          {stock:symbol.toUpperCase()}})
      }
      res.json({stockData});
    }
	})
};