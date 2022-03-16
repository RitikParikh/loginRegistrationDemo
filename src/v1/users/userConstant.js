exports.MESSAGES = {
    ERROR: {
        EMAIL_ALREADY_EXIST: {
            "statusCode": 400,
            "message": "This email is taken, try another one",
        },
        MOBILE_ALREADY_EXIST: {
            "statusCode": 400,
            "message": "This mobile is taken, try another one",
        },
       USER_NOT_FOUND: {
            "statusCode": 400,
            "message": "This user not found",
        },
        USER_DELETD: {
            "statusCode": 400,
            "message": "your account has been blocked",
        },
        INVALID_OTP: {
            "statusCode": 400,
            "message": "Invalid OTP",
        },
        INVALID_USER: {
            "statusCode": 400,
            "message": "Invalid username or Password",
        },
        PASSWORD_NOT_MATCH: {
            "statusCode": 400,
            "message": "Old password does not matched to previous password.",
        },
        CONFIRM_PASSWORD_NOT_MATCH: {
            "statusCode": 400,
            "message": "Confirm password and new password are not matched.",
        },

        VERIFY:{
            "statusCode": 400,
            "message": "Please Verify account first.",
        }
    },
    SUCCESS: {
        SIGNUP: {
            "statusCode": 200,
            "message": "You have successfully registered!",
            "type": "SIGNUP"
        },
        OTP_SEND: {
            "statusCode": 200,
            "message": "OTP is Sent to youe mobile number!",
            "type": "OTP"
        },
        OTP_SEND: {
            "statusCode": 200,
            "message": "OTP is SEND!",
            "type": "OTP"
        },
        LOGIN: {
            "statusCode": 200,
            "message": "SuccesFull LOgin!",
            "type": "OTP"
        },
    }
};