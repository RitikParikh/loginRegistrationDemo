const getMessageFromJoiError = (error) => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message
    ? `${error.details[0].message}`
    : undefined;
};

exports.validate = (schema) => async (req,res,next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = getMessageFromJoiError(error);
      return res.status(err.statusCode || 400).json({"status":400,"message":err,"data":""});
    }
    next();
};

