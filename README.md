# Project Task Manager

A full-stack web application for managing projects and tasks with user authentication.

## Tech Stack

- **Backend**: Spring Boot 3.4.1 (Java 21)
- **Frontend**: React 18 with TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Features

- User authentication (login with JWT)
- Create, view, update, and delete projects
- Create, view, update, and delete tasks within projects
- Mark tasks as completed
- Track project progress with visual progress bars
- Responsive design

## Prerequisites

Before running this application, make sure you have:

- Java 21 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.9 or higher

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:

```sql
CREATE DATABASE taskmanager;
```

3. The default configuration uses:
   - Host: localhost
   - Port: 5432
   - Database: taskmanager
   - Username: postgres
   - Password: postgres

You can modify these settings in `backend/src/main/resources/application.properties`

## Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the application:
```bash
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

## Running the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Test Credentials

The application comes with pre-configured test users:

| Email | Password |
|-------|----------|
| john@example.com | password123 |
| jane@example.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password

### Projects
- `GET /api/projects` - Get all projects for current user
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/{id}` - Update a project
- `DELETE /api/projects/{id}` - Delete a project

### Tasks
- `GET /api/projects/{projectId}/tasks` - Get all tasks for a project
- `POST /api/projects/{projectId}/tasks` - Create a new task
- `PUT /api/projects/{projectId}/tasks/{taskId}` - Update a task
- `PATCH /api/projects/{projectId}/tasks/{taskId}/toggle` - Toggle task completion
- `DELETE /api/projects/{projectId}/tasks/{taskId}` - Delete a task

## Project Structure

```
project-task-manager/
├── backend/
│   └── src/main/java/com/hahn/taskmanager/
│       ├── config/          # Security and app configuration
│       ├── controller/      # REST API controllers
│       ├── dto/             # Data Transfer Objects
│       ├── entity/          # JPA entities
│       ├── exception/       # Exception handlers
│       ├── repository/      # Data access layer
│       ├── security/        # JWT and auth components
│       └── service/         # Business logic
├── frontend/
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # React Context (Auth)
│       ├── pages/           # Page components
│       ├── services/        # API service
│       └── types/           # TypeScript interfaces
└── README.md
```

## Demo Video

[Link to demo video will be added here]

## Screenshots

### Login Page
The login page with a clean, modern design featuring gradient colors.

### Projects Dashboard
View all your projects with progress indicators and quick actions.

### Project Details
Manage tasks within a project, mark them as complete, and track progress.
