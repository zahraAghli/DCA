const express =require('express');
const bodyParser =require('body-parser');
const MarketController = require('./../controllers/marketController');
const marketRouter = express.Router();
marketRouter.use(bodyParser.json());
marketRouter.get('/getList', MarketController.getList);
marketRouter.get('/getHistory', MarketController.getHistory);
marketRouter.get('/history', MarketController.history);
module.exports =marketRouter;