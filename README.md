# School Management API

This is a RESTful API built with Node.js, Express.js, and MySQL for managing school data. The API allows users to add new schools and retrieve a list of schools sorted by proximity to a specified location.

## Features

- Add new schools with their name and geographical coordinates (latitude and longitude).
- Retrieve a list of schools sorted by proximity to a user-specified location.
- Input validation for latitude and longitude.
- Error handling for various scenarios.
## API Endpoints
 - #### Add School API:
   - Endpoint: /addSchool
   - Method: POST
   - Payload: Includes name, address, latitude, and longitude.
- #### List School API:
   - Endpoint: /listSchools
   - Method: GET
   - Parameters: User's latitude and longitude.
   - For Example: /listSchools?latitude=2&longitude=-2&limit=10&offset=0
   - limit : This parameter is totally optional 

## Technologies Used

- Node.js
- Express.js
- MySQL
- dotenv (for environment variable management)

## Prerequisites

- Node.js (v12 or higher)
- MySQL Server
- Postman or any API testing tool (optional)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aktmishra/schoolApi.git
   cd school-api
   npm install
   npm run dev