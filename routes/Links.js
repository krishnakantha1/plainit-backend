const express = require('express')
const { pool } = require('../db/pgPool')
const { basicErrorResponse } = require('../util/generalUtil')
const { validateLinkCreateAndDeleteData } = require('../util/linsksUtil')

const LinkRouter = express.Router()

LinkRouter.post('/',validateLinkCreateAndDeleteData, async (req,res)=>{
    const { chartid, userid, parentid, childid } = req.body
    try{
        const resp = await pool.query('CALL todo_create_card_link($1,$2,$3,$4,$5,$6)',[chartid, userid, parentid, childid, false, ""])

        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                chartid,
                parentid,
                childid
            })
        }

    }catch(e){
        console.log(e)
        basicErrorResponse(res,"server error link delete")
    }
})

LinkRouter.delete('/',validateLinkCreateAndDeleteData, async (req,res)=>{
    const { chartid, userid, parentid, childid  } = req.body
    try{
        const resp = await pool.query('CALL todo_delete_card_link($1,$2,$3,$4,$5,$6)',[chartid, userid, parentid, childid, false, ""])
        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                chartid,
                parentid,
                childid
            })
        }
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"server error link delete")
    }
})

module.exports = {
    LinkRouter
}