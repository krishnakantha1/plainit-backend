const express = require('express')
const { pool } = require('../db/pgPool')
const { basicErrorResponse } = require('../util/generalUtil')
const { validateLinkChartData, validateLinkChartDeleteData, vaildateLinkChartGetData } = require('../util/linkchartUtil')

const LinkChartRouter = express.Router()

LinkChartRouter.post('/get-chart',vaildateLinkChartGetData, async (req,res)=>{
    const { userid } = req.body
    try{
        const resp = await pool.query("select * from todo_get_my_charts($1)",[userid])

        const data = []

        for(let i=0;i<resp.rows.length;i++){
            const { d_chart_id, d_chart_name, d_create_date } = resp.rows[i]
            data.push({ 
                chart_id : d_chart_id,
                chart_name : d_chart_name,
                chart_creation_date : d_create_date
             })
        }

        
        res.json({
            error : false,
            data
        })
        
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"couldnt get chart")
    }
})

LinkChartRouter.post('/', validateLinkChartData, async (req,res)=>{
    const { chartid, chartname, userid } = req.body
    try{
        const resp = await pool.query("CALL todo_create_chart($1,$2,$3,$4,$5)",[chartid, chartname, userid, false, ""])
        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                chartid : chartid,
                chartname : chartname
            })
        }
    }catch(e){  
        console.log(e)
        basicErrorResponse(res,"server error")
    }
})

LinkChartRouter.delete('/',validateLinkChartDeleteData, async (req,res)=>{
    const { chartid, userid } = req.body
    try{
        const resp = await pool.query("CALL todo_delete_chart($1,$2,$3,$4)",[chartid, userid, false, ""])
        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                chartid : chartid
            })
        }
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"server error during delete chart")
    }
})

module.exports = {
    LinkChartRouter
}