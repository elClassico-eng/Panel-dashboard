# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack task management dashboard application with separate client and server components. The project is currently in active development and is planned to migrate from JavaScript to TypeScript in the near future.

### Architecture

**Client (Frontend)**
- React 18 with Vite build tool
- State management using Zustand with persistence
- UI components using Radix UI, Material-UI, and custom components
- Drag-and-drop functionality with @dnd-kit
- Styling with Tailwind CSS 4.0
- Testing with Vitest and React Testing Library
- File uploads and image handling

**Server (Backend)**
- Node.js/Express API server
- MongoDB with Mongoose ODM
- JWT authentication with refresh tokens
- Email service with Nodemailer
- File upload handling with Multer
- Role-based access control

### Key Development Commands

**Frontend (client/)**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build

**Backend (server/)**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Root Level**
- Contains shared dependencies for @dnd-kit packages

## State Management Architecture

The application uses Zustand for state management with two main stores:

**userStore.js** (`client/src/store/userStore.js`)
- Handles authentication state and user management
- Includes registration, login, logout, profile updates
- Persisted to localStorage
- Error handling for auth operations

**taskStore.js** (`client/src/store/taskStore.js`)
- Manages task CRUD operations and filtering
- Role-based task loading (project managers see all tasks, employees see assigned tasks)
- Integration with backend task services

## Component Structure

**Key Component Categories:**
- `AuthForm/` - Login and registration forms
- `Kanban/` - Task board with drag-and-drop functionality
- `Home/` - Dashboard widgets and task summaries
- `Setting/` - User preferences and appearance settings
- `ui/` - Reusable UI components built on Radix UI

## API Integration

**Services** (`client/src/services/`)
- `AuthServices.js` - Authentication endpoints
- `TaskServices.js` - Task CRUD operations
- `FileServices.js` - File upload operations

All API calls use Axios with base configuration in `client/src/http/index.js`.

## Database Models

**Server Models** (`server/models/`)
- `user-models.js` - User schema with roles and authentication
- `task-model.js` - Task schema with assignments and status
- `token-model.js` - Refresh token storage

## Environment Requirements

**Frontend**: Requires modern Node.js with ES modules support
**Backend**: Uses CommonJS modules, requires MongoDB connection

## Testing Configuration

- Tests configured with Vitest and jsdom environment
- Setup files in `client/src/test/setup.js`
- Uses React Testing Library for component testing
- ESLint rules warn on unused variables and missing prop-types

## File Upload System

The application includes file upload capabilities:
- Server handles uploads in `/images` directory
- Client components for avatar uploads
- Multer middleware for file processing

## Development Notes

- The project uses path aliases (`@/` maps to `src/`)
- Russian language interface and comments
- Role-based permissions (Project Manager vs Employee)
- Responsive design with Tailwind CSS
- Theme switching capability with next-themes