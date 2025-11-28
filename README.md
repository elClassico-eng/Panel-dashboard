# Task Management Dashboard

> A modern, full-stack task management application with offline support, role-based access control, and real-time synchronization.

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A professional task management dashboard built with React and Node.js, featuring a modern Kanban board interface, offline-first architecture, JWT authentication, file uploads, and comprehensive task management capabilities. Perfect for teams who need reliable task tracking with or without internet connectivity.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Offline Mode](#-offline-mode)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Security](#-security)
- [Future Plans](#-future-plans)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with refresh token rotation
- **Role-Based Access Control**:
  - **Project Manager** (Руководитель проекта): Full access to all tasks, team management, and analytics
  - **Employee** (Студент): Access to assigned tasks and personal profile
- **Kanban Board**: Intuitive drag-and-drop task management with @dnd-kit
- **Task Management**: Complete CRUD operations with status tracking
- **File Upload**: Avatar upload with Multer processing
- **Dashboard Analytics**: Real-time task statistics, deadlines, and team performance metrics
- **Team Management**: View and manage team members with role assignment

### Offline Capabilities 🚀
- **Offline-First Architecture**: Full functionality without internet connection
- **IndexedDB Storage**: Local data persistence with Dexie.js
- **Automatic Synchronization**: Background sync when connection restored
- **Network Status Indicators**: Real-time online/offline status display
- **Sync Queue Management**: Intelligent operation queuing with retry logic
- **Conflict Resolution**: Last-write-wins strategy with version tracking
- **Optimistic Updates**: Instant UI updates with eventual consistency

### User Experience
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS 4.0
- **Dark/Light Theme**: System-aware theme switching with next-themes
- **Modern UI Components**: Beautiful, accessible components with Radix UI and Material-UI
- **Smooth Animations**: Framer Motion for delightful interactions
- **Real-time Updates**: Dynamic task status updates and notifications
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error boundaries and user feedback

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.3.1 |
| **Vite** | Build Tool & Dev Server | 6.0.5 |
| **Zustand** | State Management | 5.0.3 |
| **React Router** | Client-side Routing | 7.1.4 |
| **Tailwind CSS** | Styling Framework | 4.0.6 |
| **Radix UI** | Accessible Components | Latest |
| **Material-UI** | UI Component Library | 6.4.2 |
| **@dnd-kit** | Drag & Drop | 6.3.1 |
| **Framer Motion** | Animation Library | 12.0.6 |
| **Axios** | HTTP Client | 1.7.9 |
| **Dexie.js** | IndexedDB Wrapper | 4.2.1 |
| **React Hook Form** | Form Management | 7.54.2 |
| **Vitest** | Unit Testing | 3.1.4 |
| **date-fns** | Date Utilities | 3.6.0 |
| **Recharts** | Data Visualization | 2.15.1 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **Express.js** | Web Framework | 4.21.2 |
| **MongoDB** | Database | 6.13.0 |
| **Mongoose** | MongoDB ODM | 8.10.0 |
| **JWT** | Authentication | 9.0.2 |
| **bcrypt** | Password Hashing | 5.1.1 |
| **Multer** | File Upload Handler | 1.4.5 |
| **Nodemailer** | Email Service | 6.10.0 |
| **Express Validator** | Input Validation | 7.2.1 |
| **Express Rate Limit** | API Rate Limiting | 8.0.1 |

---

## 🏗 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   React    │  │   Zustand    │  │   IndexedDB      │    │
│  │  Components│◄─┤   Stores     │◄─┤   (Dexie)       │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│         │               │                     │              │
│         └───────────────┼─────────────────────┘              │
│                         │                                    │
│              ┌──────────▼──────────┐                        │
│              │   Offline Client    │                        │
│              │  (Network Aware)    │                        │
│              └──────────┬──────────┘                        │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP/HTTPS
              ┌───────────▼──────────┐
              │   Express Server     │
              │  ┌────────────────┐  │
              │  │  Controllers   │  │
              │  │  Middleware    │  │
              │  │  Services      │  │
              │  └────────┬───────┘  │
              └───────────┼──────────┘
                          │
              ┌───────────▼──────────┐
              │      MongoDB         │
              │  Collections:        │
              │  - users             │
              │  - tasks             │
              │  - tokens            │
              └──────────────────────┘
```

### Frontend Architecture

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthForm/        # Login & Registration forms
│   │   ├── Kanban/          # Kanban board components
│   │   │   ├── Board.jsx    # Main board container
│   │   │   ├── Column.jsx   # Task columns
│   │   │   ├── SortableCard.jsx  # Draggable task cards
│   │   │   └── AddCard.jsx  # Task creation modal
│   │   ├── Home/            # Dashboard widgets
│   │   │   ├── WidgetAllTasks.jsx
│   │   │   ├── InfoTaskDeadline.jsx
│   │   │   └── TeamPerformanceWidget.jsx
│   │   ├── Profile/         # User profile management
│   │   ├── Setting/         # Application settings
│   │   ├── Navbar/          # Top navigation bar
│   │   ├── Sidebar/         # Side navigation menu
│   │   └── ui/              # Base UI components (Radix)
│   │       ├── NetworkStatusIndicator.jsx
│   │       ├── SyncStatusBadge.jsx
│   │       └── ... (buttons, dialogs, inputs, etc.)
│   │
│   ├── pages/              # Page-level components
│   │   ├── HomePage.jsx
│   │   ├── KanbanPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── SettingsPage.jsx
│   │
│   ├── store/              # Zustand state management
│   │   ├── userStore.js    # Auth & user state
│   │   ├── taskStore.js    # Task management state
│   │   └── middleware/
│   │       └── offlineMiddleware.js  # Offline persistence
│   │
│   ├── services/           # API service layers
│   │   ├── AuthServices.js      # Authentication endpoints
│   │   ├── TaskServices.js      # Task CRUD operations
│   │   ├── FileServices.js      # File upload
│   │   ├── NetworkService.js    # Network monitoring
│   │   ├── SyncService.js       # Background sync
│   │   └── SyncQueueManager.js  # Sync queue handling
│   │
│   ├── http/               # HTTP clients
│   │   ├── index.js        # Axios base config
│   │   └── offlineClient.js  # Offline-aware HTTP client
│   │
│   ├── db/                 # IndexedDB configuration
│   │   └── database.js     # Dexie schema & setup
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── use-theme.js
│   │   └── use-mobile.js
│   │
│   ├── data/               # Static data & validation
│   │   └── data.js         # Routes, constants
│   │
│   └── utilities/          # Helper functions
│       └── sanitizer.js    # Input sanitization
```

### Backend Architecture

```
server/
├── controllers/            # Route controllers
│   ├── user-controller.js  # User management logic
│   └── task-controller.js  # Task management logic
│
├── models/                # Mongoose schemas
│   ├── user-models.js     # User schema with roles
│   ├── task-model.js      # Task schema
│   └── token-model.js     # Refresh token storage
│
├── router/                # API routes
│   └── index.js           # Route definitions
│
├── services/              # Business logic
│   ├── user-service.js    # User operations
│   ├── task-service.js    # Task operations
│   ├── token-service.js   # JWT token handling
│   └── mail-service.js    # Email functionality
│
├── middlewares/           # Custom middleware
│   ├── auth-middleware.js # JWT verification
│   └── role-middleware.js # Role-based access
│
├── dtos/                  # Data transfer objects
│   └── user-dto.js        # User data sanitization
│
├── exceptions/            # Error handling
│   └── api-error.js       # Custom error class
│
├── images/                # Uploaded files directory
│
└── index.js               # Server entry point
```

### State Management

The application uses **Zustand** for predictable state management with localStorage persistence:

#### **userStore.js**
- Authentication state (login, logout, register)
- User profile management
- Team member data
- Role-based permissions
- IndexedDB sync for offline access

#### **taskStore.js**
- Task CRUD operations
- Filtering and search
- Role-based task loading
- Kanban board state
- Offline data hydration
- Sync status tracking

#### **Offline Middleware**
- Automatic IndexedDB persistence
- State hydration on app load
- Conflict resolution strategies

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9+) or **yarn** (v1.22+)
- **MongoDB** (v6.0+)
  - Local installation: [Download](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas account: [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- Modern browser with IndexedDB support (Chrome 87+, Firefox 85+, Safari 14+)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Panel-dashboard.git
cd Panel-dashboard
```

### 2. Install Root Dependencies

The root `package.json` contains shared dependencies for drag-and-drop functionality:

```bash
npm install
```

### 3. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Install Server Dependencies

```bash
cd server
npm install
cd ..
```

---

## ⚙️ Environment Configuration

### Server Configuration

Create a `.env` file in the `server/` directory:

```env
# Server Port
PORT=3001

# Database Connection
DB_URL=mongodb://localhost:27017/task-management
# For MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=your_super_secret_access_token_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_here
JWT_EXPIRES_IN=30d

# SMTP Configuration (for email services)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
# Get app password: https://myaccount.google.com/apppasswords

# Application URLs
API_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173
```

> **Security Note**: Use the example above to generate strong, random JWT secrets. Never commit `.env` files to version control.

### Client Configuration (Optional)

Create a `.env` file in the `client/` directory if you need to override defaults:

```env
# API Base URL (defaults to http://localhost:3001/api)
VITE_API_URL=http://localhost:3001/api
```

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```
3. Verify connection:
   ```bash
   mongosh
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user (Database Access)
4. Whitelist IP address (Network Access → Add IP → Allow Access from Anywhere)
5. Get connection string (Connect → Connect your application)
6. Update `DB_URL` in server `.env`

---

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server

```bash
cd server
npm run dev
```

Server will start on `http://localhost:3001` with hot-reloading via nodemon.

Expected output:
```
Server running on port 3001
MongoDB connected successfully
```

#### Start Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

Client will start on `http://localhost:5173` with Vite's HMR.

Expected output:
```
  VITE v6.0.5  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Access Application

Open your browser and navigate to: **http://localhost:5173**

### Production Mode

#### Build Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/`.

#### Serve Production Build

You can preview the production build locally:

```bash
cd client
npm run preview
```

Or configure your web server (Nginx, Apache) to serve the `client/dist/` directory.

#### Start Production Server

```bash
cd server
npm start
```

For production deployment, consider using a process manager like **PM2**:

```bash
npm install -g pm2
pm2 start server/index.js --name "task-dashboard-api"
pm2 save
pm2 startup
```

---

## 🌐 Offline Mode

### Overview

The application features a **robust offline-first architecture** that allows users to work seamlessly without internet connectivity. All changes are automatically synchronized when the connection is restored.

### Key Features

- **Automatic Network Detection**: Real-time monitoring of online/offline status
- **Local Data Persistence**: All tasks and user data cached in IndexedDB
- **Operation Queueing**: CRUD operations queued when offline, executed when online
- **Background Sync**: Automatic synchronization with exponential backoff retry
- **Visual Indicators**: Status badges showing sync state and pending changes
- **Conflict Resolution**: Last-write-wins strategy with version tracking

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  User Action (Create/Update/Delete Task)                │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼──────────┐
         │  Network Available?  │
         └───────────┬──────────┘
                     │
        ┌────────────┴───────────┐
        │                        │
    Yes │                        │ No
        │                        │
┌───────▼────────┐      ┌────────▼────────┐
│  Send to API   │      │  Save to Queue  │
│  Update Cache  │      │  Update Cache   │
│  Update UI     │      │  Update UI      │
└────────────────┘      └────────┬────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Network Restored │
                        └────────┬─────────┘
                                 │
                        ┌────────▼──────────┐
                        │  Process Queue    │
                        │  Sync to Server   │
                        │  Update with IDs  │
                        └───────────────────┘
```

### Components

#### NetworkService (`client/src/services/NetworkService.js`)
- Monitors `navigator.onLine` status
- Dispatches custom events on status change
- Provides subscription mechanism for components

#### SyncQueueManager (`client/src/services/SyncQueueManager.js`)
- Manages queue of pending operations
- Prioritizes operations (CREATE → UPDATE → DELETE)
- Tracks retry counts and timestamps
- Implements exponential backoff (1s, 2s, 4s, 8s...)

#### SyncService (`client/src/services/SyncService.js`)
- Processes sync queue when online
- Handles batch synchronization
- Replaces temporary IDs with server IDs
- Provides manual sync trigger
- Emits sync status events

#### OfflineClient (`client/src/http/offlineClient.js`)
- Wraps Axios with offline awareness
- Automatically queues requests when offline
- Provides optimistic updates
- Handles network errors gracefully

#### IndexedDB Schema (`client/src/db/database.js`)
```javascript
{
  users: {
    _id, email, name, role, avatar,
    _syncStatus, _version, _lastModified
  },
  tasks: {
    _id, title, description, status, assignee, deadline,
    _syncStatus, _version, _lastModified
  },
  syncQueue: {
    id, operation, url, data, method,
    retryCount, priority, timestamp
  },
  metadata: {
    key, value, lastSync
  }
}
```

### UI Indicators

#### NetworkStatusIndicator
- Green "Online" / Red "Offline" badge
- Real-time status updates
- Located in navbar

#### SyncStatusBadge
- Shows pending changes count
- Sync status: "Synced", "Syncing...", "X changes pending"
- Manual sync button
- Spinning loader during sync

### Testing Offline Mode

#### Chrome DevTools Method

1. Open DevTools (F12)
2. Navigate to **Network** tab
3. Set throttling to **Offline**
4. Perform operations (create/update/delete tasks)
5. Verify changes appear in UI
6. Check **Application → IndexedDB → PanelDashboardDB**
7. Restore network (set to **No throttling**)
8. Watch automatic synchronization

#### Service Worker Method (Future)

Currently, the app uses simulated offline mode via network detection. Future versions will integrate Service Workers for true offline PWA functionality.

### Offline Limitations

- **Authentication**: Login/registration requires internet connection
- **File Uploads**: Avatar uploads not supported offline (queued for future)
- **Real-time Updates**: No WebSocket updates while offline
- **Initial Load**: First visit requires connection to load data

### Troubleshooting Offline Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Changes not syncing | Sync queue stuck | Open DevTools → Application → IndexedDB → Clear `syncQueue` table |
| Old data after sync | Cache not updated | Clear browser cache, refresh page |
| Duplicate tasks | Temp IDs not replaced | Check temp IDs start with `temp_`, clear queue |
| Sync never completes | Network intermittent | Wait for stable connection, check console for errors |

For detailed testing scenarios, see [OFFLINE_MODE_TESTING.md](./OFFLINE_MODE_TESTING.md).

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

The API uses HTTP-only cookies for refresh tokens.

---

### Authentication Endpoints

#### Register User
```http
POST /api/registration
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "Студент"  // or "Руководитель проекта"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Студент",
    "isActivated": false
  }
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Logout
```http
POST /api/logout
Cookie: refreshToken=...

Response: 200 OK
```

#### Refresh Token
```http
GET /api/refresh
Cookie: refreshToken=...

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

### User Management

#### Get All Team Members
```http
GET /api/team
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "user1@example.com",
    "name": "John Doe",
    "role": "Студент",
    "avatar": "uploads/avatar-123.jpg"
  },
  ...
]
```

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Студент",
  "avatar": "uploads/avatar-123.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Update User Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "new-avatar.jpg"
}

Response: 200 OK
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Update User Role (Project Manager Only)
```http
PUT /api/users/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "role": "Руководитель проекта"
}

