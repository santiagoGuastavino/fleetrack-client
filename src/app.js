import express from 'express'
import cors from 'cors'

import mainRouter from './routes/main.js'

const app = express()

app.use(cors())

app.use('/', mainRouter)

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, console.log(`Serving @ ${PORT}`))
