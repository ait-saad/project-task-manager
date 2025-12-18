# Project Task Manager

A full‑stack app to manage projects and tasks with authentication.

## Quick Start (Local, no Docker)
1) Database (PostgreSQL)
- Create DB taskmanager (defaults: user postgres / password postgres)

2) Backend
```bash
cd backend
# (optional) set envs SPRING_DATASOURCE_URL/USERNAME/PASSWORD, JWT_SECRET
mvn spring-boot:run
```
- API: http://localhost:8080
- Test users: john@example.com / jane@example.com (password: password123)

3) Frontend (dev)
```bash
cd frontend
# point to local API during dev
# Linux/macOS: export REACT_APP_API_BASE=http://localhost:8080/api
# Windows PS:  $env:REACT_APP_API_BASE = "http://localhost:8080/api"
npm install
npm start
```
- App: http://localhost:3000

## Docker Compose (optional)
```bash
docker-compose build --no-cache
docker-compose up
```
- DB: 5432, API: 8080, Frontend: 3000

## Endpoints
- POST /api/auth/login
- CRUD: /api/projects, /api/projects/{id}
- Tasks: /api/projects/{projectId}/tasks (incl. /{taskId}/toggle)
- Use header: Authorization: Bearer <token>

## Demo
- Screenshots: (keep your images here)
- Demo link: (add your video link)

