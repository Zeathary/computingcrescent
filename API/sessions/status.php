<?php

//join the session
session_start();

if(array_key_exists("username", $_SESSION))
{
    //echo the username
    //echo "Username: " . $_SESSION["username"] . "\n";
    echo json_encode(['username' => $_SESSION['username'], 'id' => $_SESSION['id'], 'avatar' => $_SESSION['avatar']]);
    http_response_code(200);
}
else
{
    //echo "No session!\n";
    http_response_code(403);
    echo json_encode(['error'=>true, 'message' => 'Not Logged In!']);
}

