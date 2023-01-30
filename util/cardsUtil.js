const { isNullorUndefined, basicErrorResponse, createIDWithPrefix, getUserFromJWT } = require("./generalUtil")

const validateCardsCreateData = (req,res,next)=>{
    const { chartid, title, description, x, y, jwt } = req.body

    if(isNullorUndefined(chartid)){
        basicErrorResponse(res,'chart id is missing')
    }else if(isNullorUndefined(jwt)){
        basicErrorResponse(res,'jwt id is missing')
    }else if(isNullorUndefined(title)){ 
        basicErrorResponse(res,'title is missing')
    }else if(isNullorUndefined(description)){   
        basicErrorResponse(res,'discription is missing')
    }else if(isNullorUndefined(x)){
        basicErrorResponse(res,'x cord is missing')
    }else if(isNullorUndefined(y)){
        basicErrorResponse(res,'y cord is missing')
    }else{
        req.body.cardid = createIDWithPrefix('CARD',title.substring(0,10))

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

const validateCardsGetData = (req,res,next)=>{
    const { chartid, jwt } = req.body

    if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt is empty")
    }else if(isNullorUndefined(chartid)){
        basicErrorResponse(res,"chart id is missing")
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

const validateCardsDeleteData = (req,res,next)=>{
    const { chartid, cardid, jwt } = req.body

    if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt is empty")
    }else if(isNullorUndefined(chartid)){
        basicErrorResponse(res,"chart id is empty")
    }else if(isNullorUndefined(cardid)){
        basicErrorResponse(res,"card id is empty")
    }else{
        //attach user id from jwt
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

const validateCardsUpdateData = (req,res,next)=>{
    const { chartid, jwt, cardids, xs, ys } = req.body
    if(isNullorUndefined(chartid)){
        basicErrorResponse(res,"chart id missing.")
    }else if(isNullorUndefined(jwt)){
        basicErrorResponse(res,"jwt missing.")
    }else if(isNullorUndefined(cardids)){
        basicErrorResponse(res,"card ids missing.")
    }else if(isNullorUndefined(xs)){
        basicErrorResponse(res,"x cords is missing.")
    }else if(isNullorUndefined(ys)){
        basicErrorResponse(res,"y cords is missing.")
    }else{
        try{
            req.body.userid = getUserFromJWT(jwt).userid 

            if(isNullorUndefined(req.body.userid)){
                throw 404
            }
            next()
        }catch(e){
            console.log(e)
            basicErrorResponse(res,"problem in unpacking jwt.")
        }
    }
}

module.exports = {
    validateCardsCreateData,
    validateCardsGetData,
    validateCardsDeleteData,
    validateCardsUpdateData
}