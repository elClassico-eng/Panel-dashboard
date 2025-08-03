# Task Management Dashboard

A fullstack task management application with role-based access control, built with React and Node.js. The project features a modern Kanban board interface, user authentication, file uploads, and comprehensive task management capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Future Plans](#future-plans)

## ✨ Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Role-Based Access Control**: Project Manager and Student roles with different permissions
- **Kanban Board**: Drag-and-drop task management interface
- **Task Management**: Create, update, delete, and assign tasks
- **File Upload**: Avatar and file upload functionality
- **Dashboard**: Overview of tasks, deadlines, and team performance
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **Real-time Updates**: Dynamic task status updates
- **Team Management**: View and manage team members

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **Zustand** - State management with persistence
- **React Router v7** - Client-side routing
- **Tailwind CSS 4.0** - Styling framework
- **Radix UI** - Accessible UI components
- **Material-UI** - Additional UI components
- **@dnd-kit** - Drag and drop functionality
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Vitest** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **Express Validator** - Input validation

## 🏗 Architecture

### Frontend Architecture
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── store/              # Zustand state management
│   ├── services/           # API service layers
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Static data and validation
│   └── utilities/          # Helper functions
```

### Backend Architecture
```
server/
├── controllers/            # Route handlers
├── models/                # Database schemas
├── router/                # API routes
├── services/              # Business logic
├── middlewares/           # Custom middleware
├── dtos/                  # Data transfer objects
└── exceptions/            # Error handling
```

### State Management
- **userStore**: Authentication, user profile, team management
- **taskStore**: Task CRUD operations, filtering, role-based loading
- **fileStore**: File upload and management

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Panel-dashboard
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

## ⚙️ Environment Configuration

### Server Environment Variables
Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=7000

# Database
DB_URL=mongodb://localhost:27017/task-management
# Or use MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_EXPIRES_IN=30d

# SMTP Configuration (for email services)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# URLs
API_URL=http://localhost:7000
CLIENT_URL=http://localhost:5173
```

### Client Environment Variables (Optional)
Create a `.env` file in the `client/` directory if needed:

```env
VITE_API_URL=http://localhost:7000/api
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:7000

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

3. **Access the application**
   Open your browser and navigate to http://localhost:5173

### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

## 📡 API Documentation

### Authentication Endpoints
```
POST /api/registration    # User registration
POST /api/login          # User login
POST /api/logout         # User logout
GET  /api/refresh        # Refresh access token
```

### User Management
```
GET  /api/team           # Get all team members (auth required)
GET  /api/profile        # Get user profile (auth required)
PUT  /api/profile        # Update user profile (auth required)
PUT  /api/users/role     # Update user role (project manager only)
```

### Task Management
```
POST   /api/tasks/                    # Create task (project manager only)
GET    /api/tasks/                    # Get all tasks (project manager only)
GET    /api/tasks/:id                 # Get task by ID (project manager only)
PUT    /api/tasks/:id                 # Update task (auth required)
PATCH  /api/tasks/:id/status          # Update task status (student only)
DELETE /api/tasks/:id                 # Delete task (project manager only)
GET    /api/tasks/employee/:employeeId # Get tasks by employee (student only)
```

### File Upload
```
POST /api/files/upload-images    # Upload avatar (auth required)
```

### User Roles
- **Руководитель проекта** (Project Manager): Full access to all tasks and team management
- **Студент** (Student): Limited access to assigned tasks and profile management

## 📁 Project Structure

```
Panel-dashboard/
├── client/                     # Frontend React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── AuthForm/      # Authentication forms
│   │   │   ├── Kanban/        # Kanban board components
│   │   │   ├── Home/          # Dashboard widgets
│   │   │   ├── ui/            # Base UI components
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   └── data/             # Static data and validation
│   ├── package.json
│   ├── vite.config.js
│   └── vitest.config.js
├── server/                    # Backend Node.js application
│   ├── controllers/          # Route controllers
│   ├── models/              # Database models
│   ├── router/              # API routes
│   ├── services/            # Business logic
│   ├── middlewares/         # Custom middleware
│   ├── images/              # Uploaded files directory
│   ├── package.json
│   └── index.js             # Server entry point
├── package.json             # Root package.json for shared dependencies
└── README.md
```

## 🔧 Development

### Available Scripts

**Frontend (client/)**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm test         # Run tests with Vitest
npm run preview  # Preview production build
```

**Backend (server/)**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Testing
```bash
cd client
npm test         # Run all tests
npm test -- --watch  # Run tests in watch mode
```

### Linting
```bash
cd client
npm run lint     # Check for linting errors
```

## 🔮 Future Plans

- **TypeScript Migration**: The project is planned to migrate from JavaScript to TypeScript in the near future
- **Enhanced Features**: Additional dashboard widgets and analytics
- **Mobile App**: React Native mobile application
- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Permissions**: More granular role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This project is currently in active development 👨‍💻
