const Joi = require('@hapi/joi');
require('joi-extract-type');

exports.registerTempUser = Joi.object().keys({
        email: Joi.string().optional(),
        password: Joi.string().required(),
        mobile: Joi.string().required(),
        name: Joi.string().required(),
}).unknown(false);

exports.resendOTP = Joi.object().keys({
        mobile: Joi.string().required(),
}).unknown(false);


exports.registerUser = Joi.object().keys({
        tempuser: Joi.number().required(),
        otp: Joi.string().required(),
}).unknown(false);


exports.loginuser = Joi.object().keys({
        email: Joi.string().optional(),
        password: Joi.string().required()
}).unknown(false);


exports.changePassword = Joi.object().keys({
        newpassword: Joi.string().optional(),
        confirmpassword: Joi.string().required(),
        oldpassword: Joi.string().required()
}).unknown(false);

exports.forgotPassword = Joi.object().keys({
        mobile: Joi.string().required(),
}).unknown(false);

exports.resetPassword = Joi.object().keys({
        otp: Joi.string().optional(),
        mobile: Joi.string().required(),
        password: Joi.string().required(),
}).unknown(false);
