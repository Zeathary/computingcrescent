<?php

require_once "../DBConnection.php";
require_once "../rest.php";

$request = new RestRequest();

$reqVars = $request->getRequestVariables();

$db = connect();
if ($request->isPost()) {
    // Check if all required args are given
    $required = array("username", "password");

    if (count(array_intersect_key(array_flip($required), $reqVars)) === count($required)) {
        $uname = $reqVars['username'];
        $pass = $reqVars['password'];

        // Check if user is in database
        // Retrieve hashed password from db
        $sql = 'Select * from blog_user where username = ?';

        // Run Query
        $query = $db->prepare($sql);
        $query->execute([$uname]);

        // Get and print results from query
        $results = $query->fetch(PDO::FETCH_ASSOC);
        json_encode($results);

        if (count($results)) {
            $hashed = $results["password"];

            // If password is valid start session and redirect to home page
            if (password_verify($pass, $hashed)) {
                // Create new session
                session_start();
                // Keep Track of user data in session
                $_SESSION["username"] = $uname;
                $_SESSION["id"] = $results["id"];
                $_SESSION["avatar"] = $results["avatar"];
                echo json_encode(['username' => $uname, 'message' => 'Logged In!']);
                http_response_code(200);

            } else {
                http_response_code(351);
                echo json_encode(['error' => true, 'error_message' => 'Incorrect Username or Password']);
            }
        } else {
            http_response_code(351);
            echo json_encode(['error' => true, 'error_message' => 'User does not exist']);
        }

    } else {
        http_response_code(400);
        echo json_encode(['error' => true, 'error_message' => 'Username or Password Missing']);
    }

} else {
    //header("Location: ../../View/login.html");
    http_response_code(400);
    echo json_encode(['error' => true, 'error_message' => 'Use Post Request']);
}

//if ($request->isPost()) {
//    // Redirect to home page
//    header("Location: index.html");
//    // Check if user is in database
//    // Retrieve hashed password from db
//    $sql = "Select * from user where username = ?";
//    $start = $db->prepare($sql);
//    $start = $start->execute($reqVars['password']);
//    $result = $start->fetch(PDO::FETCH_ASSOC);
//
//    // If Password is returned then we know the user exists
//    if (count($result)) {
//        $hashed = $result['password'];
//        $password = $reqVars['password'];
//
//        // If password is valid start session and redirect to home page
//        if (password_verify($password, $hashed)) {
//            // Create new session
//            session_start();
//            // Keep Track of user data in session
//            $_SESSION["username"] = "User";
//
//            // Redirect to home page
//            header("Location: login.html");
//
//        } else {
//            // Password is incorrect: Redirect back to log in back with error message
//            header("Location: login.html?error=User Name is required");
//
//        }
//    }
//
//
//
//}
//function validate($data) {
//    $data = trim($data);
//    $data = stripslashes($data);
//    $data = htmlspecialchars($data);
//    return $data;
//}