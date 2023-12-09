var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressGraphQL = require('express-graphql');
const cors = require('cors');
require('dotenv').config();

var postsRouter = require('./routes/posts.js');
const profileRouter = require('./routes/profile.js'); 
const gptIntroRouter = require('./routes/gptIntro.js'); 
const recommendationsRouter = require('./routes/recommendations')
const searchRouter = require('./routes/search')
const conversation = require('./routes/conversation');
const { schema } = require('./graphql/graphql');

var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.VITE_FRONTEND_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.sendStatus(200);
  } else {
    next();
  }
});
var corsOptions = {
  origin: process.env.VITE_FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE,PATCH, OPTIONS",
  credentials: true,
  maxAge: 3600,
};

app.use(cors(corsOptions)); // Use CORS with your options

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from 'public' if you have a frontend there
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/posts/', postsRouter);

var url = process.env.VITE_FRONTEND_URL;

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: false
}))

app.use('/', profileRouter);
app.use('/', gptIntroRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/search', searchRouter);
app.use('/', conversation);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Set the status code
  res.status(err.status || 500);

  // Send a JSON response or a simple message
  res.json({
    message: 'An error occurred',
    error: err.message // Or any other error information you wish to send
  }); 
});

module.exports = app;