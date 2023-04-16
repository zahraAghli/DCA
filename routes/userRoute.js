const express =require('express');
const bodyParser =require('body-parser');
const userController = require('./../controllers/userController');
const userRouter = express.Router();
userRouter.use(bodyParser.json());
userRouter.post('/register', userController.register);
module.exports = userRouter;
