const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        // if credentials are missing
        return res.status(404).json({ message: "Please provide username AND password to register." });
    } else {
        // if the user provided credentials
        if (isValid(username)) {
            // if username exists already
            return res.status(404).json({ message: "Username exists already. Please proceed to login." });
        } else {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Please log in" });
        }

    }


});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

    new Promise((resolve, reject) => {
        let result = books;
        if (result) {
            resolve(result);
        } else {
            reject("Promise rejected!");
        }
    }).then(result => {
        return res.send(JSON.stringify(books, null, 4));
    }).catch((error) => {
        console.log("Error: GET '/'");
        res.status(500).json({ message: "There was an error retrieving book list." });
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Promise rejected!");
        }
    })
        .then(book => res.send(JSON.stringify(book, null, 4)))
        .catch(error => {
            console.log("Error: GET '/isbn/:isbn'");
            return res.status(404)
                .json({ message: "The requested book does not exist" });
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let searchByAuthor = new Promise((resolve, reject) => {
        const author = req.params.author;
        let filteredBooks = Object.values(books)
            .filter(book => book["author"] === author);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        }else{
            reject("Error");
        }
    });
    searchByAuthor.then((filteredBooks) => {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    }).catch((error) => {
        console.log(error+": GET '/author/:author'");
        return res.status(404).json({ message: "Can't find any books from that author." });
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    let filteredBooks = Object.values(books)
        .filter((book) => book["title"] === title);
    if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.status(404).json({ message: "Can't find a book with that title." });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const reviews = book.reviews;
        res.send(JSON.stringify(reviews, null, 4));
    }
    else {
        return res.status(404).json({ message: "Can't find any book with that isbn." });
    }
});

module.exports.general = public_users;
