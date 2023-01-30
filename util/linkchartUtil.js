const { isNullorUndefined, createIDWithPrefix, basicErrorResponse, getUserFromJWT } = require('./generalUtil')

const vaildateLinkChartGetData = (req,res,next)=>{
    const { jwt } = req.body

    if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt is empty")
    }else{
        try{
            req.body.userid = getUserFromJWT(jwt).userid

            if(isNullorUndefined(req.body.userid)){
                throw 404
            }
        }catch(e){
            console.log(e)
            basicErrorResponse(res,"couldnt unpack jwt")
            return
        }
        next()
    }
}

const validateLinkChartData = (req,res,next)=>{
    const { chartname, jwt } = req.body

    if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt is empty")
    }else if(isNullorUndefined(chartname)){
        basicErrorResponse(res,"card name is empty")
    }else{
        //create card id
        req.body.chartid = createIDWithPrefix("CHART",chartname)
        //attach user id from jwt
        try{
            req.body.userid = getUserFromJWT(jwt).userid

            if(isNullorUndefined(req.body.userid)){
                throw 404
            }
        }catch(e){
            console.log(e)
            basicErrorResponse(res,"couldnt unpack jwt")
            return
        }
        next()
    }
}

const validateLinkChartDeleteData = (req,res,next)=>{
    const { chartid, jwt } = req.body

    if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt is empty")
    }else if(isNullorUndefined(chartid)){
        basicErrorResponse(res,"card id is empty")
    }else{
        //attach user id from jwt
        try{
            req.body.userid = getUserFromJWT(jwt).userid

            if(isNullorUndefined(req.body.userid)){
                throw 404
            }
        }catch(e){
            console.log(e)
            basicErrorResponse(res,"couldnt unpack jwt")
            return
        }
        next()
    }
}

module.exports = {
    validateLinkChartData,
    validateLinkChartDeleteData,
    vaildateLinkChartGetData
}