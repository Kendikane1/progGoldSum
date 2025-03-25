const express = require('express')
const app = express()

const CRAGS_JSON = './crags.json'
const ROUTES_JSON = './routes.json'

app.use(express.static('client/climb-hub/dist'))
app.use(express.json())

// JSON DATA
let crags = require(CRAGS_JSON)
let routes = require(ROUTES_JSON)

// Define a mapping between crag names and their modal IDs
const cragToModalMap = {
    "Almscliff Crag": "crag1",
    "Caley Crags": "crag2",
    "Ilkley Crag": "crag3",
    "Brimham Rocks": "crag4",
    "Kyloe-In": "crag5",
    "Hepburn Crag": "crag6"
};

// search for crags function
app.get('/crags/search', function (req, resp) {
    let search_term = req.query.search_term.toLowerCase()
    let search_results = []
    for (let crag of crags) {
        if (crag.name.toLowerCase().includes(search_term)) {
            // Include the modal ID in the response
            search_results.push({
                name: crag.name,
                modalId: cragToModalMap[crag.name]
            })
        }
    }

    resp.send(search_results)
})

// Get specific crag details
app.get('/crags/:name', function (req, resp) {
    const cragName = req.params.name
    const crag = crags.find(c => c.name === cragName)
    
    if (crag) {
        resp.send({
            ...crag,
            modalId: cragToModalMap[crag.name]
        })
    } else {
        resp.status(404).send({ error: "Crag not found" })
    }
})

app.listen(8090)