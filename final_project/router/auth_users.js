const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //write code to check is the username is valid
    let existingUsers = users.filter(user => user.username === username);
    return existingUsers.length > 0;

}


const authenticatedUser = (username, password) => { //returns boolean
    //check if username and password match the one we have in records.
    let validCredentials = users.filter(
        user => user.username === username && user.password === password
    );
    return validCredentials.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            { data: password },
            'access',
            { expiresIn: 60 * 60 }
        );
        // store accessToken and username in session
        req.session.authorization = { accessToken, username };

        return res.status(200).send(`User ${username}, was successfully logged in.`);
    } else {
        // if login credentials are incorrect
        return res.status(208).json(
            { message: "Invalid login: check username & password" }
        );

    }



});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;

    let { username } = req.session.authorization;
    let book = books[isbn];

    if (username) {
        // if the requested book exists
        if (book) {
            book["reviews"][username] = review;
            books[isbn] = book;
            res.send(JSON.stringify(book, null, 4));
        } else {
            // if the requested book doesn't exist
            return res.status(404)
                .json({ message: "The requested book does not exist" });
        }
    } else {
        // if the user is not authenticated
        return res.status(404)
            .json({ message: "To post a review, please login first." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
