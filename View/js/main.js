/*
	Main Page Script
*/
let main = document.getElementById("main");
let body = document.getElementsByTagName("BODY")[0];
let wrapper = document.getElementById("wrapper");
let lastPostID = -1;

// On site load, grab data from database to populate the articles
window.onload = function(){
	// Check if user is logged into site
	checkLogin()

	// Place 5 posts on the main page
	generateFeed();

	// Place a few mini posts on the sidebar
	generateSideBarFeed();

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

// Search Bar Functionality
let search = document.getElementById("search");
// If search icon is clicked submit form
$('#search-icon').click(function() {
	$("#search").submit();
})
// When Search bar is clicked display all
search.addEventListener('submit', function(event)
{
	event.preventDefault();
	let authorname = document.getElementById("search-bar").value;

	searchByUsername(authorname);

}, false);
// Menu Search Bar Functionality
let search2 = document.getElementById("search2");
// When Search bar is clicked display all
search.addEventListener('submit', function(event)
{
	event.preventDefault();
	let authorname = document.getElementById("search-bar2").value;

	searchByUsername(authorname);

}, false);


// Helper Method that creates an html elements detailing the post information given
function displayPost(post_id, title, subtitle, date, authorid, thumbnail, postText) {
	// if subtitle field was left empty, then set it to an empty string as to not display anything
	if (!subtitle) {
		subtitle = "";
	}
	// Grab Authors name to display
	// Make Request to post api to receive data and then display it
	url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/user/?id=' + authorid;
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// Grab user's name to display
			let authorname = data.username;
			let avatar = data.avatar;
			// Create post and insert it into main page
			let postHTML = "<article class=\"post\">\n" +
				"                <header>\n" +
				"                    <div class=\"title\">\n" +
				"                        <h2><a href=\"single.html?post=" + post_id + "\">" + title + "</a></h2>\n" +
				"                        <p>" + subtitle + "</p>\n" +
				"                    </div>\n" +
				"                    <div class=\"meta\">\n" +
				"                        <time class=\"published\">" + date + "</time>\n" +
				"                        <a href=\"#\" class=\"author\"><span class=\"name\">" + authorname + "</span><img src=\"" + avatar + "\" onerror=\"this.onerror=null; this.src='pics/default.png'\" alt=\"\" /></a>\n" +
				"                    </div>\n" +
				"                </header>\n" +
				"                <a href=\"single.html?post=" + post_id + "\" class=\"image featured\"><img src=\"" + thumbnail + "\" alt=\"\" /></a>\n" +
				"                <p>" + postText + "</p>\n" +
				"                <footer>\n" +
				"                    <ul class=\"actions\">\n" +
				"                        <li><a href=\"single.html?post=" + post_id + "\" class=\"button large\">Continue Reading</a></li>\n" +
				"                    </ul>\n" +
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

}

// Helper Method that creates an html elements detailing the post information given
function displaySearchResults(post_id, title, subtitle, date, authorname, avatar, thumbnail, postText) {
	// if subtitle field was left empty, then set it to an empty string as to not display anything
	if (!subtitle) {
		subtitle = "";
	}
	// Create post and insert it into main page
	let postHTML = "<article class=\"post\">\n" +
				"                <header>\n" +
				"                    <div class=\"title\">\n" +
				"                        <h2><a href=\"single.html?post=" + post_id + "\">" + title + "</a></h2>\n" +
				"                        <p>" + subtitle + "</p>\n" +
				"                    </div>\n" +
				"                    <div class=\"meta\">\n" +
				"                        <time class=\"published\">" + date + "</time>\n" +
				"                        <a href=\"#\" class=\"author\"><span class=\"name\">" + authorname + "</span><img src=\"" + avatar + "\" onerror=\"this.onerror=null; this.src='pics/default.png'\" alt=\"\" /></a>\n" +
				"                    </div>\n" +
				"                </header>\n" +
				"                <a href=\"single.html?post=" + post_id + "\" class=\"image featured\"><img src=\"" + thumbnail + "\" alt=\"\" /></a>\n" +
				"                <p>" + postText + "</p>\n" +
				"                <footer>\n" +
				"                    <ul class=\"actions\">\n" +
				"                        <li><a href=\"single.html?post=" + post_id + "\" class=\"button large\">Continue Reading</a></li>\n" +
				"                    </ul>\n" +
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

}

// When Next Page is pressed load the next 5 sequential posts
document.getElementById("next-button").addEventListener("click", function() {
	// Clear previous posts
	const old_posts = document.querySelectorAll('.post');
	old_posts.forEach(article => {
		article.remove();
	});
	generateFeed();

	// Enable Previous-Button
	$("#previous-button").removeClass("disabled");
	// TODO Disable this button if there are no more posts to show

})

// When Previous Page is pressed load the next 5 sequential posts
document.getElementById("previous-button").addEventListener("click", function() {
	// Clear previous posts
	const old_posts = document.querySelectorAll('.post');
	old_posts.forEach(article => {
		article.remove();
	});

	let id = lastPostID;
	for (id; id >= lastPostID - 5; id--) {
		// Make Request to post api to receive data and then display it
		let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?id=' + id;
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				// Parse Response for components
				let post_id = data.id;
				let date = data.post_date;
				let postText = data.post_text;
				let authorid = data.user_id;
				let extra = JSON.parse(data.extra);
				let title = extra.title;
				let subtitle = extra.subtitle;
				let thumbnail = extra.image;
				displayPost(post_id, title, subtitle, date, authorid, thumbnail, postText);

			})
			.catch (err => {
				// Display Error message
				console.log("Failure to retrieve post data");
				console.log(err);
			});
	}
	// Update post id tracker
	lastPostID = id;

	// Disable Previous button if there are no posts left to display
	if (lastPostID <= 0) {
		$("#previous-button").addClass("disabled");
	}
})

