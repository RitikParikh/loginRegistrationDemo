const  jwt = require('jsonwebtoken');
const auth = async (req,res,next) => {
  try {
          const user = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
          req.user = user;
          next();
  } catch (error) {
    res.status(400).send('You cannot access this page');
  }
};
const checkKey = async (req,res,next) => {
    try {
        if(req.headers.key === 'checkValue'){
            next();
        }
        else{
            res.status(400).send('You cannot access this page');   
        }
    } catch (error) {
      res.status(400).send('You cannot access this page');
    }
  };
exports.auth = {checkKey,auth};