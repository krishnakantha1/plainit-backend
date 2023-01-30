const express = require('express')
const { pool } = require('../db/pgPool')
const { basicErrorResponse, createJWT } = require('../util/generalUtil')
const { validateRegisterData, populatePasswordHash } = require('../util/registerUserUtil')

const registerRouter = express.Router()

registerRouter.post('/',validateRegisterData,populatePasswordHash, async (req,res)=>{
    const { user_id, username, email, password, hash } = req.body

    try{
        const resp = await pool.query("CALL todo_create_user($1,$2,$3,$4,$5,$6)",[user_id,username,email,hash,false,""])
        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            const jwt = createJWT({ userid : user_id, username, email, password })
            res.json({
                error : false,
                username,
                jwt
            })
        }
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"server issue, please try later.")
    }
})

module.exports = {
    registerRouter
}