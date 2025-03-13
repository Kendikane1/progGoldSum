const express = require('express')
const app = express()

const CRAGS_JSON = './crags.json'
const ROUTES_JSON = './routes.json'

app.use(express.static('client/climb-hub/dist'))
app.use(express.json())

// JSON DATA
let crags = require(CRAGS_JSON)
let routes = require(ROUTES_JSON)

// search for crags function
app.get('/crags/search', function (req, resp) {
    let search_term = req.query.search_term
    let search_results = []
    for (let crag of crags) {
        if (crag.name.includes(search_term)) {
            search_results.push(crag.name)
        }
    }

    resp.send(search_results)

})

app.listen(8090)