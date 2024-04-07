# books_review

This is a server that manages books reviews. User can create, update, delete and view reviews of books in a system.

User management is not implemented here.

## Installation

To install the project, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the project using `dfx start --host 127.0.0.1:8000 --clean --background` then `dfx deploy`.

## Usage

WHEN the project is running, you can make HTTP requests to the exposed endpoints.

## API Endpoints

- `POST /book`: Creates a new book.
- `GET /books`: Retrieve all books.
- `GET /books/:id`: Retrieve book (indicated by id) details.
- `PUT /books/:id`: Updates book (indicated by id) details.
- `DELETE /books/:id`: Removes book.
- `POST /review`: Creates a new review for a book.
- `GET /reviews`: Retrieve all reviews.
- `GET /reviews/:id`: Retrieve review (indicated by id) details.
- `PUT /reviews/:id`: Updates review (indicated by id) details.
- `DELETE /reviews/:id`: Removes review.

## Example

Request:
    `curl -X http://<CANISTER_ID>.localhost:8000/book -H 'Accept: application/json -d '{"author" : "George Orwell", "title": "1984", "description": "Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian..."}'`

Response:
    `{"id": "4295fb17-a5a6-4ee0-bf8f-4e0dcc7317f3","author" : "George Orwell", "title": "1984", "description": "Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian..."}`
