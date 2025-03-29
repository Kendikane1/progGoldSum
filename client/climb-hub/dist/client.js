/**
 * Shows an error modal with appropriate message based on error type
 * @param {Error} error - The error object
 * @param {string} context - Description of what operation was being performed
 * @param {Function} retryCallback - Optional callback function to retry the operation
 */
function showErrorModal(error, context, retryCallback = null) {
    // Get modal elements
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'))
    const errorModalBody = document.getElementById('errorModalBody')
    const errorModalRetry = document.getElementById('errorModalRetry')
    const errorModalLabel = document.getElementById('errorModalLabel')
    
    // Default error message
    let errorMessage = "An unexpected error occurred."
    let errorTitle = "Error"
    
    // Determine error type and set appropriate message
    if (error.message && error.message.includes('NetworkError') || 
        error.message && error.message.includes('Failed to fetch')) {
        errorTitle = "Connection Error"
        errorMessage = "Unable to connect to the server. Please check your internet connection and make sure the server is running."
    } else if (error.message && error.message.includes('404')) {
        errorTitle = "Not Found"
        errorMessage = "The requested resource could not be found on the server."
    } else if (error.message && error.message.includes('401')) {
        errorTitle = "Unauthorized"
        errorMessage = "You are not authorized to perform this action."
    } else if (error.message && error.message.includes('500')) {
        errorTitle = "Server Error"
        errorMessage = "The server encountered an error while processing your request."
    }
    
    // Add context to the error message
    if (context) {
        errorMessage = `Error while ${context}: ${errorMessage}`
    }
    
    // Add the original error message for debugging
    errorMessage += `<div class="mt-3 small text-muted">Technical details: ${error.message || error}</div>`
    
    // Set modal content
    errorModalLabel.textContent = errorTitle
    errorModalBody.innerHTML = errorMessage
    
    // Handle retry button
    if (retryCallback && typeof retryCallback === 'function') {
        errorModalRetry.style.display = 'block'
        errorModalRetry.onclick = () => {
            errorModal.hide()
            retryCallback()
        }
    } else {
        errorModalRetry.style.display = 'none'
    }
    
    // Show the modal
    errorModal.show()
    
    // Log error to console for debugging
    console.error(`${context} error:`, error)
}


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
        showErrorModal(e, "searching for crags", () => {
            // Retry the search
            this.dispatchEvent(new Event('keyup'))
        })
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



function setupRouteSearch(formId, inputId, resultsId, cragName) {
    const form = document.getElementById(formId)
    if (!form) return
    
    // Get the details div ID
    const detailsDivId = resultsId.replace('_search_results', '_detail_results')
    
    form.addEventListener('keyup', async function (event) {
        event.preventDefault()

        try {
            const input = document.getElementById(inputId)
            const search_term = input.value
            
            // Get the details div for this crag section
            const detailsDiv = document.getElementById(detailsDivId) || 
                               document.querySelector(`#${resultsId}`).closest('.row').querySelector('#detail_results')
            
            // Clear results and details if search term is empty
            if (search_term === "") {
                const results_list = document.getElementById(resultsId)
                results_list.innerHTML = ""
                if (detailsDiv) detailsDiv.innerHTML = ""
                return
            }
            
            const url = `http://127.0.0.1:8090/routes/search?search_term=${search_term}&crag_name=${encodeURIComponent(cragName)}`
            
            const response = await fetch(url)
            const body = await response.text()
            const results = JSON.parse(body)
            
            const results_list = document.getElementById(resultsId)
            results_list.innerHTML = ""
            
            for (let route of results) {
                const li = document.createElement('li')
                li.innerHTML = `<a href="/routes/details/${encodeURIComponent(cragName)}/${encodeURIComponent(route.name)}">${route.name}</a>`
                results_list.appendChild(li)
            }
            
            // Add click handlers to the links
            setupRouteDetailLinks(resultsId, cragName)
        } catch (e) {
            showErrorModal(e, `searching for routes in ${cragName}`, () => {
                // Retry the search
                this.dispatchEvent(new Event('keyup'))
            })
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
        showErrorModal(e, `loading grades for ${cragName}`, () => {
            // Retry loading grades
            populateGradeDropdown(cragName, selectId)
        })
    }
}


// Function to handle grade selection
function setupGradeFilter(selectId, resultsId, cragName) {
    const select = document.getElementById(selectId)
    if (!select) return
    
    // Get the details div ID
    const detailsDivId = resultsId.replace('_search_results', '_detail_results')
    
    select.addEventListener('change', async function() {
        const selectedGrade = this.value
        const resultsList = document.getElementById(resultsId)
        
        // Get the details div for this crag section
        const detailsDiv = document.getElementById(detailsDivId) || 
                           document.querySelector(`#${resultsId}`).closest('.row').querySelector('#detail_results')
        
        if (!selectedGrade) {
            // If "All Grades" selected, clear the results and details
            resultsList.innerHTML = ""
            if (detailsDiv) detailsDiv.innerHTML = ""
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
                li.innerHTML = `<a href="/routes/details/${encodeURIComponent(cragName)}/${encodeURIComponent(route.name)}">${route.name}</a>`
                resultsList.appendChild(li)
            })
            
            // Add click handlers to the links
            setupRouteDetailLinks(resultsId, cragName)
            
        } catch (e) {
            showErrorModal(e, `filtering routes by grade in ${cragName}`, () => {
                // Retry the filter
                this.dispatchEvent(new Event('change'))
            })
        }
    })
}

