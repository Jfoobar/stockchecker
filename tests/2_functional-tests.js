const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', ()=> {
    suite("5 functional req tests", () => {
        test("View one stock: GET request to /api/stock-prices/", (done)=> {
          chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: "BYND" })
            .end( (err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.stockData.stock, "BYND");
              assert.exists(res.body.stockData.price, "BYND price exists");
              done();
            });
        });
        test("View one stock and liking it: GET request to /api/stock-prices/", (done) => {
          chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: "JOE", like: true })
            .end((err, res)=>{
              assert.equal(res.status, 200);
              assert.equal(res.body.stockData.stock, "JOE");
              assert.equal(res.body.stockData.likes, 1);
              assert.exists(res.body.stockData.price, "JOE price exists");
              done();
            });
        });
        test("View the same stock and liking it again: GET request to /api/stock-prices/", (done) => {
          chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: "JOE", like: true })
            .end((err, res)=>{
              assert.equal(res.status, 200);
              assert.equal(res.body.stockData.stock, "JOE");
              assert.equal(res.body.stockData.likes, 1);
              assert.exists(res.body.stockData.price, "JOE price exists");
              done();
            });
        });
        test("View two stocks: GET request to /api/stock-prices/", (done) => {
          chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: ["MDB", "DELL"] })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.stockData[0].stock, "MDB");
              assert.equal(res.body.stockData[1].stock, "DELL");
              assert.exists(res.body.stockData[0].price, "MDB price exists");
              assert.exists(res.body.stockData[1].price, "DELL exists");
              done();
            });
        });
        test("View two stocks and liking them: GET request to /api/stock-prices/", (done) => {
          chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: ["MDB", "DELL"], like: true })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.stockData[0].stock, "MDB");
              assert.equal(res.body.stockData[1].stock, "DELL");
              assert.exists(res.body.stockData[0].price, "MDB price exists");
              assert.exists(res.body.stockData[1].price, "DELL exists");
              assert.exists(res.body.stockData[0].rel_likes, "rel_likes present");
              assert.exists(res.body.stockData[1].rel_likes, "rel_likes present");
              done();
            });
        });
      });
});
