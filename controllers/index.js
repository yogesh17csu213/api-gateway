const registry = require('../routes/registry.json')
const axios = require('axios')
const client = require('../helpers/init_redis')
const circuitBreaker = require('opossum')

const servicesApi = async (req,res,next)=>{
    const breaker = new circuitBreaker(Promise.allSettled,{
        timeout:10000,
        errorThresholdPercentage:50,
        resetTimeout:5000
    })

    const service=registry?.services?.find(obj=>{
        if(obj.endpoint==req.path){
            return obj
        }
    })

    breaker.fallback((errors)=>(console.log('errors on fallback',   '.......   ',errors)))
    breaker.on('timeout',()=>console.log('timeout error'))
    breaker.on('reject',()=>console.log('reject error'))
    breaker.on('open',()=>console.log('open error'))
    breaker.on('half open',()=>console.log('half open error'))
    breaker.on('close',()=>console.log('close error'))
    breaker.on('fallback',()=>console.log('fallback error'))

    if(service){ 
        let apiCalls=[]
        let combinedResoponse={}
        combinedResoponse.success={}
        combinedResoponse.failure={}
        for(let i in service.multipleApi){
            let data=req.body?.data?.find((obj)=>{
                if(obj.name===service?.multipleApi[i]?.name){
                    return obj
                }
            })
            
           apiCalls.push(
            axios({
                name:service?.multipleApi[i]?.name,
                method: service?.multipleApi[i]?.method,
                url:service?.multipleApi[i]?.host+service?.multipleApi[i]?.endpoint,
                params:data?.params,
                data:data?.body,
                // headers: {...req.headers,
                //     'Content-Type': 'multipart/form-data'
                //   }
            })); 

        }

        // return breaker.fire(apiCalls).then((responses)=>{
        //     responses.forEach((res,index)=>{
        //         if(res.status=='fulfilled'){
        //             combinedResoponse.success[res.value?.config?.name]=res.value.data
        //         }
        //         else{
        //             combinedResoponse.failure[res.reason.config.name]=res.reason
        //         }
        //     })
        //     // if(service.useCaching){
        //     //     client.set(req.url, JSON.stringify(combinedResoponse), 'EX',300)
        //     // }
        //     res.send(combinedResoponse)
        // }).catch(errors => {
        //     console.log(errors)
        //     res.send(errors)
        // })
        try {
            let responses= await Promise.allSettled(apiCalls)
            responses.forEach((res,index)=>{
                    if(res.status=='fulfilled'){
                        combinedResoponse.success[res.value.config.name]=res.value.data
                    }
                    else{
                        combinedResoponse.failure[res.reason.config.name]=res.reason
                    }
                })
          } catch {
            console.log('error')
            res.send('API issue')
            }
         if(service?.useCaching && (Object.keys(combinedResoponse?.failure).length === 0)){
                client.set(req?.url, JSON.stringify(combinedResoponse), 'EX',300)
            }
        res.send(combinedResoponse)
    }else{
        res.send('API Name does not exist')
    }
}


module.exports={servicesApi}