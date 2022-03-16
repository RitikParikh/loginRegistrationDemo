//Requring Packages
const express = require('express');

const {auth,checkKey} = require('../../../utils/auth').auth;

//Required files
const { validate } = require('../../../utils/UniversalResponse');
const userValidation = require('./userValidations');
const  {userController}  = require('./userController');
const userRoutes = express.Router();

/**
 *  @author Ritik Parikh
 *  @description Starts the user controller
 */

//User Registration
  userRoutes.post('/registerTempUser',checkKey, validate(userValidation.registerTempUser), userController.addTempUser);
  userRoutes.post('/resendOTP',checkKey, validate(userValidation.resendOTP), userController.resendOTP);
  userRoutes.post('/register',checkKey, validate(userValidation.registerUser), userController.registerUser);
  userRoutes.post('/login',checkKey, validate(userValidation.loginuser), userController.loginuser);
  userRoutes.post('/forgotPassword',checkKey, validate(userValidation.forgotPassword), userController.forgotPassword);
  userRoutes.post('/resetPassword',checkKey, validate(userValidation.resetPassword), userController.resetPassword);
  userRoutes.post('/changePassword',checkKey,auth, validate(userValidation.changePassword), userController.changePassword);
  userRoutes.get('/get-profile',checkKey,auth, userController.userFullDetails);

exports.routes = userRoutes;