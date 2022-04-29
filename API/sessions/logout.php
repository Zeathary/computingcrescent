<?php
//join the session
session_start();

//destroy the session
session_destroy();

echo json_encode(['message' => 'Logout Successful']);