Response: 200 OK
{
  "message": "Role updated successfully"
}
```

---

### Task Management

#### Create Task (Project Manager Only)
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement login feature",
  "description": "Add JWT authentication to the app",
  "status": "На рассмотрении",
  "assignee": "507f1f77bcf86cd799439011",
  "deadline": "2024-12-31T23:59:59Z",
  "priority": "high"
}

Response: 201 Created
{
  "_id": "507f191e810c19729de860ea",
  "title": "Implement login feature",
  "description": "Add JWT authentication to the app",
  "status": "На рассмотрении",
  "assignee": { ... },
  "deadline": "2024-12-31T23:59:59Z",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Task Statuses:**
- `На рассмотрении` (Pending)
- `В работе` (In Progress)
- `Выполнена` (Completed)
- `Закрыта` (Closed)

#### Get All Tasks (Project Manager Only)
```http
GET /api/tasks?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "tasks": [ ... ],
  "currentPage": 1,
  "totalPages": 5,
  "total": 48
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "507f191e810c19729de860ea",
  "title": "Implement login feature",
  ...
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "В работе",
  "description": "Updated description"
}

Response: 200 OK
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

#### Update Task Status (Employee Only)
```http
PATCH /api/tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Выполнена"
}

Response: 200 OK
{
  "message": "Status updated successfully",
  "task": { ... }
}
```

