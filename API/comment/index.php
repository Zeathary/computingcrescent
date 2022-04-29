<?php

require_once "../DBConnection.php";
require_once "../rest.php";

// Get the rest variable/data
$request = new RestRequest();

// Returns array of data sent with request
$reqVars = $request->getRequestVariables();

// Connect to database
$db = connect();

// If request method is GET, return all data related to requested comment
if ($request->isGet()) {
    // Validate Data: Comment Id was given
    if (array_key_exists("id", $reqVars)) {
        // Get comment id
        $id = $reqVars["id"];

        // Only query db if matching comment id is found
        if (!isUniqueId($id)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Select * from blog_comment where id = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$id]);

            // Get and print results from query
            $results = $query->fetch(PDO::FETCH_ASSOC);
            echo json_encode($results);

            // Return Success Status Code
            http_response_code(200);

        } else {
            // Can't find comment from id given
            // Send Error Message
            $response = array("error_text" => "comment does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else if (array_key_exists("post_id", $reqVars)) {
        // If post id is given return all comments associated with post along with the username of the author of each comment
        // Get post id
        $post = $reqVars["post_id"];

        // Write SQL query. ? is variable to be supplied at execution
        $sql = 'Select c.id, c.comment_text, c.comment_date, u.username, u.avatar from blog_comment as c join blog_user as u on c.user_id = u.id where c.post_id = ?';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute([$post]);

        // Get and print results from query
        $results = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);

        // Return Success Status Code
        http_response_code(200);
    }
    // If user_id was given return all comments that user has created
    else if (array_key_exists("user_id", $reqVars)) {
        $user = $reqVars["user_id"];

        // Write SQL query. ? is variable to be supplied at execution
        $sql = 'Select c.id, c.comment_text, c.comment_date, u.username, u.avatar from blog_comment as c join blog_user as u on c.user_id = u.id where c.user_id = ?';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute([$user]);

        // Get and print results from query
        $results = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);

        // Return Success Status Code
        http_response_code(200);
    }
    else {
        // No Comment Id found, Send Error Message
        $response = array("error_text" => "Comment ID was missing");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}
// If the request is POST, create a new comment with all given fields
else if ($request->isPost()) {
    // Check if all required args are given
    $required = array("user_id", "post_id", "comment_text", "comment_date");

    if (count(array_intersect_key(array_flip($required), $reqVars)) === count($required)) {
        // Grab all columns
        $user_id = $reqVars["user_id"];
        $post_id = $reqVars["post_id"];
        $text = $reqVars["comment_text"];
        $date = $reqVars["comment_date"];

        // Find max comment id
        $sql = 'Select max(id) from blog_comment';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute();

        $results = $query->fetch(PDO::FETCH_ASSOC);

        // Create new id for comment as one higher than max
        $id = $results["max"] + 1;


        // Check if user and post ID's exist
        if (!isUniqueUser($user_id) && !isUniquePost($post_id)) {
            // If date is in a valid format then attempt to add comment to db
            if (isValidDate($date)) {
                // Write SQL query. ? is variable to be supplied at execution
                $sql = 'Insert into blog_comment (id, user_id, post_id, comment_text, comment_date) values (:id, :user, :post, :text, :date)';

                // Run Query with given attributes
                $query = $db->prepare($sql);
                $query->execute(array(':id' => $id, ':user' => $user_id, ':post' => $post_id, ':text' => $text, ':date' => $date));

                // Get and print results from query
                //$results = $query->fetch(PDO::FETCH_ASSOC);

                // Print Successful Message
                echo "Comment created with id: " . $id;

                // Set http code to 202 Accepted
                http_response_code(202);

            } else {
                // Invalid date
                // Send Error Message
                $response = array("error_text" => "Given Date is incorrectly formatted");

                // Set standard response status code (400 = bad request)
                http_response_code(400);

                // Print error message array as json string
                echo json_encode($response);
            }
        } else {
            // Invalid user or post id
            // Send Error Message
            $response = array("error_text" => "Given User or Post does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }


    } else {
        // Not all comment fields were supplied
        // Send Error Message
        $response = array("error_text" => "Missing fields, comment could not be added");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}
// TODO If the request is PUT, update comment
// If the request is DELETE, delete a comment
else if($request->isDelete()) {
    // Validate Data: Ensure a comment_id was given
    if (array_key_exists("id", $reqVars)) {
        // Get comment id
        $id = $reqVars["id"];

        // Determine if comment with specified id is in database
        if (!isUniqueId($id)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Delete from blog_comment where id = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$id]);

            // Print Comment Deleted
            $response = array("error" => false, "message" => "Comment Deleted");
            echo json_encode($response);

            http_response_code(200);

        } else {
           // comment not in database
            $response = array("error_text" => "comment does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else {
        // Send Error Message
        $response = array("error_text" => "comment ID was missing");

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

// Determines if given comment id is unique or already in database
// Returns True if comment id is unique
function isUniqueId($comment_id) {
    $valid = true;
    $db = connect();

    $check = "Select id from blog_comment where id = ?";

    // Run Query
    $query = $db->prepare($check);
    $query->execute([$comment_id]);

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

// Determines if given post id is unique or already in database
// Returns True if post id is unique
function isUniquePost($post_id) {
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