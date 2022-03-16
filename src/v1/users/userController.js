const userConstant = require('./userConstant');
const { userDao } = require('./userDao');
const bcrypt = require('bcrypt');
const SMS = require('../../../utils/sms');
const  jwt = require('jsonwebtoken')
/**
 * @function addTempUser
 * @description User Registration
 * @param { email,password,mobile } req.body
 * @author Ritik Parikh
 */
const addTempUser = async (req, res) => {
    try {
        const params = req.body;
        const checkEmail = await userDao.getByEmailAndMobile(params);
        console.log(checkEmail)
        if (checkEmail && checkEmail.length > 0 && checkEmail[0].isActive == 1) {
            if (checkEmail[0].email === params.email)
                res.status(400).json(userConstant.MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
            else res.status(400).json(userConstant.MESSAGES.ERROR.MOBILE_ALREADY_EXIST);
        }
        else if (checkEmail && checkEmail.length > 0 && checkEmail[0].isActive == 0) {
            params.password = await bcrypt.hash(params.password, 10);
            const sms = new SMS(req.body.mobile);
            params.otp = sms.otp;
            userDao.updateUser({ otp: sms.otp, mobile: params.mobile, name: params.name, email: params.email, password: params.password }, checkEmail[0].id);
            await sms.sendSMS(sms.mobile, `${sms.otp} is the OTP for your ${process.env.APP_NAME} account.`);
            res.status(200).json(Object.assign(userConstant.MESSAGES.SUCCESS.OTP_SEND, { data: { tempuser: checkEmail[0].id } }));
        }
        else {
            params.password = await bcrypt.hash(params.password, 10);
            const sms = new SMS(req.body.mobile);
            params.otp = sms.otp;
            let user = await userDao.signup(params);
            await sms.sendSMS(sms.mobile, `${sms.otp} is the OTP for your ${process.env.APP_NAME} account.`);
            res.status(200).json(Object.assign(userConstant.MESSAGES.SUCCESS.OTP_SEND, { data: { tempuser: user.insertId } }));
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};

/**
 * @function resendOTP
 * @description ReSend OTP
 * @param { mobile } req.body
 * @author Ritik Parikh
 */
const resendOTP = async (req, res) => {
    try {
        const User = await userDao.getByMobile({ mobile: req.body.mobile });
        if (User.length == 0) res.status(400).json(userConstant.MESSAGES.ERROR.USER_NOT_FOUND);
        else if (User[0].isDeleted) res.status(400).json(userConstant.MESSAGES.ERROR.USER_NOT_FOUND);
        else {
            const sms = new SMS(User[0].mobile);
            await userDao.updateUser({ otp: sms.otp }, User[0].id);
            const otpsent = await sms.sendSMS(
                sms.mobile,
                `${sms.otp} is the OTP for your ${process.env.APP_NAME} account. NEVER SHARE YOUR OTP WITH ANYONE.`
            );
            res.status(200).json(Object.assign(userConstant.MESSAGES.SUCCESS.OTP_SEND, {}));
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};


/**
 * @function 
 * @description Save User to registeruser and remove from temporry database
 * @param { tempuser,otp} req.body
 * @author Ritik Parikh
 */
const registerUser = async (req, res) => {
    try {
        const checkUser = await userDao.getUser({ id: req.body.tempuser, otp: req.body.otp, isDeleted: 0, isActive: 0 });
        if (checkUser.length == 0) res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.INVALID_OTP, {}));
        else {
            userDao.updateUser({ otp: '', isActive: 1 }, req.body.tempuser);
            res.status(200).json(Object.assign(userConstant.MESSAGES.SUCCESS.SIGNUP, {}));
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};

/**
 * @function 
 * @description Login
 * @param { email,password} req.body
 * @author Ritik Parikh
 */
const loginuser = async (req,res) => {
    try {
        const user = await userDao.getByEmail({ email: req.body.email });
        if (user.length == 0) {
            res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.INVALID_USER, { status: false, auth_key: 0, userid: 0 }));
        }
        else {
            if (user[0].isDeleted == 1) {
                res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.USER_DELETD, { status: false, auth_key: 0, userid: 0 }))
            }
            else {
                if (user[0].isActive == 0) {
                    res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.VERIFY, { status: false, auth_key: 0, userid: 0 }))
                }
                else {
                    // console.log()
                    if (!await bcrypt.compare(req.body.password, user[0].password)) {
                        res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.INVALID_USER, { status: false, auth_key: 0, userid: 0 }))
                    }
                    else {
                        const payload = {
                            id: user[0].id
                        };
                        const authKey = await jwt.sign(payload, process.env.JWT_SECRET);
                        res.status(200).json(Object.assign(userConstant.MESSAGES.SUCCESS.LOGIN, { auth_key: authKey }))
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};

/**
* @function changePassword
* @description User Change the password
* @param { newpassword,confirmpassword,oldpassword } req.body
* @author Ritik Parikh
*/
const changePassword = async (req,res) => {
    try {
        if (req.body.newpassword != req.body.confirmpassword) {
            res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.CONFIRM_PASSWORD_NOT_MATCH, { data: {} }));
        }
        else {
            const user = await userDao.getById({ id: req.user.id });
            console.log(req.user);
            if (user.length == 0) {
                res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.INVALID_USER, { data: {} }));
            }
            else {
                if (!await bcrypt.compare(req.body.oldpassword, user[0].password)) {
                    res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.INVALID_USER, { data: {} }));
                }
                else {
                    const password = await bcrypt.hash(req.body.newpassword, 10);
                    userDao.updateUser({ password: password }, req.user.id);
                    res.status(200).json(Object.assign({
                        "statusCode": 200,
                        "message": "Password Changed Successfully",
                    }, { data: {} }))
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};

