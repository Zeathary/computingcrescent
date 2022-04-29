// When delete post option is selected from the menu create the delete form
document.getElementById("menu-delete-post").addEventListener("click", createDeleteForm);
async function createDeleteForm() {
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/status.php');
    let json = await response.json();
    if (json.error) {
        console.log('Error making delete form');
    } else {
        // Find all posts from this user and populate selector with them
        let user = json.username;
        let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?username=' + user;
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // Create form html
                let formHTML = "<h3>Select a post to delete</h3>\n" +
                    "            <form id=\"delete-post-form\">\n" +
                    "                <select id=\"delete-selection\" required>\n" +
                    "                    <option value=\"default\" selected>Select a Post to Delete</option>\n"
                // Add an option to selector for each post the user has created
                for( var i = 0; i < data.length; i++) {
                    console.log(data[i]);
                    // Grab post data to display
                    let post_id = data[i].id;
                    let extra = JSON.parse(data[i].extra);
                    let title = extra.title;

                    formHTML += '<option value="' + post_id + '" >' + title + '</option>\n'
                }
                formHTML +=
                    "                </select>\n" +
                    "                <br>\n" +
                    "                <button type=\"submit\" id=\"delete-post-button\">Delete Post</button>\n" +
                    "                <button id=\"cancel-delete\">Cancel</button>\n" +
                    "            </form>"

                console.log(formHTML);
                // Add form to html page
                let form = document.createElement('div');
                form.id = "delete-info";
                form.innerHTML = formHTML;
                document.getElementById("wrapper").prepend(form);

                // Add blur class to page wrapper to shift focus to form
                $("#wrapper").addClass("blur");

            })
            .catch (err => {
                // Display Error message
                console.log("Failure to retrieve username");
                console.log(err);
            });
    }
}

// Delete form functionality
body.addEventListener("click", function(event) {
    // Delete Selected post from database
    if ($(event.target).is('#delete-post-button')) {
        const postid = document.getElementById("delete-selection").options[document.getElementById("delete-selection").selectedIndex].value;

        // If in login state submit to "../API/sessions/index.php"
        if (postid !== "default") {
            console.log("Attempting to delete post: " + postid);
            // Grab Fields from form
            let attributes = {
                id: postid,
            };
            // Make Request to post api to create a new post with given parameters
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attributes)
            };
            let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/';

            fetch(url, requestOptions)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    if (data.error === false) {
                        $("#cancel-delete").click();
                    }
                })
                .catch (err => {
                    // Display Error message
                    console.log("An error has occured logging in");
                    console.log(err);
                });
        }
    }
    // When Cancel delete button is pressed clear the delete form
    else if ($(event.target).is('#cancel-delete')) {
        // Unblur page
        $("#wrapper").removeClass("blur");
        // Delete the delete form
        $("#delete-info").remove();
    }
})

// // Delete Selected post from database
// $('#delete-post-form').on('submit',function (e) {
//     e.preventDefault();
//     const postid = document.getElementById("delete-selection").options[document.getElementById("delete-selection").selectedIndex].value;
//
//     // If in login state submit to "../API/sessions/index.php"
//     if (postid !== "default") {
//         console.log("Attempting to delete post: " + postid);
//         // Grab Fields from form
//         let attributes = {
//             id: postid,
//         };
//         // Make Request to post api to create a new post with given parameters
//         const requestOptions = {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(attributes)
//         };
//         let url = '../../API/sessions/post.php';
//
//         fetch(url, requestOptions)
//             .then((response) => {
//                 return response.json();
//             })
//             .then((data) => {
//                 console.log(data);
//                 if (data.error === false) {
//                     $("#cancel-delete").click();
//                 }
//             })
//             .catch (err => {
//                 // Display Error message
//                 console.log("An error has occured logging in");
//                 console.log(err);
//             });
//     }
// });
//
// // When Cancel delete button is pressed clear the delete form
// $("#cancel-delete").click(function () {
//     // Unblur page
//     $("#wrapper").removeClass("blur");
//     // Delete the delete form
//     $("#delete-info").remove();
// })