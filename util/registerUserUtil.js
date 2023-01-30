const { isNullorUndefined, createIDWithPrefix, createHashedPassword, basicErrorResponse } = require('./generalUtil')

const validateRegisterData = (req,res,next)=>{
    const { email,username,password } = req.body

    if(isNullorUndefined(email)) {
        basicErrorResponse(res,"email is empty")
    }else if(isNullorUndefined(username)){
        basicErrorResponse(res,"username is empty")
    }else if(isNullorUndefined(password)){
        basicErrorResponse(res,"password is empty")
    }else{
        req.body.user_id = createIDWithPrefix("USER",username)
        next()
    }   
}

const populatePasswordHash = async (req,res,next)=>{
    const { password } = req.body
    const hash = await createHashedPassword(password)

    if(hash ===""){
        basicErrorResponse(res,"couldnt create secure password.")
    }else{
        req.body.hash = hash
        next()
    }
}

module.exports = {
    validateRegisterData,
    populatePasswordHash
}