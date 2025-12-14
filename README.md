# Project Task Manager

A full-stack web application for managing projects and tasks with user authentication.

## Tech Stack
- Backend: Spring Boot 3 (Java 21), Spring Security (JWT), Spring Data JPA, Actuator
- Database: PostgreSQL (default and required)
- Frontend: React 18 + TypeScript, CRA build served by Nginx in Docker
- Containerization: Docker, Docker Compose

## Features
- Authentication (JWT): login/logout, protected routes
- Projects: CRUD, progress (completed/total)
- Tasks: CRUD, mark as done/undone
- UI: Clean layout, immediate logout redirect, projects pagination

## Prerequisites
- Java 21 (java -version)
- Maven 3.9+ (mvn -v)
- Node.js 18+ (for local frontend dev)
- Docker Desktop (for containerized run)

---
## Running locally (without Docker)

### Backend
```bash
cd backend
mvn spring-boot:run
```
Configuration defaults (application.properties):
- Database: Postgres (jdbc:postgresql://localhost:5432/taskmanager)
- Username/password: postgres/postgres
- You can override via env vars: SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD
- Health endpoint: http://localhost:8080/actuator/health

Test users (seeded at startup):
- john@example.com / password123
- jane@example.com / password123

### Frontend (dev mode)
```bash
cd frontend
npm install
npm start
```
- App: http://localhost:3000

---
## Running with Docker Compose (recommended)

```bash
# from project-task-manager root
docker-compose build --no-cache
docker-compose up
```

Services:
- database: Postgres 15 (port 5432)
- backend: Spring Boot API (port 8080)
- frontend: Nginx serving React build (port 3000)

Notes:
- The backend waits for Postgres and exposes /actuator/health for the compose healthcheck.
- Healthcheck timings are relaxed to avoid false negatives on cold starts.
- Frontend healthcheck pings "/" (served by Nginx) and becomes healthy when static content is ready.

Environment passed from docker-compose to backend:
- SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/taskmanager
- SPRING_DATASOURCE_USERNAME=postgres
- SPRING_DATASOURCE_PASSWORD=postgres
- JWT_SECRET, JWT_EXPIRATION

Stop containers:
```bash
docker-compose down
```

Persisted data:
- PostgreSQL volume: taskmanager-postgres-data

---
## API Overview

Auth
- POST /api/auth/login
  - Body: { "email": "john@example.com", "password": "password123" }
  - Returns: { token, email, name }

Projects
- GET /api/projects
- GET /api/projects/{id}
- POST /api/projects
- PUT /api/projects/{id}
- DELETE /api/projects/{id}

Tasks (scoped to a project)
- GET /api/projects/{projectId}/tasks
- POST /api/projects/{projectId}/tasks
- PUT /api/projects/{projectId}/tasks/{taskId}
- PATCH /api/projects/{projectId}/tasks/{taskId}/toggle
- DELETE /api/projects/{projectId}/tasks/{taskId}

Headers for protected endpoints:
- Authorization: Bearer <JWT_TOKEN>

---
## Frontend Usage
- Login with the test accounts above.
- Projects page:
  - Create new project
  - Paginate projects (page size selector and next/prev)
  - Navigate to project details
- Project details:
  - View progress bar (auto-updates)
  - Add/edit/delete tasks
  - Toggle done/undone via checkbox
- Logout immediately redirects to /login

---
## Configuration & Environment

Backend (application.properties):
- Postgres only (H2 removed)
- Hikari waits up to 60s for DB readiness: `spring.datasource.hikari.initialization-fail-timeout=60000`
- Actuator health enabled and exposed: `management.endpoints.web.exposure.include=health,info`

Override DB via environment variables:
- SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD

JWT:
- jwt.secret, jwt.expiration can be overridden via env vars (JWT_SECRET, JWT_EXPIRATION)

---
## Troubleshooting
- Backend unhealthy in Docker Compose
  - Run `docker-compose up` (no -d) and watch backend logs
  - Ensure DB is healthy first; backend healthcheck has a start period and retries
  - Verify DB env vars and credentials
- Frontend build issues in Docker
  - The Docker build uses `npm install` with package.json to avoid lock mismatches.
- Port conflicts
  - Adjust published ports in docker-compose.yml (e.g., "8081:8080" for backend)

---
## Project Structure
```
project-task-manager/
├── backend/
│   ├── src/main/java/com/hahn/taskmanager/
│   │   ├── config/          # Security and config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # DTOs
│   │   ├── entity/          # Entities
│   │   ├── exception/       # Global exception handler
│   │   ├── repository/      # JPA repositories
│   │   └── service/         # Business logic
│   ├── src/main/resources/application.properties
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/ (if any)
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── Dockerfile
└── docker-compose.yml
```

---
## Demo
- Add screenshots and/or a short video link here.
