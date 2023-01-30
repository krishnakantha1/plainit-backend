const { isNullorUndefined, getUserFromJWT, basicErrorResponse } = require('./generalUtil')

const validateLoginData = (req,res,next)=>{
    const { email, password, jwt } = req.body

    if(!isNullorUndefined(jwt)){
        const data = getUserFromJWT(jwt)
        
        req.body.email = data.email
        req.body.password = data.password
        next()
    }else if(isNullorUndefined(email)) {
        basicErrorResponse(res,"email is empty")
    }else if(isNullorUndefined(password)){
        basicErrorResponse(res,"password is empty")
    }else{
        next()
    }   
}

module.exports = {
    validateLoginData
}