#### Delete Task (Project Manager Only)
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

#### Get Tasks by Employee (Employee Only)
```http
GET /api/tasks/employee/:employeeId?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "tasks": [ ... ],
  "currentPage": 1,
  "totalPages": 2,
  "total": 12
}
```

---

### File Upload

#### Upload Avatar
```http
POST /api/files/upload-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - images: [File]

Response: 200 OK
{
  "message": "Upload successful",
  "filenames": ["avatar-1642147800000.jpg"]
}
```

**Supported formats:** JPG, JPEG, PNG, GIF
**Max file size:** 5MB
**Upload directory:** `server/images/`

---

### Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry (e.g., email exists)
- `500 Internal Server Error` - Server error

---

## 📁 Project Structure

```
Panel-dashboard/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── AuthForm/            # Authentication forms
│   │   │   │   ├── AuthFormLogIn.jsx
│   │   │   │   └── AuthFormRegistration.jsx
│   │   │   ├── Kanban/              # Kanban board
│   │   │   │   ├── Board.jsx
│   │   │   │   ├── Column.jsx
│   │   │   │   ├── SortableCard.jsx
│   │   │   │   ├── AddCard.jsx
│   │   │   │   ├── EditTaskForm.jsx
│   │   │   │   ├── SearchTask.jsx
│   │   │   │   └── TaskStats.jsx
│   │   │   ├── Home/                # Dashboard widgets
│   │   │   │   ├── WidgetAllTasks.jsx
│   │   │   │   ├── InfoTaskDeadline.jsx
│   │   │   │   └── TeamPerformanceWidget.jsx
│   │   │   ├── Profile/             # User profile
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── UploadAvatar.jsx
│   │   │   ├── Setting/             # App settings
│   │   │   │   └── Card.jsx
│   │   │   ├── Navbar/              # Top navigation
│   │   │   │   └── Navbar.jsx
│   │   │   ├── Sidebar/             # Side navigation
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Error/               # Error handling
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── AuthError.jsx
│   │   │   ├── Upload/              # File upload
│   │   │   │   └── userAvatar.jsx
│   │   │   └── ui/                  # Base UI components
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── input.jsx
│   │   │       ├── select.jsx
│   │   │       ├── avatar.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── NetworkStatusIndicator.jsx
│   │   │       └── SyncStatusBadge.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── KanbanPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── store/                   # Zustand stores
│   │   │   ├── userStore.js         # User & auth state
│   │   │   ├── taskStore.js         # Task state
│   │   │   └── middleware/
│   │   │       └── offlineMiddleware.js
│   │   ├── services/                # API services
│   │   │   ├── AuthServices.js
│   │   │   ├── TaskServices.js
│   │   │   ├── FileServices.js
│   │   │   ├── NetworkService.js
│   │   │   ├── SyncService.js
│   │   │   └── SyncQueueManager.js
│   │   ├── http/                    # HTTP clients
│   │   │   ├── index.js             # Axios config
│   │   │   └── offlineClient.js     # Offline-aware client
│   │   ├── db/                      # IndexedDB
│   │   │   └── database.js          # Dexie schema
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── use-theme.js
│   │   │   └── use-mobile.js
│   │   ├── data/                    # Static data
│   │   │   └── data.js
│   │   ├── utilities/               # Helper functions
│   │   │   └── sanitizer.js
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Environment variables
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── vitest.config.js             # Test configuration
│   ├── tailwind.config.js           # Tailwind config
│   ├── eslint.config.js             # ESLint rules
│   └── index.html                   # HTML template
│
├── server/                          # Backend Node.js application
│   ├── controllers/                 # Route controllers
│   │   ├── user-controller.js
│   │   └── task-controller.js
│   ├── models/                      # Mongoose models
│   │   ├── user-models.js
│   │   ├── task-model.js
│   │   └── token-model.js
│   ├── router/                      # API routes
│   │   └── index.js
│   ├── services/                    # Business logic
│   │   ├── user-service.js
│   │   ├── task-service.js
│   │   ├── token-service.js
│   │   └── mail-service.js
│   ├── middlewares/                 # Custom middleware
│   │   ├── auth-middleware.js
│   │   └── role-middleware.js
│   ├── dtos/                        # Data transfer objects
│   │   └── user-dto.js
│   ├── exceptions/                  # Error handling
│   │   └── api-error.js
│   ├── images/                      # Uploaded files
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Env template
│   ├── package.json                 # Dependencies
│   └── index.js                     # Server entry point
│
├── package.json                     # Root dependencies (shared)
├── README.md                        # This file
├── CLAUDE.md                        # AI assistant instructions
├── OFFLINE_MODE_TESTING.md          # Offline testing guide
├── QUICK_START_OFFLINE.md           # Offline quick start
├── WIFI_OFFLINE_TESTING.md          # WiFi testing scenarios
├── FIXED_WIFI_ISSUE.md              # WiFi troubleshooting
└── .gitignore                       # Git ignore rules
```

