const express = require('express')

const { pool } = require('../db/pgPool.js')
const { basicErrorResponse, verifyHashedPassword, createJWT } = require('../util/generalUtil.js')

const { validateLoginData } = require('../util/loginUtil.js')

const loginRouter = express.Router()

loginRouter.post('/', validateLoginData, async (req,res)=>{
    const { email,password } = req.body
    try{
        const resp = await pool.query("select * from todo_get_password($1)",[email])

        if(resp.rows.length===0){
            basicErrorResponse(res,"username or password is wrong")
            return
        }

        const { d_user_id,d_username, d_email, d_password } = resp.rows[0]

        const passwordVerified = verifyHashedPassword(password,d_password)
        
        if(passwordVerified){
            const jwt = createJWT({ userid : d_user_id, username : d_username, email : d_email, password })
            res.json({
                error : false,
                username : d_username,
                jwt
            })
        }else{
            basicErrorResponse(res,"username or password is wrong")
        }
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"server error while login.")
    }
})

module.exports = {
    loginRouter
}