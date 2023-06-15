# b7a12-summer-camp-server_side-AkasDatta

## Harmony Academy Server
The Harmony Academy Server is a backend application built with Node.js and Express.js. It provides API endpoints for managing singing classes and user-related operations for the Harmony Academy website.

## Features
User authentication using JSONWebToken (JWT)
Role-based authorization for admin and instructor access
CRUD operations for classes
User management functionality
Cart management for storing class items

Create a .env file in the root directory of the project.
##
Add the following environment variables to the .env file:

makefile
Copy code
PORT=5000
DB_USER=<your-mongodb-username>
DB_PASS=<your-mongodb-password>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
Replace <your-mongodb-username>, <your-mongodb-password>, and <your-access-token-secret> with your MongoDB Atlas credentials and a secret key for JWT.
##
Start the server:

bash
Copy code
npm start
The server will start running on http://localhost:5000.
##
API Documentation
The server exposes the following API endpoints:

- POST /jwt: Generates a JSONWebToken for user authentication.

- GET /savedusers: Retrieves all saved users (admin access required).

- POST /savedusers: Creates a new user.

- PUT /users/instructors/:id: Updates a user's role to "instructor" (admin access required).

- GET /savedusers/admin/:email: Verifies if a user is an admin.

- GET /users/instructor/:email: Verifies if a user is an instructor.

- PATCH /savedusers/admin/:id: Updates a user's role to "admin" (admin access required).

- GET /classes: Retrieves all classes.

- POST /classes: Creates a new class (instructor access required).

- PUT /classes/approved/:id: Updates a class's status to "approved" (admin access required).

- PUT /classes/denied/:id: Updates a class's status to "denied" (admin access required).

- GET /carts: Retrieves all cart items for a user.

- GET /carts/:id: Retrieves a specific cart item by ID.

- POST /carts: Adds a new item to the cart.

- DELETE /carts/:id: Deletes a cart item.

- GET /users: Retrieves all users (admin access required).

- GET /instructors: Retrieves a list of instructors.

- POST /instructors: Creates a new instructor.
##
For detailed information about each endpoint, including request and response formats, authentication requirements, and role-based access, please refer to the API documentation or consult the codebase.
##
## Technologies Used
- Node.js
- Express.js
- MongoDB
- JSONWebToken (JWT)
- Contributing
Contributions to the Harmony Academy Server are welcome! If you find any issues or want to add new features, feel free to open a pull request.

## License
The Harmony Academy Server is open-source and released under the ....... License.

## Contact
For any inquiries or feedback, please contact Harmony Academy Support.
##
This README file provides a brief overview of the server application, installation instructions, API documentation, technologies used, contributing guidelines, and contact information. You can customize it further based on your specific requirements and project details.

If you need any further assistance, feel free to ask!