---

## 🔧 Development

### Available Scripts

#### Frontend (`client/`)

```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Build for production (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint for code quality
npm test          # Run unit tests with Vitest
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage  # Generate coverage report
```

#### Backend (`server/`)

```bash
npm run dev       # Start with nodemon (auto-restart on changes)
npm start         # Start production server
```

### Code Quality

#### ESLint Configuration

The project uses ESLint with React-specific rules:

```javascript
// client/eslint.config.js
export default {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/prop-types': 'warn',
    'no-unused-vars': 'warn'
  }
}
```

Run linter:
```bash
cd client
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

#### Code Formatting

Consider adding Prettier for consistent formatting:

```bash
cd client
npm install -D prettier
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Path Aliases

The project uses `@/` as an alias for `client/src/`:

```javascript
// vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

Usage:
```javascript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/store/userStore'
```

### Hot Module Replacement (HMR)

Vite provides instant HMR for rapid development. Changes to React components, CSS, and most code will update without full page reload.

---

## 🧪 Testing

### Testing Stack

- **Vitest** - Fast unit test framework (Vite-native)
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM simulation environment
- **@testing-library/user-event** - User interaction simulation

### Running Tests

```bash
cd client

# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm test -- --watch

# Coverage report
npm test -- --coverage

# UI mode (interactive test runner)
npm test -- --ui
```

### Test Structure

```javascript
// client/src/components/__tests__/Button.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    const { user } = render(
      <Button onClick={handleClick}>Click me</Button>
    )
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Writing Tests

