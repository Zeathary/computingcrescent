/*
	Single Article Page Script
*/
let dt = new Date();
let main = document.getElementById("main");
let body = document.getElementsByTagName("BODY")[0];
let wrapper = document.getElementById("wrapper");
let comment_section = document.getElementById("comment-section");
// Grab post id given in url
const id = getUrlVars()["post"];



// On site load, grab data from database to populate the articles
window.onload = function(){
    // Make sure user is logged in
    checkLogin();
    let date;
    let postText;
    let authorid;
    let title;
    let subtitle;
    let thumbnail;
    let authorname;
    // Make Request to post api to receive data and then display it
    let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?id=' + id;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // Parse Response for components
            date = data.post_date;
            postText = data.post_text;
            authorid = data.user_id;
            let extra = JSON.parse(data.extra);
            title = extra.title;
            subtitle = extra.subtitle;
            // If subtitle was left blank set it to an empty string as to not display undefined
            if (!subtitle) {
                subtitle = "";
            }
            thumbnail = extra.image;
            // Make Request to get username and display it on post
            url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/user/?id=' + authorid;
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    // Grab user's name to display
                    authorname = data.username;
                    let avatar = data.avatar;

                    // Create post and insert it into main page
                    let postHTML = "<article class=\"post\">\n" +
                        "                <header>\n" +
                        "                    <div class=\"title\">\n" +
                        "                        <h2><a href=\"single.html?post=" + id + "\">" + title + "</a></h2>\n" +
                        "                        <p>" + subtitle + "</p>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"meta\">\n" +
                        "                        <time class=\"published\">" + date + "</time>\n" +
                        "                        <a href=\"#\" class=\"author\"><span class=\"name\">" + authorname + "</span><img src=\"" + avatar + "\" alt=\"\" /></a>\n" +
                        "                    </div>\n" +
                        "                </header>\n" +
                        "                <a href=\"single.html?post=" + id + "\" class=\"image featured\"><img src=\"" + thumbnail + "\" alt=\"\" /></a>\n" +
                        "                <p>" + postText + "</p>\n" +
                        "                <footer>\n" +
                        "                    <ul class=\"stats\">\n" +
                        "                        <li><a href=\"#\">General</a></li>\n" +
                        "                        <li><a href=\"#\" class=\"icon solid fa-heart\">28</a></li>\n" +
                        "                        <li><a href=\"#\" class=\"icon solid fa-comment\">128</a></li>\n" +
                        "                    </ul>\n" +
                        "                </footer>\n" +
                        "            </article>"

                    // Add Post to bottom of feed
                    let post = document.createElement('div');
                    post.innerHTML = postHTML;
                    main.prepend(post);

                })
                .catch (err => {
                    // Display Error message
                    console.log("Failure to retrieve username");
                    console.log(err);
                });
        })
        .catch (err => {
            // Display Error message
            console.log("Failure to retrieve post data");
            console.log(err);
        });

    // Retrieve all comments on this post and display them
    // Make Request to grab all comments for this post
    url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/comment/?post_id=' + id;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // For each comment, create an html element with the data and add it to the comment section
            data.forEach(comments => {
                console.log(comments);
                let comment_text = comments["comment_text"];
                let comment_date = comments["comment_date"];
                let comment_author = comments["username"];
                let author_avatar = comments["avatar"];

                // Create valid html to display the comment
                let commentHTML = "<article class=\"comment\">\n" +
                    "               <header>\n" +
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
            console.log("Failure to retrieve username");
            console.log(err);
        });
}

// When Comment button is pressed issue a post request and create a comment in db
document.getElementById("create-comment").addEventListener("click", createComment);
async function createComment() {
    // Join session and grab user id
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/status.php');
    let json = await response.json();
    let user_id = json.id;
    let input = document.getElementById("comment-input").value;

    // Take today's date (Date should be in format: yyyy-mm-dd)
    // If month is single digit number then format it to 2 digits. Add 1 to month since its zero based
    let month = dt.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let date = dt.getFullYear() + "-" + month + "-" + dt.getDate();

    let args = {
        user_id: user_id,
        post_id: id,
        comment_text: input,
        comment_date: date
    }

    // Make Request to comment api to create a new comment with given parameters
    url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/comment/'
    fetch(url, {

        // Adding method type
        method: "post",

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
        })
        .catch (err => {
            // Display Error message
            console.log("Failure to create comment");
            console.log(err);
        });

    // After Comment has been created refresh page to display it
    window.location.reload();
}

// Returns an array of parameters passed into the url
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Menu Functionality
body.addEventListener("click", function(event) {
    // Show sidebar menu if the icon was clicked
    if ($(event.target).is('#menu-icon') || $(event.target).parents('#menu').length ) {
        body.classList.add('is-menu-visible')
        wrapper.classList.add('fade');
    } else if ($(event.target).is('#menu')) {
        body.classList.add('is-menu-visible')
        wrapper.classList.add('fade');
    }
    else {
        // If anywhere besides menu is clicked while its out hide it
        body.classList.remove('is-menu-visible')
        wrapper.classList.remove('fade');
    }
})

// Use back arrow to return to main page
document.getElementById("back-arrow").addEventListener("click", function(event) {
    window.location = "index.html";
})
