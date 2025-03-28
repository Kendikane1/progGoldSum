
// both get methods for crags entity
const search_form = document.getElementById('search_form')
search_form.addEventListener('keyup', async function (event){
    event.preventDefault() // prevents the form from being submitted

    try{
        let input_elt = document.getElementById('search_term')
        let search_term = input_elt.value // gets the value of the input element
        let url = "http://127.0.0.1:8090/crags/search?search_term=" + search_term // linked to server side
        let response = await fetch(url) // makes a request to the server
        let body = await response.text() // converts the response to a string
        let results = JSON.parse(body) // converts the json string to a javascript object
        let results_list = document.getElementById('search_results')
        results_list.innerHTML = "" // resets the list
        
        for (let result of results) {
            // Create list item with data attributes and click event
            let li = document.createElement('li')
            li.textContent = result.name
            li.setAttribute('data-modal-id', result.modalId)
            li.style.cursor = 'pointer' // Show clickable cursor
            
            // Add click event to open the modal
            li.addEventListener('click', function() {
                // Use Bootstrap's modal method to show the modal
                const modalId = this.getAttribute('data-modal-id')
                const modalElement = document.getElementById(modalId)
                const modal = new bootstrap.Modal(modalElement)
                modal.show()
                
                // Clear the search input and results after selection
                input_elt.value = ''
                results_list.innerHTML = ''
            })
            
            results_list.appendChild(li)
        }
        
        if(search_term == ""){
            results_list.innerHTML = ""
        }
    }
    catch(e){
        alert(e)
    }
})

// all route links inside modals (NOT A GET METHOD)
document.querySelectorAll('.portfolio-modal .nav-link[href^="#"]').forEach(link => {
link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default anchor behavior
                    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
                    
    // Close the modal programmatically
    const modalElement = this.closest('.portfolio-modal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
                    
    // Wait for modal to close before scrolling
    modalElement.addEventListener('hidden.bs.modal', function() {
    // Scroll to the target element after modal is hidden
    if (targetElement) {
        setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    }
    }, { once: true }); // Only listen once
});
});


// Function to setup route search for a specific crag
function setupRouteSearch(formId, inputId, resultsId, cragName) {
    const form = document.getElementById(formId)
    if (!form) return
    
    form.addEventListener('keyup', async function (event) {
        event.preventDefault()

        try {
            const input = document.getElementById(inputId)
            const search_term = input.value
            const url = `http://127.0.0.1:8090/routes/search?search_term=${search_term}&crag_name=${encodeURIComponent(cragName)}`
            
            const response = await fetch(url)
            const body = await response.text()
            const results = JSON.parse(body)
            
            const results_list = document.getElementById(resultsId)
            results_list.innerHTML = ""
            
            for (let route of results) {
                const li = document.createElement('li')
                li.innerHTML = `<strong>${route.name}</strong>`
                results_list.appendChild(li)
            }

            if(search_term == ""){
                results_list.innerHTML = ""
            }
        } 
        catch (e) {
            alert(e)
        }
    })
}

// Set up search for each crag
document.addEventListener('DOMContentLoaded', function() {
    // Almscliff Crag
    setupRouteSearch('alms_search_form', 'alms_search_term', 'alms_search_results', 'Almscliff Crag')
    
    // Caley Crags
    setupRouteSearch('cal_search_form', 'cal_search_term', 'cal_search_results', 'Caley Crags')
    
    // Ilkley Crag
    setupRouteSearch('ilk_search_form', 'ilk_search_term', 'ilk_search_results', 'Ilkley Crag')
    
    // Brimham Rocks
    setupRouteSearch('brim_search_form', 'brim_search_term', 'brim_search_results', 'Brimham Rocks')
    
    // Kyloe-In
    setupRouteSearch('ky_search_form', 'ky_search_term', 'ky_search_results', 'Kyloe-In')
    
    // Hepburn Crag
    setupRouteSearch('hep_search_form', 'hep_search_term', 'hep_search_results', 'Hepburn Crag')
    
    // Load all routes for each crag on page load
    const cragNames = [
        'Almscliff Crag', 'Caley Crags', 'Ilkley Crag', 
        'Brimham Rocks', 'Kyloe-In', 'Hepburn Crag'
    ]
    
    const formIds = [
        'alms_search_term', 'cal_search_term', 'ilk_search_term',
        'brim_search_term', 'ky_search_term', 'hep_search_term'
    ]
    
    // Trigger a search with empty string to load all routes initially
    for (let i = 0; i < cragNames.length; i++) {
        const input = document.getElementById(formIds[i])
        if (input) {
            input.value = ''
            input.dispatchEvent(new Event('keyup'))
        }
    }
})


// Function to populate grade dropdowns for each crag
async function populateGradeDropdown(cragName, selectId) {
    const select = document.getElementById(selectId)
    if (!select) return
    
    try {
        const url = `http://127.0.0.1:8090/routes/grades/${encodeURIComponent(cragName)}`
        const response = await fetch(url)
        const body = await response.text()
        const grades = JSON.parse(body)
        
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1)
        }
        
        // Add each grade as an option
        grades.forEach(grade => {
            const option = document.createElement('option')
            option.value = grade
            option.textContent = `Grade: ${grade}`
            select.appendChild(option)
        })
    } catch (e) {
        console.error(`Error fetching grades for ${cragName}:`, e)
    }
}

// Function to handle grade selection
function setupGradeFilter(selectId, resultsId, cragName) {
    const select = document.getElementById(selectId)
    if (!select) return
    
    select.addEventListener('change', async function() {
        const selectedGrade = this.value
        const resultsList = document.getElementById(resultsId)
        
        if (!selectedGrade) {
            // If "All Grades" selected, clear the results
            resultsList.innerHTML = ""
            return
        }
        
        try {
            const url = `http://127.0.0.1:8090/routes/bygrade?grade=${encodeURIComponent(selectedGrade)}&crag_name=${encodeURIComponent(cragName)}`
            const response = await fetch(url)
            const body = await response.text()
            const routes = JSON.parse(body)
            
            // Display the routes
            resultsList.innerHTML = ""
            routes.forEach(route => {
                const li = document.createElement('li')
                li.innerHTML = `<strong>${route.name}</strong>`
                resultsList.appendChild(li)
            })
        } catch (e) {
            console.error(`Error fetching routes for ${cragName} grade ${selectedGrade}:`, e)
        }
    })
}


document.addEventListener('DOMContentLoaded', function() {
    // Existing code for route search setup
    
    // Populate grade dropdowns
    populateGradeDropdown('Almscliff Crag', 'alms_grade_select')
    populateGradeDropdown('Caley Crags', 'cal_grade_select')
    populateGradeDropdown('Ilkley Crag', 'ilk_grade_select')
    populateGradeDropdown('Brimham Rocks', 'brim_grade_select')
    populateGradeDropdown('Kyloe-In', 'ky_grade_select')
    populateGradeDropdown('Hepburn Crag', 'hep_grade_select')
    
    // Setup grade filters
    setupGradeFilter('alms_grade_select', 'alms_search_results', 'Almscliff Crag')
    setupGradeFilter('cal_grade_select', 'cal_search_results', 'Caley Crags')
    setupGradeFilter('ilk_grade_select', 'ilk_search_results', 'Ilkley Crag')
    setupGradeFilter('brim_grade_select', 'brim_search_results', 'Brimham Rocks')
    setupGradeFilter('ky_grade_select', 'ky_search_results', 'Kyloe-In')
    setupGradeFilter('hep_grade_select', 'hep_search_results', 'Hepburn Crag')
})