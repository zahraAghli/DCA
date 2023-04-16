const express =require('express');
const bodyParser =require('body-parser');
const TradeController = require('./../controllers/tradeController');
const tradeRouter = express.Router();
tradeRouter.use(bodyParser.json());
tradeRouter.get('/addOrder', TradeController.addOrder);
module.exports =tradeRouter;