const express = require('express')
const { pool } = require('../db/pgPool')
const { validateCardsGetData, validateCardsCreateData, validateCardsDeleteData, validateCardsUpdateData } = require('../util/cardsUtil')
const { basicErrorResponse } = require('../util/generalUtil')

const CardRouter = express.Router()

CardRouter.post('/get-cards',validateCardsGetData, async (req,res)=>{
    const { chartid, userid } = req.body
    try{
        const resp = await pool.query('select * from todo_get_chart_cards($1,$2)',[userid, chartid])

        const retData = []

        for(let i=0;i<resp.rows.length;i++){
            const { d_card_id, d_title, d_description, d_x, d_y, d_child_card_id } = resp.rows[i]
            
            retData.push({ id : d_card_id, x : parseFloat(d_x), y : parseFloat(d_y), title : d_title, description : d_description, Parent_of : d_child_card_id })
        }
        
        res.json({
            error : false,
            data : retData
        })
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"error in getting cards.")
    }
})

CardRouter.post('/',validateCardsCreateData, async (req,res)=>{
    const { chartid, userid, cardid, title, description, x, y, parentid } = req.body
    try{
        const resp = await pool.query('CALL todo_create_card($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                                            [chartid, userid, cardid, title, description, parentid, x, y, false, ""])

        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                chartid,
                cardid,
                title,
                description,
                x,
                y,
                parentid
            })
        }
    }catch(e){
        basicErrorResponse(res,"error is creating cards.")
    }
})

CardRouter.delete('/',validateCardsDeleteData, async (req,res)=>{
    const { chartid, cardid, userid } = req.body
    try{
        const resp = await pool.query("CALL todo_delete_card($1,$2,$3,$4,$5)",[chartid, userid, cardid, false, ""])
        const { x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                chartid,
                cardid
            })
        }
    }catch(e){
        basicErrorResponse(res,"error in deleting cards.")
    }
})

CardRouter.put('/', validateCardsUpdateData, async (req,res)=>{
    const { chartid, userid, cardids, xs, ys } = req.body
    try{
        const resp = await pool.query('CALL todo_update_card_cords($1,$2,$3,$4,$5,$6,$7,$8)',[chartid, userid, cardids, xs, ys, -1, false, ''])
        const { x_count, x_err, x_err_msg } = resp.rows[0]
        if(x_err){
            basicErrorResponse(res,x_err_msg)
        }else{
            res.json({
                error : false,
                count : x_count,
                chartid
            })
        }
    }catch(e){
        console.log(e)
        basicErrorResponse(res,"error in updating cards.")
    }
})

module.exports = {
    CardRouter
}