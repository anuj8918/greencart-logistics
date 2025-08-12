GreenCart Logistics - MERN Stack Application

Project Overview & Purpose-

GreenCart Logistics is a comprehensive logistics management platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application enables efficient management of delivery operations through driver management, route optimization, and intelligent delivery simulations.
Key Features

Role-based Authentication: Secure login system with JWT tokens
Driver Management: Complete CRUD operations for driver profiles
Route Management: Dynamic route creation with distance and traffic parameters
Order Management: Order tracking with real-time status updates
AI Simulation Engine: Advanced delivery simulation with business rule calculations
Real-time Dashboard: Interactive KPIs and performance metrics with Chart.js
Mobile Responsive: Fully responsive design for all devices

Business Logic Implementation

Late Delivery Penalty: ₹50 penalty for deliveries exceeding base time + 10 minutes
Driver Fatigue Management: 30% speed reduction for drivers working >8 hours
High-Value Order Bonus: 10% bonus for orders above ₹1000 delivered on time
Dynamic Fuel Calculation: ₹5/km base rate + ₹2/km traffic surcharge
Performance Analytics: Efficiency scoring and profit calculations


Tech Stack Used-

Frontend

React.js 18 - UI Library with Hooks and Context API
Chart.js - Data visualization and interactive charts
Axios - HTTP client for API communications
React Router Dom - Client-side routing
CSS3 - Custom styling with Flexbox and Grid
Responsive Design - Mobile-first approach

Backend

Node.js - JavaScript runtime environment
Express.js - Web application framework
MongoDB - NoSQL database for data storage
Mongoose - MongoDB object modeling
JWT (jsonwebtoken) - Authentication and authorization
bcryptjs - Password hashing and security
cors - Cross-origin resource sharing
dotenv - Environment variable management

Development & Testing

Jest - Unit testing framework
Nodemon - Development server auto-restart
Postman - API testing and documentation
Git - Version control system

Deployment & Cloud Services

Frontend: Vercel / Netlify
Backend: Render / Railway / AWS
Database: MongoDB Atlas (Cloud)


⚙️ Setup Instructions
Prerequisites

Node.js (v16 or higher)
npm or yarn package manager
MongoDB Atlas account
Git

Backend Setup

Clone the repository
bashgit clone https://github.com/sarangraii/greencart-logistics.git
cd greencart-logistics/backend

Install dependencies
bashnpm install

Environment Configuration
Create .env file in backend root:
bashtouch .env

Start development server
bashnpm run dev
Server will run on http://localhost:5000
Run tests
bashnpm test


Frontend Setup

Navigate to frontend directory
bashcd ../frontend

Install dependencies
bashnpm install

Environment Configuration
Create .env file in frontend root:
bashtouch .env

Start development server
bashnpm start
Application will open on http://localhost:3000
Build for production
bashnpm run build



Environment Variables
Backend (.env)
envMONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
Frontend (.env)
envREACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
Important: Never commit .env files to version control. All sensitive credentials are excluded via .gitignore.

Deployment Instructions
Database Deployment (MongoDB Atlas)

Create MongoDB Atlas account and cluster
Configure network access (add your IP or 0.0.0.0/0 for development)
Create database user with read/write permissions
Copy connection string for environment variables

Backend Deployment (Render)

Push code to GitHub repository
Connect Render to your GitHub account
Create new Web Service from repository
Configure build settings:

Root Directory: backend
Build Command: npm install
Start Command: npm start


Add environment variables in Render dashboard
Deploy and note the service URL

Frontend Deployment (Vercel)

Install Vercel CLI: npm i -g vercel
Navigate to frontend directory
Run deployment command:
bashvercel --prod

Configure project settings:

Root Directory: frontend
Build Command: npm run build
Output Directory: build


Add environment variables in Vercel dashboard
Deploy and note the application URL

Alternative Deployment Options

Backend: Railway, Heroku, AWS EC2, DigitalOcean
Frontend: Netlify, AWS S3 + CloudFront, GitHub Pages


API Documentation-
Base URL

Development: http://localhost:5000/api
<!-- Production: https://your-backend-url.com/api -->

Authentication Endpoints
POST /auth/login
Purpose: User authentication
json// Request
{
  "email": "admin@greencart.com",
  "password": "password123"
}

// Response (200 OK)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "email": "admin@greencart.com",
    "role": "admin"
  }
}
POST /auth/register
Purpose: Create new user account
json// Request
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "admin"
}

// Response (201 Created)
{
  "success": true,
  "message": "User registered successfully",
  "userId": "64f8a1b2c3d4e5f6g7h8i9j1"
}
Driver Management
GET /drivers
Purpose: Retrieve all drivers
json// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j2",
      "name": "Rajesh Kumar",
      "phone": "+91-9876543210",
      "vehicleNumber": "MH-12-AB-1234",
      "status": "available",
      "hoursWorked": 6.5,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
