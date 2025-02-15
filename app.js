const config = require("./utils/config")
const logger = require("./utils/logger")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
//connections
const blogsRouter = require("./connections/blogs")
const usersRouter = require("./connections/users")
const loginRouter = require("./connections/login")
//middleware
const middleware = require("./utils/middleware")

const app = express();

mongoose.set("strictQuery", false);
logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
    logger.error('error connecting to MongoDB:', error.message);
  })

//preload middleware
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
//connection middleware
app.use("/api/blogs", blogsRouter);

app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter)


// error and catch all middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;