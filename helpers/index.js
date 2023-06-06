const registry = require('../routes/registry.json')

const apiAlreadyExists=(registrationInfo)=>{
    const service=registry.services.find(obj=>{
        if(obj.name==registrationInfo.name){
            return obj
        }
        if(obj.endpoint==registrationInfo.endpoint){
            return obj
        }
    })
    if(service){
        return true
    }else{
        return false
    }
}

module.exports={apiAlreadyExists}