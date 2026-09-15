TradeX

A full-stack trading platform inspired by modern stock-trading applications such as Zerodha/Kite.

TradeX is a portfolio project focused on building a realistic, production-style trading application with a React frontend, Node.js backend, real-time market data, authentication, portfolio management, and scalable backend architecture.

Status: Active development

🚀 Features

User authentication and authorization

JWT-based access and refresh token flow

Stock search and market overview

Real-time market price updates

Interactive stock/portfolio charts

Watchlist management

Holdings and positions

Order management

Portfolio tracking

Funds and account information

RESTful APIs

WebSocket-based real-time communication

Redis integration

MongoDB database

Request validation and centralized error handling

Rate limiting and request logging

API documentation with Swagger/OpenAPI

🏗️ Architecture

TradeX
│
├── frontend/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── ...
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── jobs/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

🛠️ Tech Stack

Frontend

React

Vite

JavaScript

Axios

Socket.IO Client

Lightweight Charts

CSS

Backend

Node.js

Express.js

MongoDB

Redis

Socket.IO

JWT

REST APIs

Swagger / OpenAPI

Development & Infrastructure

Git & GitHub

Docker

VS Code

Postman

🔄 Application Flow

User
  │
  ▼
React Frontend
  │
  ├── REST API ──────► Node.js / Express
  │                         │
  │                         ├── Authentication
  │                         ├── Business Logic
  │                         ├── Portfolio
  │                         ├── Orders
  │                         └── Market Data
  │
  └── WebSocket ─────► Socket.IO
                            │
                            ▼
                       Real-time Updates
                            │
                            ▼
                    React Dashboard

📊 Real-Time Market Data

TradeX uses WebSockets to deliver live market updates to the frontend.

Market Simulator / Data Source
            │
            ▼
       Backend Server
            │
        Socket.IO
            │
            ▼
       React Frontend
            │
            ▼
     Live Market UI

The current development environment uses simulated market data for realistic frontend and backend testing.

🔐 Authentication

TradeX implements an access-token and refresh-token based authentication flow.

Login
  │
  ▼
Access Token + Refresh Token
  │
  ├── Access Token → API requests
  │
  └── Refresh Token → New access token

Logout invalidates the active session according to the backend session lifecycle.

💻 Getting Started

Prerequisites

Make sure you have installed:

Node.js

npm

MongoDB

Redis

Git

Docker (recommended for local Redis)

1. Clone the repository

git clone https://github.com/karthikyannabthina/TradeX.git
cd TradeX

2. Install frontend dependencies

cd frontend
npm install

3. Install backend dependencies

Open another terminal:

cd backend
npm install

4. Configure environment variables

Create the required .env files based on the environment examples provided by the project.

Never commit real secrets, API keys, database credentials, or JWT secrets to GitHub.

5. Start Redis

If Redis is configured through Docker, start your Redis container using the project's local Docker configuration.

6. Start the backend

From backend/:

npm run dev

7. Start the frontend

From frontend/:

npm run dev

The frontend and backend development servers will run independently.

📁 Project Structure

Frontend

The frontend follows a component-based React architecture.

frontend/src
├── components
│   ├── Dashboard
│   ├── Navbar
│   ├── Sidebar
│   └── StockSearch
├── context
├── layouts
├── pages
├── services
├── utils
├── App.jsx
├── App.css
├── index.css
├── main.jsx
└── socket.js

Backend

The backend is organized around modular services and middleware.

backend/src
├── config
├── constants
├── docs
├── errors
├── events
├── jobs
├── middlewares
├── modules
├── app.js
└── server.js

🧪 Testing & API Development

API endpoints can be tested using Postman.

Swagger/OpenAPI documentation is included in the backend for exploring the available APIs.

🎯 Project Goals

TradeX is being developed with a focus on real-world software engineering rather than only UI implementation.

Key goals:

Clean frontend architecture

Modular backend architecture

Secure authentication

Real-time communication

Database-driven application design

Caching with Redis

Error handling

Validation

Logging

Rate limiting

Scalable API design

Production-oriented development practices

🗺️ Roadmap

React frontend foundation

Node.js backend foundation

MongoDB integration

Redis integration

Authentication flow

Refresh-token lifecycle

Real-time market updates

Interactive market/portfolio charts

Monorepo structure

Complete order execution workflow

Advanced portfolio analytics

Improved market-data architecture

Comprehensive automated testing

Production deployment

CI/CD pipeline

Monitoring and observability improvements

📌 Disclaimer

TradeX is an educational and portfolio project.

It does not provide real financial brokerage services and should not be used for actual investment or trading decisions.

👨‍💻 Author

Karthik

Full Stack Developer

⭐ If you find this project useful, consider giving the repository a star.
