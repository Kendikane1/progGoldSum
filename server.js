const express = require('express')
const app = express()

app.use(express.static('client/climb-hub/dist'))



app.listen(8090)