POST /drivers
Purpose: Create new driver
json// Request
{
  "name": "Amit Sharma",
  "phone": "+91-9876543211",
  "vehicleNumber": "MH-14-CD-5678",
  "status": "available"
}

// Response (201 Created)
{
  "success": true,
  "message": "Driver created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j3",
    "name": "Amit Sharma",
    "phone": "+91-9876543211",
    "vehicleNumber": "MH-14-CD-5678",
    "status": "available",
    "hoursWorked": 0
  }
}
PUT /drivers/:id
Purpose: Update driver information
json// Request
{
  "name": "Rajesh Kumar Singh",
  "status": "busy"
}

// Response (200 OK)
{
  "success": true,
  "message": "Driver updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j2",
    "name": "Rajesh Kumar Singh",
    "status": "busy"
  }
}
DELETE /drivers/:id
Purpose: Delete driver
json// Response (200 OK)
{
  "success": true,
  "message": "Driver deleted successfully"
}
Route Management
GET /routes
Purpose: Retrieve all routes
json// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j4",
      "startLocation": "Mumbai Central",
      "endLocation": "Pune Station",
      "distance": 150,
      "baseTime": 180,
      "traffic": "high",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
POST /routes
Purpose: Create new route
json// Request
{
  "startLocation": "Delhi",
  "endLocation": "Gurgaon",
  "distance": 45,
  "baseTime": 90,
  "traffic": "medium"
}

// Response (201 Created)
{
  "success": true,
  "message": "Route created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j5",
    "startLocation": "Delhi",
    "endLocation": "Gurgaon",
    "distance": 45,
    "baseTime": 90,
    "traffic": "medium"
  }
}
Order Management
GET /orders
Purpose: Retrieve all orders
json// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j6",
      "customerName": "Priya Patel",
      "deliveryAddress": "Andheri East, Mumbai",
      "orderValue": 1250,
      "priority": "high",
      "status": "pending",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
POST /orders
Purpose: Create new order
json// Request
{
  "customerName": "Rohit Verma",
  "deliveryAddress": "Sector 18, Noida",
  "orderValue": 850,
  "priority": "medium"
}

// Response (201 Created)
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j7",
    "customerName": "Rohit Verma",
    "deliveryAddress": "Sector 18, Noida",
    "orderValue": 850,
    "priority": "medium",
    "status": "pending"
  }
}
Simulation Engine
POST /simulation
Purpose: Run delivery simulation with business rules
json// Request
{
  "driverId": "64f8a1b2c3d4e5f6g7h8i9j2",
  "routeId": "64f8a1b2c3d4e5f6g7h8i9j4",
  "orderIds": ["64f8a1b2c3d4e5f6g7h8i9j6", "64f8a1b2c3d4e5f6g7h8i9j7"]
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j8",
    "driverId": "64f8a1b2c3d4e5f6g7h8i9j2",
    "routeId": "64f8a1b2c3d4e5f6g7h8i9j4",
    "orderIds": ["64f8a1b2c3d4e5f6g7h8i9j6"],
    "results": {
      "totalDeliveries": 2,
      "onTimeDeliveries": 1,
      "lateDeliveries": 1,
      "totalRevenue": 2100,
      "penalties": 50,
      "bonuses": 125,
      "fuelCosts": 1050,
      "profit": 1125,
      "efficiencyScore": 50
    },
    "summary": "Completed 2 deliveries with 50% efficiency. Generated ₹1,125 profit after penalties and fuel costs.",
    "tags": ["late-delivery", "high-value-bonus", "traffic-impact"],
    "executionTime": "2024-01-15T13:30:00.000Z"
  }
}
GET /simulation/history
Purpose: Retrieve simulation history
json// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j8",
      "driverName": "Rajesh Kumar",
      "routeInfo": "Mumbai Central → Pune Station",
      "totalOrders": 2,
      "profit": 1125,
      "efficiencyScore": 50,
      "executionTime": "2024-01-15T13:30:00.000Z"
    }
  ]
}
Error Responses
json// 400 Bad Request
{
  "success": false,
  "message": "Validation error: Driver name is required"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Access denied. No token provided."
}

// 404 Not Found
{
  "success": false,
  "message": "Driver not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Internal server error"
}

Live Application Links
Frontend Application
URL: 

Responsive web application
Role-based authentication
Interactive dashboard with real-time charts
Mobile-optimized interface

Backend API-

RESTful API endpoints
JWT authentication
MongoDB Atlas integration
Comprehensive error handling

API Documentation-

Interactive API documentation
Request/response examples
Authentication testing interface

Database-

MongoDB Atlas: Cloud-hosted database cluster

Secure connection with authentication
Automatic backups and scaling
Global cluster distribution


