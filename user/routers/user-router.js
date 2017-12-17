var express = require('express');
var userRouter = express.Router();

var UserController = require('./../controllers/users-controller');

userRouter.route('/sign-up').post(UserController.userSignUp);
userRouter.route('/login').post(UserController.userLogin);
userRouter.route('/get').get(UserController.getUser);

module.exports = userRouter;