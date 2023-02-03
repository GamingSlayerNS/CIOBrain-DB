const express = require('express');
const cors = require('cors');
const assetRouter = require('./src/routes/asset');
const loggingController = require('./src/controller/loggingController');

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.options("*", cors())
app.use(express.json())
app.use("/asset", assetRouter)
app.post("/log", loggingController.push)

app.listen(PORT, _ => console.log(`Connected to the server ${PORT}`))