function setupRouteDetailLinks(resultsId, cragName) {
    const links = document.querySelectorAll(`#${resultsId} li a`)
    const detailsDivId = resultsId.replace('_search_results', '_detail_results')
    
    links.forEach(link => {
        link.style.cursor = 'pointer'
        link.style.color = '#3498db'
        link.style.textDecoration = 'none'
        
        link.addEventListener('click', async function(event) {
            event.preventDefault()
            
            const requestUrl = this.getAttribute('href')
            try {
                const response = await fetch(requestUrl)
                const body = await response.text()
                const route = JSON.parse(body)
                
                // Get the SPECIFIC details div for this crag
                const detailsDiv = document.getElementById(detailsDivId)
                
                if (!detailsDiv) {
                    console.error(`Could not find details div with ID: ${detailsDivId}`)
                    return
                }
                
                // Create and display card with route details
                detailsDiv.innerHTML = `
                <div class="card mb-4" style="max-width: 540px;">
                    <div class="card-header bg-primary text-black">
                        <h5 class="card-title mb-0">${route.name}</h5>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Crag: ${route.crag}</h6>
                        <p class="card-text">
                            <strong>Grade:</strong> ${route.grade}
                        </p>
                        <p class="card-text">
                            <em>This ${getDifficultyDescription(route.grade)} route is located at ${route.crag}.</em>
                        </p>
                    </div>
                </div>
                `
            } catch (e) {
                showErrorModal(e, `loading route details for ${cragName}`, () => {
                    // Retry loading the details
                    this.click()
                })
            }
        })
    })
}
// Helper function to describe difficulty based on grade
function getDifficultyDescription(grade) {
    // Extract number from grade if possible
    const numMatch = grade.match(/\d+\.?\d*/)?.[0]
    const num = numMatch ? parseFloat(numMatch) : 0
    
    if (grade.includes('8') || num >= 7.5) return 'extremely challenging'
    if (grade.includes('7') || num >= 6.5) return 'very difficult'
    if (grade.includes('6') || num >= 5.5) return 'difficult'
    if (grade.includes('5') || num >= 4.5) return 'moderate'
    return 'beginner-friendly'

    
}


// Function to find closest matching valid crag name (Diclaimer : This code was generated by AI)
function findMatchingCrag(input) {
    // List of valid crag names
    const validCrags = [
        "Almscliff Crag",
        "Caley Crags",
        "Ilkley Crag",
        "Brimham Rocks",
        "Kyloe-In",
        "Hepburn Crag"
    ];
    
    // Convert input to lowercase for case-insensitive matching
    const inputLower = input.trim().toLowerCase();
    
    // Check for exact match first (case insensitive)
    const exactMatch = validCrags.find(crag => crag.toLowerCase() === inputLower);
    if (exactMatch) return { match: exactMatch, confidence: 1.0 };
    
    // Check if input is a substring of any valid crag
    const substringMatches = validCrags.filter(crag => 
        crag.toLowerCase().includes(inputLower) || 
        inputLower.includes(crag.toLowerCase())
    );
    
    if (substringMatches.length === 1) {
        return { match: substringMatches[0], confidence: 0.9 };
    }
    
    // Calculate similarity for each crag
    const similarities = validCrags.map(crag => {
        const similarity = calculateStringSimilarity(inputLower, crag.toLowerCase());
        return { crag, similarity };
    });
    
    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // If the highest similarity is above threshold, return it
    if (similarities[0].similarity > 0.6) {
        return { match: similarities[0].crag, confidence: similarities[0].similarity };
    }
    
    // No good match found
    return { match: null, confidence: 0 };

    // Add this validation function after the findMatchingCrag function

// Validate climbing grade format (Fontainebleau system)
function isValidGradeFormat(grade) {
    // Grade pattern: number + optional letter (A-C) + optional plus
    // Examples: 5, 5+, 6A, 6A+, 7B, 7B+, 8C
    const gradePattern = /^([4-9]|[1-9][0-9])([ABC])?(\+)?$/;
    return gradePattern.test(grade.trim());
}
}

