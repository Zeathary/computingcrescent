<?php
function connect() {
    // pgsql = postgres, can also signify other dbs like mysql
    $dsn = 'pgsql:dbname=teach_yourself host=localhost';
    $username = 'user=dev';
    $pass = 'password=314dev';

    return new PDO ("pgsql:dbname=blog_zheath19 host=localhost password=zheath19 user=zheath19");
}