Create test files alongside components with `.test.jsx` or `.spec.jsx` extension:

```
src/
├── components/
│   ├── ui/
│   │   ├── button.jsx
│   │   └── __tests__/
│   │       └── button.test.jsx
```

### Test Coverage

Current coverage targets:
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

View coverage report:
```bash
npm test -- --coverage
# Opens coverage/index.html
```

---

## 🛠 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Symptoms:**
```
Error: MongoServerError: connect ECONNREFUSED
```

**Solutions:**
- Verify MongoDB is running: `mongosh`
- Check `DB_URL` in `.env` file
- For Atlas: verify IP whitelist and credentials
- Try connection string without `?appName=...` parameter

#### 2. Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solutions:**
```bash
# Find process using port
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port in .env
PORT=3002
```

#### 3. JWT Token Errors

**Symptoms:**
```
401 Unauthorized: Token verification failed
```

**Solutions:**
- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`
- Clear cookies and localStorage
- Re-login to get fresh tokens
- Check token expiration (`JWT_EXPIRES_IN`)

#### 4. CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**
- Verify `CLIENT_URL` in server `.env` matches your frontend URL
- Check `server/index.js` CORS configuration includes your origin
- Clear browser cache
- Ensure credentials: true in CORS config

#### 5. Offline Sync Not Working

**Symptoms:**
- Changes not syncing when back online
- SyncStatusBadge shows stuck pending count

**Solutions:**
```javascript
// Clear sync queue in DevTools console
indexedDB.deleteDatabase('PanelDashboardDB')
// Then refresh page

