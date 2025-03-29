# ClimbHub - DUMC Resource Platform

## Project Overview
ClimbHub is a comprehensive web application developed for Durham University Mountaineering Club (DUMC) that serves as a centralized resource platform for climbers. This project was created as part of the Programming Gold module in the Computer Science program at Durham University.

The platform enables DUMC members to access information about outdoor climbing spots (crags) near Durham, search for routes by name or grade, and contribute to the community by adding new routes.

## Features
### 🏔️ Crag Information
- Detailed profiles of six popular climbing locations near Durham
- Information about distance, rock type, and climbing styles at each location
- Photo galleries and descriptive content for each crag
- Interactive modal interfaces for crag details

### 🧗‍♀️ Route Database
- Comprehensive database of climbing routes organized by crag
- Search functionality allowing users to find routes by name
- Grade filtering system to identify routes of specific difficulty levels
- Interactive route cards with detailed information when a route is selected

### 🔍 Search Capabilities
- Real-time search for crags and routes
- Grade-based filtering for finding appropriate climbing challenges
- Fuzzy matching for crag names to improve user experience

### 👥 Community Information
- Details about DUMC activities and events
- Information about climbing meets, competitions, and social gatherings
- Links to DUMC social media and community platforms

### 🌐 Backend Integration
- Express.js server handling API requests
- JSON-based data management for crags and routes
- RESTful API endpoints for searching and adding climbing routes

## Technical Implementation

### Frontend
- HTML5, CSS3, and JavaScript
- Bootstrap 5 for responsive design and UI components
- Custom styling and animations
- Client-side form validation

### Backend
- Node.js with Express.js framework
- RESTful API architecture
- File-based JSON data storage
- Server-side validation and error handling

### Key Features Implemented
- Asynchronous API calls using Fetch API
- Real-time search filtering
- Intelligent error handling with retry capabilities
- Form validation with pattern matching
- Responsive design for all device sizes

## Installation and Setup

1. Clone the repo:
```git clone https://github.com/yourusername/progGoldSum.git```

2. Install the dependencies:
```
cd progGoldSum
npm install
```

3. Start the server:
```
npm start
```

4. Access the application in your browser:
http://localhost:8090

## Project Structure
```
/progGoldSum
│
├── client/                  # Frontend files
│   └── climb-hub/
│       └── dist/            # Production-ready frontend files
│           ├── assets/      # Images and other static assets
│           ├── css/         # Stylesheets
│           ├── js/          # JavaScript files
│           ├── client.js    # Main client-side JavaScript
│           └── index.html   # Main HTML file
│
├── crags.json               # Crag data
├── routes.json              # Routes data
├── app.js                   # Express server and API endpoints
├── server.js                # Server initialization
└── package.json             # Project dependencies
```

## Learning Outcomes
This project demonstrates proficiency in:

- Full-stack web development
- RESTful API design and implementation
- Client-server architecture
- Frontend UI/UX design
- Form validation and error handling
- Asynchronous JavaScript programming
- Bootstrap integration and customization

## Future Enhancements
Potential areas for expansion include:

- User authentication and personalized route recommendations
- Weather API integration for climbing conditions
- Map visualization of crag locations
- Mobile application development
- Community forum for climbers to share experiences

© 2025 ClimbHub - Created as part of the Programming Gold module at Durham University