import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';

/**
 * Represents a book that can be reviewed.
 */
class Book {
    id: string;
    author: string;
    title: string;
    description: string;
    /**
     * Initializes the object with the provided id, author, title, and description.
     *
     * @param {string} id - The unique identifier of the object.
     * @param {string} author - The author of the object.
     * @param {string} title - The title of the object.
     * @param {string} description - The description of the object.
     */    
    constructor(id: string, author: string, title: string, description: string) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.description = description;
    }
}

/**
 * Represents a review of a book.
 */
class Review {
    id: string;
    bookId: string;
    review: string;
    rating: number;

    /**
     * Initializes the object with the provided id, bookId, review, and rating.
     *
     * @param {string} id - The unique identifier of the object.
     * @param {string} bookId - The identifier of the book that was reviewed.
     * @param {string} review - The review of the book.
     * @param {number} rating - The rating of the book.
     */
    constructor(id: string, bookId: string, review: string, rating: number) {
        this.id = id;
        this.bookId = bookId;
        this.review = review;
        this.rating = rating;
    }
}

/**
 * `reviewsStorage` - it's a key-value datastructure that is used to store book reviews.
 * {@link StableBTreeMap} is a self-balancing tree that acts as a durable data storage that keeps data across canister upgrades.
 * For the sake of this contract we've chosen {@link StableBTreeMap} as a storage for the next reasons:
 * - `insert`, `get` and `remove` operations have a constant time complexity - O(1)
 * - data stored in the map survives canister upgrades unlike using HashMap where data is stored in the heap and it's lost after the canister is upgraded
 *
 * Brakedown of the `StableBTreeMap(string, Review)` datastructure:
 * - the key of map is a `reviewId`
 * - the value in this map is a review itself `Review` that is related to a given key (`reviewId`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 */
const reviewsStorage = StableBTreeMap<string, Review>(0);

/**
 * `booksStorage` - it's a key-value datastructure that is used to store books.
 * 
 * Brakedown of the `StableBTreeMap(string, Book)` datastructure:
 * - the key of map is a `bookId`
 * - the value in this map is a book itself `Book` that is related to a given key (`bookId`)
 *
 * Constructor values:
 * 1) 1 - memory id where to initialize a map.
 */
const booksStorage = StableBTreeMap<string, Book>(1);

const BAD_REQUEST = 400;
const NOT_FOUND = 404;

export default Server(() => {
    const app = express();
    app.use(express.json());
 
    app.post("/book", (req, res) => {
        /**
         * Adds a new book.
         * 
         * @param {string} req.body.author - author of the book
         * @param {string} req.body.title - title of the book
         * @param {string} req.body.description - description of the bookor
         */
       const { author, title, description } = req.body;
       const book: Book =  {id: uuidv4(), author: author, title: title, description: description};
       booksStorage.insert(book.id, book);
       res.json(book);
    });
 
    app.get("/books", (req, res) => {
       /**
        * Returns all books.
        */
       res.json(booksStorage.values());
    });
 
    app.get("/books/:id", (req, res) => {
       /**
        * Returns a book by id.
        * 
        * @param {string} req.params.id - id of the book
        */
       const bookId = req.params.id;
       const bookOpt = booksStorage.get(bookId);
       if ("None" in bookOpt) {
          res.status(NOT_FOUND).send(`the message with id=${bookId} not found`);
       } else {
          res.json(bookOpt.Some);
       }
    });
 
    app.put("/books/:id", (req, res) => {
       /**
        * Updates a book by id.
        * 
        * @param {string} req.params.id - id of the book
        * @param {string} req.body.author - author of the book
        * @param {string} req.body.title - title of the book
        * @param {string} req.body.description - description of the book
        */
       const bookId = req.params.id;
       const bookOpt = booksStorage.get(bookId);
       if ("None" in bookOpt) {
          res.status(BAD_REQUEST).send(`couldn't update a message with id=${bookId}. message not found`);
       } else {
          const book = bookOpt.Some;
          const { author, title, description } = req.body;
          const updatedBook = {...book, author: author, titiel: title, decription: description };
          booksStorage.insert(book.id, updatedBook);
          res.json(updatedBook);
       }
    });
 
    app.delete("/messages/:id", (req, res) => {
       /**
        * Deletes a book by id.
        * 
        * @param {string} req.params.id - id of the book
        */
       const bookId = req.params.id;
       const deletedBook = booksStorage.remove(bookId);
       if ("None" in deletedBook) {
          res.status(BAD_REQUEST).send(`couldn't delete a book with id=${bookId}. Book not found`);
       } else {
          res.json(deletedBook.Some);
       }
    });

    app.post("/review", (req, res) => {
       /**
        * Adds a review for a book.
        * 
        * @param {string} req.body.bookId - id of the book
        * @param {string} req.body.review - review
        * @param {number} req.body.rating - rating
        */
       const { bookId, review, rating } = req.body;
       const reviewId = uuidv4();
       const reviewObj: Review = {id: reviewId, bookId, review, rating};
       reviewsStorage.insert(reviewId, reviewObj);
       res.json(reviewObj);
    });

    app.get("/reviews", (req, res) => {
       /**
        * Returns all reviews.
        */
       res.json(reviewsStorage.values());
    });

    app.get("/reviews/:id", (req, res) => {
       /**
        * Returns a review by id.
        * 
        * @param {string} req.params.id - id of the review
        */
       const reviewId = req.params.id;
       const reviewOpt = reviewsStorage.get(reviewId);
       if ("None" in reviewOpt) {
          res.status(NOT_FOUND).send(`the review with id=${reviewId} not found`);
       } else {
          res.json(reviewOpt.Some);
       }
    });

    app.put("/reviews/:id", (req, res) => {
       /**
        * Updates a review by id.
        * 
        * @param {string} req.params.id - id of the review
        * @param {string} req.body.bookId - id of the book
        * @param {string} req.body.review - review
        * @param {number} req.body.rating - rating
        */
       const reviewId = req.params.id;
       const reviewOpt = reviewsStorage.get(reviewId);
       if ("None" in reviewOpt) {
          res.status(BAD_REQUEST).send(`couldn't update a review with id=${reviewId}. message not found`);
       } else {
          const reviewFromStorage = reviewOpt.Some;
          const { bookId, review, rating } = req.body;
          const updatedReview = {...reviewFromStorage, bookId: bookId, review: review, rating: rating };
          reviewsStorage.insert(reviewFromStorage.id, updatedReview);
          res.json(updatedReview);
       }
    });

    app.delete("/reviews/:id", (req, res) => {
       /**
        * Deletes a review by id.
        * 
        * @param {string} req.params.id - id of the review
        */
       const reviewId = req.params.id;
       const deletedReview = reviewsStorage.remove(reviewId);
       if ("None" in deletedReview) {
          res.status(BAD_REQUEST).send(`couldn't delete a review with id=${reviewId}. review not found`);
       } else {
          res.json(deletedReview.Some);
       }
    });
 
    return app.listen();
 });