/**
 * @function forgotPassword
 * @description Forgot the password for send OTP
 * @param {username} req.body and depend in this mobile and email both comes
 * @author Ritik Parikh
 */
const forgotPassword = async (req,res) => {
    try {
        const hasUser = await userDao.getByMobile({ mobile: req.body.mobile });
        if (hasUser.length == 0) {
            res.status(400).json(Object.assign({
                "statusCode": 400,
                "message": "You have entered invalid details to reset your password.",
            }, { data: {} }))
        }
        else {
            if (hasUser[0].isDeleted === 1) {
                res.status(400).json(Object.assign({
                    "statusCode": 400,
                    "message": "Sorry you cannot reset your password now. Please contact to administrator.",
                }, { data: {} }))
            }
            else {
                if (hasUser[0].mobile === req.body.mobile) {
                    const sms = new SMS(req.body.mobile);
                    userDao.updateUser({ otp: sms.otp }, hasUser[0].id);
                    await sms.sendSMS(
                        sms.mobile,
                        `${sms.otp} is the OTP for your ${process.env.APP_NAME} account. NEVER SHARE YOUR OTP WITH ANYONE.`
                    );
                    res.status(200).json(Object.assign({
                        "statusCode": 200,
                        "message": "OTP is send",
                    }, { data: {} }))
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};


/**
 * @function resetPassword
 * @description Reset the password of user
 * @param {password,token,otp} req.body 
 * @author Ritik Parikh
 */
const resetPassword = async (req,res) => {
    try {
        const checkUser = await userDao.getUserMobile({ mobile: req.body.mobile, otp: req.body.otp, isDeleted: 0, isActive: 1 });
        if (checkUser.length == 0) {
            res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.INVALID_OTP, {}));
        } else {
            const password = await bcrypt.hash(req.body.password, 10);
            userDao.updateUser({ password: password,otp:'' }, checkUser[0].id);
            res.status(200).json(Object.assign({
                "statusCode": 200,
                "message": "Password Changed Successfully",
            }, { data: {} }))
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};
/**
 * @function userFullDtails
 * @description User Full Deatils
 * @param { }
 * @author Ritik Parikh
 */
const userFullDetails = async (req,res) => {
    try {
        const user = await userDao.getById({ id: req.user.id });

        if (user.length == 0) {
            res.status(400).json(Object.assign(userConstant.MESSAGES.ERROR.USER_NOT_FOUND, {}));
        } else {
            res.status(200).json(Object.assign({
                "statusCode": 200,
                "message": "User Details",
            }, { data: user[0] }))
        };
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};


exports.userController = { addTempUser, registerUser, resendOTP, loginuser, changePassword, forgotPassword, resetPassword, userFullDetails };