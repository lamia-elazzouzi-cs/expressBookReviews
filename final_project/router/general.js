const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404)
            .json({ message: "The requested book does not exist" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    let filteredBooks = Object.values(books)
        .filter(book => book["author"] === author);

    if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        return res.status(404).json({ message: "Can't find any books from that author." });
    }
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