// Or manually:
// DevTools → Application → IndexedDB → PanelDashboardDB → syncQueue → Clear
```

#### 6. File Upload Fails

**Symptoms:**
```
Error: File too large or invalid format
```

**Solutions:**
- Check file size (max 5MB)
- Verify file format (JPG, PNG, GIF only)
- Ensure `server/images/` directory exists and is writable
- Check Multer configuration in `server/router/index.js`

#### 7. Dependency Installation Errors

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use legacy peer deps (if needed)
npm install --legacy-peer-deps
```

#### 8. Vite Build Fails

**Symptoms:**
```
[vite]: Rollup failed to resolve import
```

**Solutions:**
- Check import paths use `@/` alias correctly
- Verify all dependencies are installed
- Clear Vite cache: `rm -rf client/node_modules/.vite`
- Check `vite.config.js` alias configuration

### Debug Mode

Enable detailed logging:

**Frontend:**
```javascript
// Add to client/src/main.jsx
if (import.meta.env.DEV) {
  window.DEBUG = true
  console.log('Debug mode enabled')
}
```

**Backend:**
```javascript
// Add to server/index.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body)
    next()
  })
}
```

### Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/yourusername/Panel-dashboard/issues) page
2. Search existing issues for similar problems
3. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages/screenshots
   - Environment details (OS, Node version, browser)

