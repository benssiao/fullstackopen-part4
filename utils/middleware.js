const logger = require("./logger")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }

async function userExtractor(req, res, next) {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken) {
        response.status(401).json({error: "token invalid"});
    }
    req.user = await User.findById(decodedToken.id);
    return next();
  }

  catch(e) {
    next(e);
  }
}
function tokenExtractor(req, res, next) {
  try {
    const auth = req.get("Authorization");
    if (!auth || !auth.startsWith("Bearer ") ) {
        req.token = null;
        return next();
    }
    req.token = auth.replace("Bearer ", "");
    return next();
  }
  catch(e) {
    return next(e);
  }
}
function unknownEndpoint(req, res) {
    res.status(404).send({error: "unknown endpoint"})
}

function errorHandler(error, req, res, next) {
    logger.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) {
    return res.status(400).json({error: "expected `username` to be unique"})
  }
 else if (error.name ===  'JsonWebTokenError') {
  return res.status(401).json({ error: 'token invalid'})
}
else if (error.name === 'TokenExpiredError') {
  return res.status(401).json({
    error: 'token expired'
  })
}

next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
  }