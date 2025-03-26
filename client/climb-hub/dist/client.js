
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
        targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    }
    }, { once: true }); // Only listen once
});
});