---

## 🔒 Security

### Best Practices Implemented

#### Authentication & Authorization
- ✅ **JWT with Refresh Tokens** - Short-lived access tokens (30 days configurable)
- ✅ **HTTP-only Cookies** - Refresh tokens stored securely, inaccessible to JavaScript
- ✅ **Password Hashing** - bcrypt with salt rounds (12)
- ✅ **Role-Based Access Control** - Middleware enforces permissions
- ✅ **Token Rotation** - New tokens issued on refresh

#### Input Validation
- ✅ **Server-side Validation** - Express Validator on all inputs
- ✅ **Client-side Validation** - React Hook Form with schemas
- ✅ **Sanitization** - DOMPurify-like sanitizer for XSS prevention
- ✅ **File Upload Restrictions** - Type and size limits with Multer

#### API Security
- ✅ **CORS Configuration** - Whitelist specific origins
- ✅ **Rate Limiting** - Express Rate Limit prevents abuse
- ✅ **Error Handling** - No sensitive info in error messages
- ✅ **Environment Variables** - Secrets in `.env`, never committed

#### Data Protection
- ✅ **MongoDB Injection Prevention** - Mongoose schema validation
- ✅ **Sensitive Data Exclusion** - DTOs filter passwords from responses
- ✅ **HTTPS Recommended** - For production deployments

### Security Checklist for Production

- [ ] Change all default secrets in `.env`
- [ ] Use strong, random JWT secrets (32+ characters)
- [ ] Enable HTTPS/TLS for API and frontend
- [ ] Set secure cookie flags: `httpOnly`, `secure`, `sameSite`
- [ ] Configure MongoDB authentication
- [ ] Restrict CORS to production domain only
- [ ] Set up database backups
- [ ] Implement request logging and monitoring
- [ ] Add CSRF protection for state-changing operations
- [ ] Use helmet.js for HTTP header security
- [ ] Set up rate limiting per user/IP
- [ ] Regularly update dependencies (`npm audit fix`)

### Environment Variable Security

**Never commit `.env` files!** Use `.env.example` as template.

