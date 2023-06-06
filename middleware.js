//to be created later
const axios=require('axios')
const auth=(req,res,next)=>{
    delete req.headers.host

    next()
}
module.exports={auth}