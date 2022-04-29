let dt = new Date();
const post_form = document.getElementById('post-form');
const cancel_button = document.getElementById('cancel-button');

window.onload = function() {
    // Make sure a user is logged in
    checkLogin();
}

// Create appropriate JSON data needed to create a post and make request to post api
post_form.addEventListener('submit', function(event)
{
    event.preventDefault();
    createPost();
}, false);

// When cancel button is pressed return to main page
cancel_button.addEventListener('click', function(event) {
    event.preventDefault();
    window.location = "index.html";
})

// Makes Post request to post api to create a new post entry
async function createPost() {
    // Join session and grab user id
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/status.php');
    let json = await response.json();
    let id = json.id;

    // Take today's date (Date should be in format: yyyy-mm-dd)
    // If month is single digit number then format it to 2 digits. Add 1 to month since its zero based
    let month = dt.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let curr_date = dt.getFullYear() + "-" + month + "-" + dt.getDate();
    console.log("date: ");
    console.log(curr_date);
    let text = document.getElementById("post_text").value;
    let extra = {
        title: document.getElementById("title").value,
        subtitle: document.getElementById("subtitle").value,
        image: document.getElementById("thumbnail").value
    }

    // List with post attributes: User_id, post_date, post_text, extra
    let attributes = {
        user_id: id,
        post_date: curr_date,
        post_text: text,
        extra: extra
    }

    // Make Request to post api to create a new post with given parameters
    let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/';
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributes)
    };
    fetch(url, requestOptions)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            console.log(data);
            // After post is successfully made return to main page
            window.location = '../View/index.html';
        })
        .catch (err => {
            // Display Error message
            console.log("Failure to create post");
            console.log(err);
        });
}