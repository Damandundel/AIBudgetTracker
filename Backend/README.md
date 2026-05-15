# AI Budget Tracker Backend

This is the backend part of the AI Budget Tracker project.

## Main backend features

- User registration
- User login
- JWT authentication
- Add income and expenses
- Edit transactions
- Delete transactions
- Filter and sort transactions
- Monthly budget system
- Dashboard statistics
- Simple AI saving suggestions
- Admin statistics
- Real-time notifications with WebSockets

## Technologies used

- Node.js
- Express.js
- WebSocket
- JWT
- bcrypt
- JSON file storage

## How to start the project

First install the packages:

npm install

Then start the server:

npm start

The backend will run on:

http://localhost:5000

## API endpoints

### Authentication

POST /api/auth/register  
POST /api/auth/login  

### Budget

POST /api/budget  
GET /api/budget  

### Transactions

POST /api/transactions  
GET /api/transactions  
PUT /api/transactions/:id  
DELETE /api/transactions/:id  

### Dashboard

GET /api/dashboard  

### AI Suggestions

POST /api/ai/suggestions  
GET /api/ai/suggestions  

### Admin

GET /api/admin/stats  

## WebSocket connection

The frontend connects to:

ws://localhost:5000

After connecting, the frontend should send:

{
    "type": "connect_user",
    "userId": "USER_ID_HERE"
}

The backend can then send real-time budget alerts and AI status updates.