Testing-
Unit Tests
The application includes comprehensive unit tests for core business logic:
bash# Run backend tests
cd backend
npm test

# Test coverage includes:
# - Simulation engine calculations
# - Business rule implementations
# - API endpoint validation
# - Authentication middleware
Test Cases Covered

 Late delivery penalty calculation
 Driver fatigue impact on delivery time
 High-value order bonus calculation
 Fuel cost calculation with traffic surcharge
 Efficiency score computation
 JWT token validation
 Input validation for all endpoints

API Testing
Use the provided Postman collection for comprehensive API testing:

Authentication workflows
CRUD operations for all entities
Simulation engine testing
Error handling validation


Project Structure-
greencart-logistics/
├── backend/
│   ├── models/
│   │   ├── User.js              # User authentication model
│   │   ├── Driver.js            # Driver management model
│   │   ├── Route.js             # Route information model
│   │   ├── Order.js             # Order tracking model
│   │   └── SimulationResult.js  # Simulation history model
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── drivers.js           # Driver CRUD operations
│   │   ├── routes.js            # Route CRUD operations
│   │   ├── orders.js            # Order CRUD operations
│   │   └── simulation.js        # Simulation engine endpoints
│   ├── tests/
│   │   └── simulation.test.js   # Unit tests for business logic
│   ├── utils/
│   │   └── simulationEngine.js  # Core simulation calculations
│   ├── server.js                # Main server configuration
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables (not committed)
├── frontend/
│   ├── public/
│   │   ├── index.html           # HTML template
│   │   └── favicon.ico          # Application icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js     # Main dashboard with KPIs
│   │   │   ├── Login.js         # Authentication interface
│   │   │   ├── Navbar.js        # Navigation component
│   │   │   ├── DriverManagement.js  # Driver CRUD interface
│   │   │   ├── RouteManagement.js   # Route CRUD interface
│   │   │   ├── OrderManagement.js   # Order CRUD interface
│   │   │   └── Simulation.js    # Simulation interface
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication state management
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js               # Main application component
│   │   ├── App.css              # Global styles
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Base CSS styles
│   ├── package.json             # Frontend dependencies
│   └── .env                     # Environment variables (not committed)
├── README.md                    # Comprehensive documentation
├── .gitignore                   # Git ignore rules
└── docs/                        # Additional documentation (optional)
    ├── DEPLOYMENT.md            # Detailed deployment guide
    └── API_REFERENCE.md         # Extended API documentation

Business Rules Implementation:
1. Late Delivery Penalty
javascriptconst LATE_DELIVERY_PENALTY = 50; // ₹50 per late delivery
const GRACE_PERIOD = 10; // 10 minutes grace period

if (actualDeliveryTime > (baseTime + GRACE_PERIOD)) {
    penalty += LATE_DELIVERY_PENALTY;
}
2. Driver Fatigue Management
javascriptconst FATIGUE_THRESHOLD = 8; // 8 hours
const FATIGUE_IMPACT = 0.3; // 30% slower

if (driver.hoursWorked > FATIGUE_THRESHOLD) {
    deliveryTime *= (1 + FATIGUE_IMPACT);
}
3. High-Value Order Bonus
javascriptconst HIGH_VALUE_THRESHOLD = 1000; // ₹1000
const BONUS_PERCENTAGE = 0.10; // 10% bonus

if (order.value > HIGH_VALUE_THRESHOLD && isOnTime) {
    bonus += order.value * BONUS_PERCENTAGE;
}
4. Dynamic Fuel Calculation
javascriptconst BASE_FUEL_RATE = 5; // ₹5 per km
const TRAFFIC_SURCHARGE = 2; // ₹2 per km for high traffic

let fuelRate = BASE_FUEL_RATE;
if (route.traffic === 'high') {
    fuelRate += TRAFFIC_SURCHARGE;
}
fuelCost = route.distance * fuelRate;

Mobile Responsiveness
The application is fully responsive and optimized for:

Desktop: Full-featured interface with charts and detailed views
Tablet: Adapted layout with touch-friendly controls
Mobile: Streamlined interface with collapsible navigation
PWA Ready: Configured for Progressive Web App installation

Responsive Breakpoints

Mobile: max-width: 768px
Tablet: min-width: 769px and max-width: 1024px
Desktop: min-width: 1025px


Security Features:

Authentication & Authorization

JWT token-based authentication
Password hashing with bcrypt (salt rounds: 12)
Protected routes with middleware
Token expiration handling
Role-based access control

License:

This project is developed as part of the Purple Merit Technologies assessment. All rights reserved.

Contact & Support:

Developer: Sarang Kumar Rai
Email: sarang2452@gmail.com
LinkedIn: https://www.linkedin.com/in/sarang-rai-3ab028263?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app
Project Repository: https://github.com/sarangraii/greencart-logistics.git