// Validate climbing grade format (Fontainebleau system)
function isValidGradeFormat(grade) {
    // Grade pattern: number + optional letter (A-C) + optional plus
    // Examples: 5, 5+, 6A, 6A+, 7B, 7B+, 8C
    const gradePattern = /^([4-9]|[1-9][0-9])([ABC])?(\+)?$/;
    return gradePattern.test(grade.trim());
}



// Helper function to calculate string similarity (simplified Levenshtein-based approach)
function calculateStringSimilarity(str1, str2) {
    // Simple case - if one string contains the other, high similarity
    if (str1.includes(str2)) return 0.9;
    if (str2.includes(str1)) return 0.8;
    
    // Count matching characters in sequence
    let matches = 0;
    let maxLen = Math.max(str1.length, str2.length);
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) matches++;
    }
    
    // Basic similarity measure
    return matches / maxLen;
}


const add_form = document.getElementById('add_form')
add_form.addEventListener('submit', async function(event){
    event.preventDefault()
    
    // Get form inputs
    const cragInput = document.getElementById('crag_name')
    const routeNameInput = document.getElementById('route_name')
    const gradeInput = document.getElementById('grade_input')
    
    // Basic form validation
    if (!cragInput.value.trim()) {
        alert('Please enter a crag name')
        cragInput.focus()
        return
    }
    
    if (!routeNameInput.value.trim()) {
        alert('Please enter a route name')
        routeNameInput.focus()
        return
    }
    
    if (!gradeInput.value.trim()) {
        alert('Please enter a grade')
        gradeInput.focus()
        return
    }
    
    // Validate grade format
    if (!isValidGradeFormat(gradeInput.value)) {
        alert('Invalid grade format. Please use Fontainebleau grading format: number (4-9) followed by optional letter (A, B, or C) and optional plus sign. Examples: 5, 5+, 6A, 6A+, 7B, 7C+')
        gradeInput.focus()
        return
    }
    
    // Get the closest matching crag
    const cragMatch = findMatchingCrag(cragInput.value);
    
    if (!cragMatch.match) {
        alert('Invalid crag name. Please enter one of the following:\n- Almscliff Crag\n- Caley Crags\n- Ilkley Crag\n- Brimham Rocks\n- Kyloe-In\n- Hepburn Crag')
        cragInput.focus()
        return
    }
    
    // If we found a match but it's not exactly what the user typed
    if (cragMatch.match.toLowerCase() !== cragInput.value.trim().toLowerCase() && cragMatch.confidence < 1.0) {
        const useMatch = confirm(`Did you mean "${cragMatch.match}"? Click OK to use this crag name, or Cancel to edit.`);
        if (!useMatch) {
            cragInput.focus()
            return
        }
        // Update the input field with the correct crag name
        cragInput.value = cragMatch.match
    }
    
    // Create form data with the validated crag name
    const formData = new FormData(add_form)
    
    // Create form JSON with the corrected crag name
    const formDataObj = Object.fromEntries(formData.entries())
    formDataObj.crag = cragMatch.match // Ensure we use the properly formatted crag name
    const formJSON = JSON.stringify(formDataObj)
    

    try {
        const response = await fetch('/routes/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: formJSON
        })
        
        const data = await response.json()
        
        if (response.ok) {
            // Route added successfully
            alert(data.msg)
            
            // Refresh the appropriate route list
            const cragName = cragMatch.match
            const cragPrefix = {
                "Almscliff Crag": "alms",
                "Caley Crags": "cal", 
                "Ilkley Crag": "ilk",
                "Brimham Rocks": "brim",
                "Kyloe-In": "ky",
                "Hepburn Crag": "hep"
            }[cragName]
            
            if (cragPrefix) {
                // Get the current dropdown element
                const gradeSelect = document.getElementById(`${cragPrefix}_grade_select`)
                
                // Check if the new grade already exists in the dropdown
                const newGrade = gradeInput.value.trim()
                let gradeExists = false
                
                for (let i = 0; i < gradeSelect.options.length; i++) {
                    if (gradeSelect.options[i].value === newGrade) {
                        gradeExists = true
                        break
                    }
                }
                
                // If the grade doesn't exist, refresh the dropdown
                if (!gradeExists) {
                    // Repopulate the dropdown (this will include the new grade)
                    populateGradeDropdown(cragName, `${cragPrefix}_grade_select`)
                }
                
                // Clear the search input and trigger a search to refresh the routes list
                const searchInput = document.getElementById(`${cragPrefix}_search_term`)
                if (searchInput) {
                    searchInput.value = ''
                    searchInput.dispatchEvent(new Event('keyup'))
                }
            }
            
            // Reset form
            add_form.reset()
        } else {
            alert(data.msg || 'Error adding route')
        }
    } catch (e) {
        showErrorModal(e, "adding a new route", () => {
            // Allow the user to retry the submission
            document.getElementById('submitButton').click()
        })
    }
})



