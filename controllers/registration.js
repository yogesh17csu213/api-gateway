const registry = require('../routes/registry.json')
const fs = require('fs')
const {apiAlreadyExists} = require('../helpers')

const register=(req,res)=>{
    const registrationInfo = req.body
    if( apiAlreadyExists(registrationInfo)){
        res.send('Configuration already exists for '+registrationInfo.name)
    }else{
        let uniqueNameValidate=false
        let multipleApi = []
        for (let i in registrationInfo?.multipleApi){
            console.log(multipleApi)
            if (!(multipleApi.includes(registrationInfo.multipleApi[i]?.name))){
                multipleApi.push(registrationInfo.multipleApi[i]?.name)
            }
            else{
                uniqueNameValidate=true
                break
            }
        }
        if(uniqueNameValidate){
            res.send('Api Names must be unique ')
        }else{
            registry.services.push({...registrationInfo})
            fs.writeFile('./routes/registry.json',JSON.stringify(registry),(error)=>{
                if(error){
                    res.send('could not register'+ registrationInfo.name+ '\n' + error)
                }else{
                    res.send('successfully registered '+registrationInfo.name)
                }
            })
        }  
    }
}

const unregister = (req,res)=>{
    const registrationInfo=req.body
    if( apiAlreadyExists(registrationInfo)){
        let index=registry.services.findIndex(obj=>obj.name==registrationInfo.name)
        registry.services.splice(index,1)
        fs.writeFile('./routes/registry.json',JSON.stringify(registry),(error)=>{
            if(error){
                res.send('could not unregister'+ registrationInfo.name+ '\n' + error)
            }else{
                res.send('successfully unregistered '+registrationInfo.name)
            }
        })
    }else{
        res.send('Configuration does not exists for '+registrationInfo.name)
    }
}

module.exports={register,unregister}