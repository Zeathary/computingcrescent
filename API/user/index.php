<?php

require_once "../DBConnection.php";
require_once "../rest.php";

// Get the rest variable/data
$request = new RestRequest();

// Returns array of data sent with request
$reqVars = $request->getRequestVariables();

// Connect to database
$db = connect();

// If request method is GET, return all data related to requested user
if ($request->isGet()) {
    // Validate Data: Ensure a user_id  or username was sent
    if (array_key_exists("id", $reqVars)) {
        // Get user id
        $id = $reqVars["id"];

        // Only query db if matching cust_id is found
        if (!isUniqueId($id)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Select * from blog_user where id = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$id]);

            // Get and print results from query
            $results = $query->fetch(PDO::FETCH_ASSOC);
            echo json_encode($results);

            http_response_code(200);

        } else {
            // Can't find user from id given
            // Send Error Message
            $response = array("error_text" => "user does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else if (array_key_exists("username", $reqVars)) {
        // Get username
        $username = $reqVars["username"];

        // Only query if username is found within the db
        if (!isUniqueName($username)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Select * from blog_user where username = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$username]);

            // Return status code of 200 for success
            http_response_code(200);

            // Get and print results from query
            $results = $query->fetch(PDO::FETCH_ASSOC);
            echo json_encode($results);
        } else {
            // Can't find user from email given
            // Send Error Message
            $response = array("error_text" => "user does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else {
        // Missing Parameters
        // Send Error Message
        $response = array("error_text" => "ID or username was missing");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}
// If the request is POST, create a new user with all given fields
else if ($request->isPost()) {
    // Check if all required args are given

    if (array_key_exists("username", $reqVars) && array_key_exists("password", $reqVars)) {
        // Grab all columns
        $username = $reqVars["username"];
        $password = $reqVars["password"];

        // hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Find max post id
        $sql = 'Select max(id) from blog_user';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute();

        $results = $query->fetch(PDO::FETCH_ASSOC);

        // Create new id for post as one higher than max
        $id = $results["max"] + 1;

        // If given username is unique then add user to db
        if (isUniqueName($username)) {
            // If avatar is supplied, then add that into the database along with other values
            if (array_key_exists("avatar", $reqVars)) {
                $avatar = $reqVars['avatar'];

                // Write SQL query. ? is variable to be supplied at execution
                $sql = 'Insert into blog_user (id, username, password, avatar) values (:id, :username, :password, :avatar)';

                // Run Query
                $query = $db->prepare($sql);
                $query->execute(array(':id' => $id, ':username' => $username, ':password' => $hashed_password, ':avatar' => $avatar));
            } else {
                // Write SQL query. ? is variable to be supplied at execution
                $sql = 'Insert into blog_user (id, username, password) values (:id, :username, :password)';

                // Run Query
                $query = $db->prepare($sql);
                $query->execute(array(':id' => $id, ':username' => $username, ':password' => $hashed_password));
            }


            // Get and print results from query
            //$results = $query->fetch(PDO::FETCH_ASSOC);

            // Set http code to 202 Accepted
            http_response_code(202);

            // Print Success Message
            echo json_encode(['username' => $username, 'message' => 'Successfully Created']);

        } else {
            // Username not unique
            // Send Error Message
            $response = array("error_text" => "Username is taken");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else {
        // Not all user fields were supplied
        // Send Error Message
        $response = array("error_text" => "Missing fields, user could not be added");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}
else if($request->isDelete()) {
    // Validate Data: Ensure a user_id  or username was sent
    if (array_key_exists("id", $reqVars)) {
        // Get user id
        $id = $reqVars["id"];

        // Only query db if matching id is found
        if (!isUniqueId($id)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Delete from blog_user where id = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$id]);

            // Print Delete message
            echo json_encode(array("error" => false, "message" => "Account deleted"));

            http_response_code(200);

        } else {
            // Can't find user from id given
            // Send Error Message
            $response = array("error_text" => "user does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else if (array_key_exists("username", $reqVars)) {
        // Get username
        $username = $reqVars["username"];

        // Only query if username is found within the db
        if (!isUniqueName($username)) {
            // Write SQL query. ? is variable to be supplied at execution
            $sql = 'Delete from blog_user where username = ?';

            // Run Query
            $query = $db->prepare($sql);
            $query->execute([$username]);

            // Return status code of 200 for success
            http_response_code(200);

            // Print Delete message
            echo json_encode(array("error" => false, "message" => "Account deleted"));

        } else {
            // Can't find user from email given
            // Send Error Message
            $response = array("error_text" => "user does not exist");

            // Set standard response status code (400 = bad request)
            http_response_code(400);

            // Print error message array as json string
            echo json_encode($response);
        }

    } else {
        // Missing Parameters
        // Send Error Message
        $response = array("error_text" => "ID or username was missing");

        // Set standard response status code (400 = bad request)
        http_response_code(400);

        // Print error message array as json string
        echo json_encode($response);
    }
}

// Determines if given id is unique or already in database
// Returns True if id is unique
function isUniqueId($id) {
    $valid = true;
    $db = connect();

    $check = "Select id from blog_user where id = ?";

    // Run Query
    $query = $db->prepare($check);
    $query->execute([$id]);

    // Get results from query
    $results = $query->fetch(PDO::FETCH_ASSOC);

    // If any rows are returned then email is not unique
    if ($results) {
        $valid = false;
    }

    return $valid;
}

// Determines if given username is unique or already in database
// Returns True if name is unique
function isUniqueName($name) {
    $valid = true;
    $db = connect();

    $check = "Select username from blog_user where username = ?";

    // Run Query
    $query = $db->prepare($check);
    $query->execute([$name]);

    // Get results from query
    $results = $query->fetch(PDO::FETCH_ASSOC);

    // If any rows are returned then email is not unique
    if ($results) {
        $valid = false;
    }

    return $valid;
}
