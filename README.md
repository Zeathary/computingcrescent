# Final Project

Commit all the code for your final project to this repository. Include a description of your REST API here in the README.md file.

User Table:
| Operation | Behavior| Parameters | Response |  Example |
|-------|---------------|----------------------|---|---|
| C     |   Creates new user    |  username, password, avatar(Optional) | http status - 202 if the user was successfully added otherwise 400, error_text - a message describing the error.  |  Success: “User Created” {“error_text”: ”username is taken”} |
| R     |   Returns username and hashed password of user |        Username or id           | HTTP status - 200 if the user was found along with JSON data of all its variables otherwise 400, error_text - a message describing the error.  | Success: {“username”:””, “password”:””} {“error_text”:”User does not exist”}  |  
| D     |  Deletes specified user    |       username            | HTTP status - 200 if the user was deleted otherwise 400, error_text - a message describing the error.  | Success: “User Deleted” {“error_text”: ”username does not exist”} |

Comment Table
| Operation | Behavior| Parameters | Response |  Example |
|-------|---------------|----------------------|---|---|
| C     |   Creates new comment | User_id, post_id, comment_text, comment_date (Date should be in format: yyyy-mm-dd)  |  http status - 202 if the user was successfully added otherwise 400, error_text - a message describing the error. | Success: “Comment Created”{“error_text”: "Missing parameters”} |
| R     |   Returns data associated with this comment Or if a post_id is given returns all associated comments   |           id or post_id        |HTTP status - 200 if the user was found along with JSON data of all its variables otherwise 400, error_text - a message describing the error.|  Success: {“id”:””, “user_id”:””, “post_id”:””, “comment_text”:”comment_date”} Success with post_id supplied: [{“id”:””, “comment_text”:””, “comment_date”:””, “username”:””}] {“error_text”:”comment does not exist"}|
| D     |  Deletes the comment    |         id          | HTTP status - 200 if the comment was deleted otherwise 400, error_text - a message describing the error.  | Success: “Comment Deleted” {“error_text”:” comment does not exist”}|

Post Table
| Operation | Behavior| Parameters | Response |  Example |
|-------|---------------|----------------------|---|---|
| C     |   Creates new post    |   User_id, post_date, post_text, extra (Date should be in format: yyyy-mm-dd) Extra: list of json data containing a title, subtitle, and a link to an image | http status - 202 if the user was successfully added otherwise 400, error_text - a message describing the error.  | Success: “Post Created” {“error_text”:”Missing parameters”}|
| R     |   Returns Data with associated post.If user_id is supplied all posts created by that user are returned|       id or user_id            | HTTP status - 200 if the post was found along with JSON data of all its variables otherwise 400, error_text - a message describing the error.  | Success: {“id”:””, “user_id”:””, “post_date”:””, “post_text”:”extra”} {“error_text”:”post does not exist”} |
| U     |    Updates post info  |        Id, User_id, post_date, post_text, extra           |  HTTP status - 200 if the post was updated otherwise 400, error_text - a message describing the error. |  Success: “Post Updated” {“error_text”:”Missing parameters”}|
| D     |   Deletes the post   |        id           |  HTTP status - 200 if the post was deleted otherwise 400, error_text - a message describing the error. | Success: “Post Deleted” {“error_text”:” comment does not exist”}  |
