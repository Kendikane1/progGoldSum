const express = require('express')
const app = express()

app.use(express.static('client/node_modules/startbootstrap-agency/dist'))


app.listen(8090)