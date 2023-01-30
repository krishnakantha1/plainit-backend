const express = require('express')
const cors = require('cors')

require('dotenv').config()

const { loginRouter } = require('./routes/Login')
const { registerRouter } = require('./routes/RegisterUser')
const { LinkChartRouter } = require('./routes/LinkChart')
const { CardRouter } = require('./routes/Cards')
const { LinkRouter } = require('./routes/Links')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/test',(req,res)=>{
    res.json({
        status : "up and running",
    })
})

app.use('/api/login',loginRouter)
app.use('/api/register',registerRouter)
app.use("/api/linkchart",LinkChartRouter)
app.use("/api/cards",CardRouter)
app.use("/api/links",LinkRouter)

const PORT = process.env.PORT || '5000'

app.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`)
})