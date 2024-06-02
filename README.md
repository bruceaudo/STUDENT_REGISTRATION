# Student Registration System

Welcome to the **Student Registration System**! This project provides a simple API for registering new students. It's built using Node.js, Express.js, and MongoDB.

## Features

- **Registration**: Users can register new students by providing their name, email address, and registration number.
- **Validation**: Input fields are validated to ensure they are not empty and that the email address is valid.
- **Duplicate Check**: The system checks whether the provided email address or registration number is already in use.
- **MongoDB Integration**: Data is stored in a MongoDB database.

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/student-registration-system.git


2. **Install Dependencies**:
   ```bash
   cd student-registration-system
   npm install
   ```


 3. **Set Environment Variables**:
    Create a .env file in the root directory and add the following variables:
    ```bash
    PORT=3000
    MONGODB_URI=<your MongoDB connection URI>
    ```
    Replace <your MongoDB connection URI> with the connection string for your MongoDB Atlas cluster.

  4. **Start the Server**:
     ```bash
     npm start
     ```
      The server will start running on the port specified in the .env file (default is port 3000).

## API Endpoints

#### POST /register: 
Register a new student.

**Request Body**:
- **name**: Name of the student (required)
- **email_address**: Email address of the student (required)
- **registration_number**: Registration number of the student (required)

**Example**:
```json
{
  "name": "John Doe",
  "email_address": "john.doe@example.com",
  "registration_number": "20240001"
}
```
Note: All responses are in JSON format.

## Dependencies

- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling for Node.js.
- **email-validator**: Email validation library.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
