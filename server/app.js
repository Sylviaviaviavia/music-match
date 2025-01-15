var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressGraphQL = require('express-graphql')
const postsRouter = require('./routes/posts.js'); 
const profileRouter = require('./routes/profile.js'); 
const gptIntroRouter = require('./routes/gptIntro.js'); 
const recommendationsRouter = require('./routes/recommendations')
const searchRouter = require('./routes/search')
const conversation = require('./routes/conversation');
const { schema } = require('./graphql/graphql'); // Adjust the path accordingly

var app = express();
const cors = require('cors');
require('dotenv').config();


// url = "https://musicmatch-5u08.onrender.com"

app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
    maxAge: 3600,
  })
);

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: false
}))


app.use('/api/posts/', postsRouter);
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