const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
require('./helpers/init_redis')
const PORT = 4040
const helmet=require('helmet')
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes')
const {auth} = require('./middleware')
// const rateLimit = require('express-rate-limit')
const slowDown = require("express-slow-down");

const speedLimiter = slowDown({
  windowMs: 1, // 15 minutes
  delayAfter: 100000, // allow 100 requests per 15 minutes, then...
  delayMs: 10 // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

const app=express();
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

// app.set('trust proxy', 1);
app.use(express.json())
app.use(bodyParser.json());

// const limiter = rateLimit({
// 	windowMs: 1000, //1 second
// 	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })

app.use(cors())
app.use(helmet())
// app.use(limiter)
app.use(speedLimiter);

app.use(auth)
app.use(morgan('combined'));
app.use('/',routes)

app.listen(PORT,()=>{
    console.log('Gateway has started on port :'+PORT)
})