// Generates 5 posts and puts them on the main feed
function generateFeed() {
	let id = lastPostID + 1;
	for (id; id <= lastPostID + 6; id++) {
		// Make Request to post api to receive data and then display it
		let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?id=' + id;
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				// Parse Response for components
				let post_id = data.id;
				let date = data.post_date;
				let postText = data.post_text;
				let authorid = data.user_id;
				let extra = JSON.parse(data.extra);
				let title = extra.title;
				let subtitle = extra.subtitle;
				let thumbnail = extra.image;
				displayPost(post_id, title, subtitle, date, authorid, thumbnail, postText);

			})
			.catch (err => {
				// Display Error message
				console.log("Failure to retrieve post data");
				console.log(err);
			});
	}
	// Update post id tracker
	lastPostID = id - 1;
}


function searchByUsername(name) {
	let authorname = name;

	// Send Query which returns all posts made by that user
	url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?username=' + authorname;
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
			// Check if user has posts first TODO

			// If data is returned Remove all posts currently displayed
			const old_posts = document.querySelectorAll('.post');
			old_posts.forEach(article => {
				article.remove();
			});

			// Display each post returned
			for(var i = 0; i < data.length; i++) {
				console.log(data[i]);
				// Grab post data to display
				let id = data[i].id;
				let avatar = data[i].avatar;
				let extra = JSON.parse(data[i].extra);
				let title = extra.title;
				let subtitle = extra.subtitle;
				let thumbnail = extra.image;
				let date = data[i].post_date;
				let postText = data[i].post_text;

				// Add post to main feed
				displaySearchResults(id, title, subtitle, date, authorname, avatar, thumbnail, postText);
			}

		})
		.catch (err => {
			// Display Error message
			console.log("Search Failed");
			console.log(err);
		});

	// Remove message displaying previous search results
	document.getElementById("results").remove();
	// Add Message to top of feed "Displaying posts made by: username"
	let search_results = document.createElement('h3');
	search_results.id = "results";
	search_results.innerHTML = "Displaying Posts by: " + authorname;
	main.prepend(search_results);
}

// Creates some smaller mini posts to display on the sidebar
// Mini posts simply display their title and date
function generateSideBarFeed() {
	let id = lastPostID + 1;
	for (id; id <= lastPostID + 5; id++) {
		// Make Request to post api to receive data and then display it
		let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/post/?id=' + id;
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				// Parse Response for components
				let post_id = data.id;
				let date = data.post_date;
				let authorid = data.user_id;
				let extra = JSON.parse(data.extra);
				let title = extra.title;
				let image = extra.image;

				// Alternate between making medium and mini posts
				displayMiniPost(post_id, title, date, image);
			})
			.catch (err => {
				// Display Error message
				console.log("Failure to retrieve post data");
				console.log(err);
			});
	}
}

// Helper method to generate the mini post element and place it onto the sidebar
function displayMiniPost(post_id, title, date, thumbnail) {
	// Create post and insert it into main page
	let postHTML =
		"                        <article>\n" +
		"                            <header>\n" +
		"                                <h3><a href=\"single.html?post=" + post_id + "\">" + title + "</a></h3>\n" +
		"                                <time class=\"published\">" + date + "</time>\n" +
		"                            </header>\n" +
		"                            <a href=\"single.html?post=" + post_id + "\" class=\"image\"><img src=\"" + thumbnail + "\" alt=\"\" /></a>\n" +
		"                        </article>\n"

	// Add Post to bottom of feed
	let minipost = document.createElement('li');
	minipost.innerHTML = postHTML;
	// TODO prepend to sidebarlist
	let sidebar = document.getElementById("mini-post-list");
	sidebar.prepend(minipost);
}

// Helper method to generate the medium sized post element and place it onto the sidebar
function displayMedPost(post_id, title, date, thumbnail, authorid) {
	// Grab Authors name to display
	// Make Request to post api to receive data and then display it
	let url = 'http://web.cs.georgefox.edu/~zheath19/blog/API/user/?id=' + authorid;
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// Grab user's avatar to display
			let avatar = data.avatar;
			let posthtml =
				"                        <header>\n" +
				"                            <h3><a href=\"single.html?post=" + post_id + "\">" + title + "</a></h3>\n" +
				"                            <time class=\"published\">" + date + "</time>\n" +
				"                            <a href=\"#\" class=\"author\"><img src=\""+ avatar + "\" alt=\"\" /></a>\n" +
				"                        </header>\n" +
				"                        <a href=\"single.html?post=" + post_id + "\" class=\"image\"><img src=\"" + thumbnail + "\" alt=\"\" /></a>\n"

			let medpost = document.createElement("article");
			medpost.classList.add("mini-post");
			medpost.innerHTML = posthtml;
			let medpostsection = document.getElementById("med-posts");
			medpostsection.prepend(medpost);

		})
		.catch (err => {
			// Display Error message
			console.log("Failure to retrieve user's avatar'");
			console.log(err);
		});
}

