const { isNullorUndefined, basicErrorResponse, getUserFromJWT } = require("./generalUtil")

const validateLinkCreateAndDeleteData = (req,res,next)=>{
    const { chartid,parentid,childid,jwt } = req.body

    if(isNullorUndefined(chartid)){
        basicErrorResponse(res,"chart id is missing")
    }else if(isNullorUndefined(parentid)){
        basicErrorResponse(res,"parent id is missing")
    }else if(isNullorUndefined(childid)){
        basicErrorResponse(res,"child id is missing")
    }else if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt is missing")
    }else{
        try{
            req.body.userid = getUserFromJWT(jwt).userid

            if(isNullorUndefined(req.body.userid)){
                throw 404
            }
            next()
        }catch(e){
            console.log(e)
            basicErrorResponse(res,"couldnt unpack jwt")
            return
        }
    }
}

module.exports = {
    validateLinkCreateAndDeleteData
}