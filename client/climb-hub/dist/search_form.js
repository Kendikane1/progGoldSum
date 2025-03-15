// get data out this form and make fetch request to server
const search_form = document.getElementById('search_form')
search_form.addEventListener('keyup', async function (event){
    event.preventDefault() // prevents the form from being submitted

    try{
        let input_elt = document.getElementById('search_term') //look at form tag in form.html
        let search_term = input_elt.value // gets the value of the input element
        let url = "http://127.0.0.1:8090/crags/search?search_term=" + search_term // linked to server side
        let response = await fetch(url) // makes a request to the server
        let body = await response.text() // converts the response to a string
        let results = JSON.parse(body) // converts the json string to a javascript object
        let results_list = document.getElementById('search_results')
        results_list.innerHTML = "" // resets the list
        for (let result of results) {
            results_list.innerHTML += "<li>" + result.name + "</li>"
            if(search_term == ""){
                results_list.innerHTML = ""
            }
        }
    }
    catch(e){
        alert(e)
    }
})