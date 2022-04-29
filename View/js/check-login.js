async function checkLogin() {
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/status.php');
    let json = await response.json();
    console.log(json);
    if (json.error) {
        // If Not logged in redirect to login page
        window.location = '../View/login.html';
        console.log('redirect');
    } else {
        // Display User Data
        let html = "<img id=\"user-avatar\" src=\"" + json.avatar + "\" onerror=\"this.onerror=null; this.src='pics/default.png'\" alt=''/>"
        document.getElementById('username').innerHTML = json.username + html;
        //document.getElementById("user-avatar").src = json.avatar;
    }
}

// Logout Functionality
document.getElementById('logout').addEventListener('click', logout);
async function logout() {
    let response = await fetch('http://web.cs.georgefox.edu/~zheath19/blog/API/sessions/logout.php');
    let json = await response.json();
    if (json.message) {
        window.location = '../View/login.html';
    } else {
        alert('An error occurred while logging out');
    }
}

