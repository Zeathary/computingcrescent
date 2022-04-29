<?php

require_once "../DBConnection.php";
require_once "../rest.php";

// Get the rest variable/data
$request = new RestRequest();

// Returns array of data sent with request
$reqVars = $request->getRequestVariables();

// Connect to database
$db = connect();

// If request method is GET, return all data related to requested post
if ($request->isGet()) {
    // Validate Data: post id was given
    if (array_key_exists("id", $reqVars)) {
        // Get post id
        $id = $reqVars["id"];

        // Only query db if matching post id is found
        if (!isUniqueId($id)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Select * from post where id = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$id]);

            // Get and print results from query
            $results = $query->fetch(PDO::FETCH_ASSOC);
            echo json_encode($results);

            // Return Success Status Code
            http_response_code(200);

        } else {
            // Can't find post from id given
            // Send Error Message
            $response = array("error_text" => "post does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } // If username is given return all posts created by this user
    else if (array_key_exists("username", $reqVars)) {
        // Get username
        $name = $reqVars["username"];

        // Write SQL query. ? is variable to be supplied at execution
        $sql = 'Select p.id, p.user_id, p.post_date, p.post_text, p.extra, b.username, b.avatar from post p join blog_user b on p.user_id = b.id where b.username = ?';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute([$name]);

        // Get and print results from query
        $results = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);

        // Return Success Status Code
        http_response_code(200);
    }
    else {
        // No post Id found, Send Error Message
        $response = array("error_text" => "post ID or username not supplied was missing");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}
// If the request is POST, create a new post with all given fields
else if ($request->isPost()) {
    // Check if all required args are given
    $required = array("user_id", "post_date", "post_text", "extra");

    if (count(array_intersect_key(array_flip($required), $reqVars)) === count($required)) {
        // Grab all columns
        $user_id = $reqVars["user_id"];
        $date = $reqVars["post_date"];
        $text = $reqVars["post_text"];
        $extra = json_encode($reqVars["extra"]);

        // Find max post id
        $sql = 'Select max(id) from post';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute();

        $results = $query->fetch(PDO::FETCH_ASSOC);

        // Create new id for post as one higher than max
        $id = $results["max"] + 1;


        // Check if user ID is within db
        if (!isUniqueUser($user_id)) {
            // If date is in a valid format then attempt to add post to db
            if (isValidDate($date)) {
                // Write SQL query. ? is variable to be supplied at execution
                $sql = 'Insert into post (id, user_id, post_text, post_date, extra) values (:id, :user, :text, :date, :extra)';

                // Run Query with given attributes
                $query = $db->prepare($sql);
                $query->execute(array(':id' => $id, ':user' => $user_id, ':text' => $text, ':date' => $date, ':extra' => $extra));

                // Get and print results from query
                $results = $query->fetch(PDO::FETCH_ASSOC);
                echo $results;
                // Print Successful Message
                echo "Post created with id: " . $id;

                // Set http code to 202 Accepted
                http_response_code(202);

            } else {
                // Invalid date
                // Send Error Message
                $response = array("error_text" => "Given Date is incorrectly formatted");
                echo $date;

                // Set standard response status code (400 = bad request)
                http_response_code(400);

                // Print error message array as json string
                echo json_encode($response);
            }
        } else {
            // Invalid user or post id
            // Send Error Message
            $response = array("error_text" => "Given User does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else {
        // Not all post fields were supplied
        // Send Error Message
        $response = array("error_text" => "Missing fields, post could not be added");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}
// If the request is DELETE, delete a post
else if($request->isDelete()) {
    // Validate Data: Ensure a post_id was given
    if (array_key_exists("id", $reqVars)) {
        // Get post id
        $id = $reqVars["id"];

        // Determine if post with specified id is in database
        if (!isUniqueId($id)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Delete from post where id = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$id]);

            // Print post Deleted
            echo json_encode(array("error" => false, "message" => "post deleted"));

            http_response_code(200);

        } else {
            // post not in database
            $response = array("error_text" => "post does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else {
        // Send Error Message
        $response = array("error_text" => "post ID was missing");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}

// Helper Function that determines if given date is in the format: YYYY-MM-DD
// Returns true if Date is unique and valid
function isValidDate($date) {
    $valid = false;

    // Determine if date is in correct format
    if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date, $parts) == true) {
        $year  = $parts[1];
        $month = $parts[2];
        $day   = $parts[3];

        // Use php's checkdate function
        if (checkdate($month, $day, $year) === True) {
            $valid =  true;
        }
    }

    return $valid;
}

// Determines if given post id is unique or already in database
// Returns True if post id is unique
function isUniqueId($post_id) {
    $valid = true;
    $db = connect();

    $check = "Select id from post where id = ?";

    // Run Query
    $query = $db->prepare($check);
    $query->execute([$post_id]);

    // Get results from query
    $results = $query->fetch(PDO::FETCH_ASSOC);
    // If any rows are returned then id is not unique
    if ($results) {
        $valid = false;
    }

    return $valid;
}

// Determines if given user id is unique or already in database
// Returns True if user id is unique
function isUniqueUser($user_id) {
    $valid = true;
    $db = connect();

    $check = "Select id from blog_user where id = ?";

    // Run Query
    $query = $db->prepare($check);
    $query->execute([$user_id]);

    // Get results from query
    $results = $query->fetch(PDO::FETCH_ASSOC);
    // If any rows are returned then id is not unique
    if ($results) {
        $valid = false;
    }

    return $valid;
}

