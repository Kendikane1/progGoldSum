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

// get method search for crags function
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

// get specific crag details
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


// get method routes search endpoint
app.get('/routes/search', function (req, resp) {
    const search_term = req.query.search_term.toLowerCase()
    const crag_name = req.query.crag_name
    
    let search_results = []
    
    for (let route of routes) {
        if (route.crag === crag_name && 
            (search_term === '' || route.name.toLowerCase().includes(search_term))) {
            search_results.push(route)
        }
    }

    resp.send(search_results)
})

// Get all unique grades for a specific crag
app.get('/routes/grades/:crag', function (req, resp) {
    const cragName = req.params.crag
    
    // Find all routes for this crag
    const cragRoutes = routes.filter(route => route.crag === cragName)
    
    // Extract unique grades
    const uniqueGrades = [...new Set(cragRoutes.map(route => route.grade))]
    
    // Sort grades
    const sortedGrades = uniqueGrades.sort((a, b) => {
        // Extract numbers from grade for numeric sorting
        const numA = parseFloat(a.match(/\d+\.?\d*/)?.[0] || 0)
        const numB = parseFloat(b.match(/\d+\.?\d*/)?.[0] || 0)
        
        if (numA === numB) {
            // If numbers are the same, sort alphabetically
            return a.localeCompare(b)
        }
        return numA - numB
    })
    
    resp.send(sortedGrades)
})

// Get routes by grade and crag
app.get('/routes/bygrade', function (req, resp) {
    const grade = req.query.grade
    const cragName = req.query.crag_name
    
    // Find all routes matching the grade and crag
    const matchingRoutes = routes.filter(route => 
        route.crag === cragName && route.grade === grade
    )
    
    resp.send(matchingRoutes)
})


// Get details for a specific route
app.get('/routes/details/:crag/:routeName', function (req, resp) {
    const cragName = decodeURIComponent(req.params.crag)
    const routeName = decodeURIComponent(req.params.routeName)
    
    // Find the specific route
    const route = routes.find(r => 
        r.crag === cragName && r.name === routeName
    )
    
    if (route) {
        resp.send(route)
    } else {
        resp.status(404).send({ error: "Route not found" })
    }
})

module.exports = app;