Generate secure secrets:
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example: a1b2c3d4e5f6...
```

---

## 🚀 Future Plans

### Short-term Roadmap (Q1-Q2 2025)

- [x] **Offline Mode** - Complete offline functionality with IndexedDB
- [ ] **TypeScript Migration** - Full codebase migration to TypeScript
- [ ] **Service Workers** - True PWA with background sync
- [ ] **Push Notifications** - Real-time task updates via web push
- [ ] **Advanced Filtering** - Multi-criteria task filtering
- [ ] **Bulk Operations** - Select and update multiple tasks
- [ ] **Task Templates** - Reusable task templates
- [ ] **Dark Mode Enhancements** - Per-component theme customization

### Mid-term Roadmap (Q3-Q4 2025)

- [ ] **WebSocket Integration** - Real-time collaboration
- [ ] **File Attachments** - Attach files to tasks
- [ ] **Comments System** - Task discussions and mentions
- [ ] **Activity Timeline** - Full audit trail of changes
- [ ] **Advanced Analytics** - Charts, reports, team insights
- [ ] **Calendar View** - Deadline visualization
- [ ] **Gantt Chart** - Project timeline view
- [ ] **Mobile App** - React Native iOS/Android app

### Long-term Vision (2026+)

- [ ] **AI-powered Features**
  - Smart task prioritization
  - Deadline prediction
  - Workload balancing
  - Automated task assignment
- [ ] **Advanced Permissions** - Granular role-based access
- [ ] **Multi-tenancy** - Organization/workspace support
- [ ] **Integrations** - Slack, GitHub, Jira, etc.
- [ ] **API Versioning** - Public API for third-party apps
- [ ] **Localization** - Multi-language support (EN, RU, ES, FR)
- [ ] **Performance Optimization** - Virtual scrolling, lazy loading
- [ ] **Accessibility** - WCAG 2.1 AA compliance

### Community Contributions Welcome!

We welcome contributions in:
- Bug fixes and issue reporting
- Feature implementations from roadmap
- Documentation improvements
- Test coverage expansion
- UI/UX enhancements

See [Contributing](#-contributing) section below.

---

## 🤝 Contributing

We love contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Panel-dashboard.git
   cd Panel-dashboard
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # Examples: feature/add-tags, fix/login-bug, docs/api-guide
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add task tagging system"
   # Use conventional commits: feat, fix, docs, style, refactor, test, chore
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template
   - Wait for review

### Contribution Guidelines

#### Code Style
- **JavaScript**: Follow ESLint rules, use modern ES6+ syntax
- **React**: Functional components with hooks, prop-types for validation
- **Comments**: Write self-documenting code, add comments for complex logic
- **Naming**: Descriptive variable names (`isAuthenticated` not `auth`)

#### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Tooling, dependencies, config

**Examples:**
```
feat(kanban): add drag-and-drop for task cards
fix(auth): resolve token refresh infinite loop
docs(readme): add offline mode testing guide
test(tasks): add unit tests for taskStore
```

#### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] New features have test coverage
- [ ] Documentation updated (README, code comments)
- [ ] No console errors or warnings
- [ ] Commit messages follow convention
- [ ] PR description clearly explains changes
- [ ] Screenshots included for UI changes

#### Areas for Contribution

**Good First Issues:**
- Documentation improvements
- UI/UX enhancements
- Test coverage expansion
- Bug fixes
- Translation/localization

**Advanced Features:**
- TypeScript migration
- WebSocket real-time updates
- Service Worker implementation
- Advanced analytics
- Mobile app development

### Code Review Process

1. Maintainers will review your PR within 3-5 business days
2. Address feedback with new commits (don't force push)
3. Once approved, maintainers will merge
4. Your contribution will be credited in release notes

### Reporting Bugs

Found a bug? Please [open an issue](https://github.com/yourusername/Panel-dashboard/issues/new) with:

- **Title**: Short, descriptive summary
- **Description**: Detailed explanation
- **Steps to Reproduce**: Numbered list
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: OS, browser, Node version, etc.

### Suggesting Features

Have an idea? [Open a feature request](https://github.com/yourusername/Panel-dashboard/issues/new) with:

- **Use Case**: Why is this needed?
- **Proposed Solution**: How would it work?
- **Alternatives**: Other options considered
- **Additional Context**: Mockups, examples, references

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Panel Dashboard Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Authors & Contributors

**Lead Developer:** [Your Name](https://github.com/yourusername)

**Contributors:**
<!-- This will be auto-generated from git history -->
- See [Contributors](https://github.com/yourusername/Panel-dashboard/graphs/contributors)

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/Panel-dashboard/issues)
- **Email**: your-email@example.com
- **Documentation**: [Full Docs](https://github.com/yourusername/Panel-dashboard/wiki)
- **Changelog**: [Release History](https://github.com/yourusername/Panel-dashboard/releases)

---

## 🙏 Acknowledgments

This project uses and is inspired by many amazing open-source libraries and tools:

- **UI Inspiration**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Offline Storage**: [Dexie.js](https://dexie.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)

Special thanks to all contributors and the open-source community! 💙

---

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub! It helps others discover the project.

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/Panel-dashboard&type=Date)](https://star-history.com/#yourusername/Panel-dashboard&Date)

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⬆ Back to Top](#task-management-dashboard)

</div>
