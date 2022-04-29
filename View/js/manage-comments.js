/*
	Comment Viewer and Manager Script
*/
let dt = new Date();
let main = document.getElementById("main");
let body = document.getElementsByTagName("BODY")[0];
let comment_section = document.getElementById("comment-section");

// On site load, Display all comments from this user
window.onload = async function(){
    // Make sure user is logged in
    checkLogin();

    // Join session and grab user id
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/status.php');
    let json = await response.json();
    let user_id = json.id;

    // Retrieve all comments this user had created and display them
    let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/comment/?user_id=' + user_id;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // For each comment, create an html element with the data and add it to the comment section
            data.forEach(comments => {
                console.log(comments);
                let comment_id = comments["id"];
                let comment_text = comments["comment_text"];
                let comment_date = comments["comment_date"];
                let comment_author = comments["username"];
                let author_avatar = comments["avatar"];

                // Create valid html to display the comment
                let commentHTML = "<article id=\"comment-" + comment_id +"\" class=\"comment\">\n" +
                    "               <header>\n" +
                    "                   <img id=\"" + comment_id + "\" class='delete-icon' src='pics/delete.png' alt='X' onclick='deleteComment(this.id)'>" +
                    "                   <time class=\"published\">" + comment_date + "</time>\n" +
                    "                   <a href=\"#\" class=\"author\"><span class=\"name\">" + comment_author + "</span><img src=\"" + author_avatar + "\" alt=\"\" onerror=\"this.onerror=null; this.src='pics/default.png'\" /></a>\n" +
                    "               </header>\n" +
                    "                   <p class=\"comment-body\">" + comment_text + "</p>\n" +
                    "               </article>"

                // Add comment to bottom of comment section
                let comment = document.createElement('div');
                comment.innerHTML = commentHTML;
                comment_section.appendChild(comment);
            });

        })
        .catch (err => {
            // Display Error message
            console.log("Failure to retrieve comments");
            console.log(err);
        });
}

// When X on each comment is pressed delete that comment
async function deleteComment(comment_id) {
    let args = {
        id: comment_id,
    }
    // Make Request to comment api to create a new comment with given parameters
    let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/comment/'
    fetch(url, {

        // Adding method type
        method: "delete",

        // Adding body or contents to send
        body: JSON.stringify(args),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            console.log(data);
            // When Comment is deleted remove the comment from the page
            let comment_element_id = "comment-" + args.id;
            document.getElementById(comment_element_id).remove();
        })
        .catch(err => {
            // Display Error message
            console.log("Failure to delete comment");
            console.log(err);
        });
}

// Menu Functionality
body.addEventListener("click", function(event) {
    // Show sidebar menu if the icon was clicked
    if ($(event.target).is('#menu-icon') || $(event.target).parents('#menu').length ) {
        body.classList.add('is-menu-visible')
    } else if ($(event.target).is('#menu')) {
        body.classList.add('is-menu-visible')
    }
    else {
        // If anywhere besides menu is clicked while its out hide it
        body.classList.remove('is-menu-visible')
    }
})

// Use back arrow to return to main page
document.getElementById("back-arrow").addEventListener("click", function(event) {
    window.location = "index.html";
})
