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

- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `POST /logout/:userId`: Log out a user.
- `GET /users/:userId`: Retrieve user details.
- `POST /search`: Search for a mentor by expertise.
- `POST /book/:menteeId`: Create a booking for a mentee.
- `GET /bookings/:bookingId`: Retrieve a booking by its ID.
- `GET /users/:userId/bookings`: Retrieve bookings associated with a specific user.
- `PATCH /users/:userId/bookings/:bookingId/reschedule`: Reschedule a booking by a user.
- `PATCH /users/:userId/bookings/:bookingId/cancel`: Cancel a booking by a user.
- `PATCH /users/:userId/bookings/:bookingId/accept`: Accept a booking by a mentor.
- `PATCH /users/:userId/bookings/:bookingId/reject`: Reject a booking by a mentor.

## Example

Request:
    `curl -X http://<CANISTER_ID>.localhost:8000/register -H 'Accept: application/json -d '{"username": "John", "password": "john1234", "role": "mentor", "expertise": "ICP"}'`

Response:
    `{"message": "User registered successfully", "user": {"id": "fa42cef2-5062-4c4c-9b18-e720213ce19b", "role": "mentor", "expertise": "ICP", "username": "John", "password": "john1234", createdAt: "2024-04-03:00:00...", "updatedAt": "null"}}`

