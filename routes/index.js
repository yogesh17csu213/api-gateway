const express = require('express')
const router = express.Router()
const axios = require('axios')
const registration = require('../controllers/registration')
const {servicesApi} = require('../controllers')
const client = require('../helpers/init_redis')

axios.defaults.headers.common['x-api-key'] ='xeJJzhaj1mQ-ksTB_nF_iH0z5YdG50yQtwQCzbcHuKA'
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const cache = (req, res, next) => {
  if( req.body?.no_cache==true || req.query?.no_cache==true  ){
    return next();
  }else{
    client.get(req.url, (error, result) => {
      if (error) throw error;
      if (result !== null) {
        return res.json(JSON.parse(result));
      } else {
        return next();
      }
    });
  }
};

router.post('/register',(req,res)=>registration.register(req,res))
router.post('/unregister',(req,res)=>registration.unregister(req,res))
router.all('/*',cache,async (req,res,next)=>servicesApi(req,res,next))


  
module.exports=router