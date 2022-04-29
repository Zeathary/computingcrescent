// When delete post option is selected from the menu create the delete form
document.getElementById("menu-delete-acc").addEventListener("click", createDeleteAccForm);
async function createDeleteAccForm() {
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/status.php');
    let json = await response.json();
    if (json.error) {
        console.log('Error making delete form');
    } else {
        // Find all posts from this user and populate selector with them
        let user = json.username;
        let user_id = json.id;
        let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?username=' + user;
        // Create form html
        let formHTML = "<h3>Are you sure you want to delete " + user + "?</h3>\n" +
            "                 <h4>Id: </h4> <h4 id='user-id'>" + user_id + "</h4>" +
            "                 <br>" +
            "                <button type=\"submit\" id=\"delete-acc-button\">Delete Account</button>\n" +
            "                <button id=\"cancel-delete-acc\">Cancel</button>\n"

        console.log(formHTML);
        // Add form to html page
        let form = document.createElement('div');
        form.id = "delete-info";
        form.innerHTML = formHTML;
        document.getElementById("wrapper").prepend(form);

        // Add blur class to page wrapper to shift focus to form
        $("#wrapper").addClass("blur");
    }
}

// Delete form functionality
body.addEventListener("click", function(event) {
    // Delete Selected post from database
    if ($(event.target).is('#delete-acc-button')) {
        const user_id = document.getElementById("user-id").textContent;

        console.log("Attempting to delete post: " + user_id);
        // Grab Fields from form
        let attributes = {
            id: user_id,
        };
        // Make Request to post api to create a new post with given parameters
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attributes)
        };
        let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/user/';

        fetch(url, requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.error === false) {
                    // If account is successfully deleted return to login page
                    window.location = "login.html";
                }
            })
            .catch (err => {
                // Display Error message
                console.log("An error has deleting your account");
                console.log(err);
            });

    }
    // When Cancel delete button is pressed clear the delete form
    else if ($(event.target).is('#cancel-delete-acc')) {
        // Unblur page
        $("#wrapper").removeClass("blur");
        // Delete the delete form
        $("#delete-info").remove();
    }
})