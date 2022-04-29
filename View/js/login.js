let form = document.getElementById("login-form");
let submitbutton = document.getElementById("submit-button");
let linkPrompt = document.getElementById("create-acc");
let loginState = true;

// When create new account link is pressed replace the login form with a create new account form
let new_account_link = document.getElementById("create-link");
function createAccountForm() {
    // Add field to add avatar image link
    let avatarHTML = "<label class='avatar'>Avatar Image Link (Optional)</label>\n" +
        "            <input class='avatar' type=\"text\" name=\"avatar\" id=\"avatar\" placeholder=\"https://img.jpg\"><br>"
    avatarHTML += form.innerHTML;
    form.innerHTML = avatarHTML;
    // Change button to say create account
    $('#submit-button').innerText = "Create Account";
    // Remove create new account link to link back to login form
    linkPrompt.innerHTML= "Already have an account? <a onclick=\"createLoginForm()\" id=\"create-link\">Login</a>";
    // Change out of login state
    loginState = false;
}

function createLoginForm() {
    // Remove avatar field
    $('.avatar').remove();
    // Remove extra br tag
    form.removeChild(form.getElementsByTagName('br')[0]);
    // Change button to say log in
    submitbutton.innerText = "Login";
    // Remove create new account link to link back to create form
    linkPrompt.innerHTML= "New to the Blog? <a onclick=\"createAccountForm()\" id=\"create-link\">Create New Account</a>";
    // Change into login state
    loginState = true;
}

let formData = new FormData(document.getElementById('login-form'));
$('#login-form').on('submit',function (e) {
    e.preventDefault();
    console.log("Submit");
    const name = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    let url;

    // If in login state submit to "../API/sessions/index.php"
    if (loginState) {
        url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/index.php';
        // Grab Fields from form
        let attributes = {
            username: name,
            password: pass
        };

        // Make Request to post api to create a new post with given parameters
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attributes)
        };

        fetch(url, requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.username) {
                    window.location = 'index.html';
                } else {
                    document.getElementById('errorMessage').innerText = 'Incorrect Username or Password';
                }
            })
            .catch (err => {
                // Display Error message
                console.log("An error has occured logging in");
                console.log(err);
            });
    }
    // If in create mode submit to "../API/user/"
    else {
        url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/user/index.php'

        // if avatar is supplied submit that with the other attributes
        const avatar = document.getElementById("avatar").value;
        let attributes = {}
        if (avatar) {
            // Grab Fields from form
            attributes = {
                username: name,
                password: pass,
                avatar: avatar
            };
        } else {
            // Grab Fields from form
            attributes = {
                username: name,
                password: pass
            };
        }

        // Make Request to post api to create a new post with given parameters
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attributes)
        };
        fetch(url, requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.username) {
                    window.location = 'login.html';
                } else {
                    document.getElementById('errorMessage').innerText = 'Error Creating Account: ' + data;
                }
            })
            .catch (err => {
                // Display Error message
                console.log("Error Creating Account");
                console.log(err);
            });
    }


});

// document.getElementById('submit-button').addEventListener('click', submitForm);
//
// async function submitForm() {
//     console.log("Submit");
//     let url;
//     // Grab Fields from form
//     let attributes = {
//         username: document.getElementById("username").value,
//         password: document.getElementById("password").value
//     }
//     // If in login state submit to "../API/sessions/index.php"
//     if (loginState) {
//         url = '../../API/sessions/';
//
//         let response = await fetch('../API/sessions/', {
//             method:'POST',
//             body: new FormData(document.getElementById('loginForm')),
//         });
//
//         let data = await response.json();
//         if (data.username) {
//             window.location = 'index.html';
//         } else {
//             document.getElementById('errorMessage').innerText = 'Incorrect Username or Password';
//         }
//     }
//     // If in create mode submit to "../API/user/"
//     else {
//         let response = await fetch('../API/user/', {
//             method:'POST',
//             body: new FormData(document.getElementById('loginForm')),
//         });
//
//         let data = await response.json();
//         if (data.username) {
//             window.location = 'login.html';
//         } else {
//             document.getElementById('errorMessage').innerText = 'Account Not Created';
//         }
//     }
//
//
//     // // Make Request to post api to create a new post with given parameters TODO change url
//     // const requestOptions = {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify(attributes)
//     // };
//     // fetch(url, requestOptions)
//     //     .then((response) => {
//     //         return response.json();
//     //     })
//     //     .then((data) => {
//     //         console.log(data);
//     //         if (data.username) {
//     //             window.location = 'login.html';
//     //         } else {
//     //             document.getElementById('errorMessage').innerText = 'Incorrect Username or Password';
//     //         }
//     //     })
//     //     .catch (err => {
//     //         // Display Error message
//     //         console.log("Incorrect Username or Password");
//     //         console.log(err);
//     //     });
//     return false;
// }