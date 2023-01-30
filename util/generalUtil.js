const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

const basicErrorResponse = (res,message)=>{
    res.json({
        error : true,
        message
    }).send()
}

const isNullorUndefined = (obj)=>{
    if(obj==null || obj==undefined) return true
    return false
}

const createJWT = (data)=>{
    const userData = {
        userid : data.userid,
        username : data.username,
        email : data.email,
        password : data.password
    };
    let cJWT = jwt.sign(userData,process.env.PRIVATEKEY) 

    return cJWT 
}

const getUserFromJWT = (data)=>{
    return jwt.verify(data,process.env.PRIVATEKEY)
}

const MgetUserFromJWT = (req,res,next)=>{
    const { token } = req.body

    try{
        const userData = getUserFromJWT(token)
        req.body.email = userData.email
        req.body.password = userData.password
        next()
    }catch(e){
        basicErrorResponse(res,"token is not vaild.")
    }
}

const createIDWithPrefix = (pref,helperText)=>{
    const now = Date.now().toString()
    const space = 'aBcDeFgHij'
    const arr = []

    for(let i=0;i<now.length;i++){
        arr.push(space[now[i]])
    }

    return `${pref}_${helperText.split(" ").join("_")}_${arr.join('')}`
}

const createHashedPassword = async (pwd)=>{
    let hash = ""
    try{
        const salt = await bcryptjs.genSalt(10)
        hash = await bcryptjs.hash(pwd,salt)
    }catch(e){
        return ""
    }
    return hash
}

const verifyHashedPassword = async (pwd,hashedPwd)=>{
    try{
        const res = await bcryptjs.compare(pwd,hashedPwd)
        return res
    }catch(e){
        console.log(e)
        return false
    }
}

module.exports = {
    basicErrorResponse,
    isNullorUndefined,
    createJWT,
    getUserFromJWT,
    MgetUserFromJWT,
    createHashedPassword,
    verifyHashedPassword,
    createIDWithPrefix
}