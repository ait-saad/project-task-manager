# Project Task Manager

A full-stack project management application that allows users to create projects, manage tasks, and track progress with a beautiful, responsive interface.

## 🛠️ Tools & Technologies

### Backend
- **Java 21** with **Spring Boot 3.4.1**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database (with H2 fallback for development)
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

### Frontend
- **React 18** with **TypeScript**
- **React Router** for navigation
- **Axios** for API communication
- **Custom CSS** with animations and responsive design
- **Jest & React Testing Library** for testing

### Database
- **PostgreSQL 15** (production)
- **H2 Database** (development/testing)
- **Docker Compose** for containerized deployment

## 🚀 Quick Start

### Prerequisites
- **Java 21** or higher
- **Node.js 16** or higher
- **PostgreSQL** (if running without Docker)
- **Docker & Docker Compose** (for containerized setup)

## 📦 Running with Docker Compose (Recommended)

The easiest way to run the entire application:

```bash
# Clone the repository
git clone <your-repo-url>
cd project-task-manager

# Build and start all services
docker-compose build --no-cache
docker-compose up

# Or run in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Service URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## 🗄️ Database Setup

### Manual PostgreSQL Setup (Local Development)

1. **Install PostgreSQL** and create database:
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE taskmanager;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO postgres;
```

2. **Environment Variables** (optional):
```bash
# Linux/macOS
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskmanager
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
export JWT_SECRET=your-secret-key-here

# Windows PowerShell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/taskmanager"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgres"
$env:JWT_SECRET="your-secret-key-here"
```

### Database Initialization
- Tables are **automatically created** by Hibernate on startup
- Initial schema uses `hibernate.ddl-auto=update`
- Custom initialization scripts can be added to `database/init.sql`

## ⚙️ Backend Setup & Usage

### Running the Backend

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Using Maven Wrapper** (recommended):
```bash
# Linux/macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

3. **Using installed Maven**:
```bash
mvn spring-boot:run
```

4. **Building JAR file**:
```bash
# Clean and build
./mvnw clean package

# Run the JAR
java -jar target/taskmanager-0.0.1-SNAPSHOT.jar
```

### Backend Configuration
- **Default Port**: 8080
- **Profiles**: `default`, `docker`
- **Health Check**: http://localhost:8080/actuator/health

### API Endpoints

#### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
```

#### Projects
```
GET    /api/projects           # Get all user projects
POST   /api/projects           # Create new project
GET    /api/projects/{id}      # Get project details
PUT    /api/projects/{id}      # Update project
DELETE /api/projects/{id}      # Delete project
```

#### Tasks
```
GET    /api/projects/{projectId}/tasks              # Get all tasks
POST   /api/projects/{projectId}/tasks              # Create task
PUT    /api/projects/{projectId}/tasks/{taskId}     # Update task
PATCH  /api/projects/{projectId}/tasks/{taskId}/toggle  # Toggle completion
DELETE /api/projects/{projectId}/tasks/{taskId}     # Delete task
GET    /api/tasks                                   # Get all user tasks
```

### Authentication
All endpoints except `/api/auth/**` require JWT token:
```
Authorization: Bearer <your-jwt-token>
```

## 🖥️ Frontend Setup & Usage

### Running the Frontend

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set API URL** (for local development):
```bash
# Linux/macOS
export REACT_APP_API_BASE=http://localhost:8080/api

# Windows PowerShell
$env:REACT_APP_API_BASE="http://localhost:8080/api"

# Windows Command Prompt
set REACT_APP_API_BASE=http://localhost:8080/api
```

4. **Start development server**:
```bash
npm start
```

5. **Build for production**:
```bash
npm run build
```

### Frontend Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **User Authentication** - Login/Register with form validation
- **Project Management** - Create, view, edit, and delete projects
- **Task Management** - Full CRUD operations for tasks
- **Progress Tracking** - Visual progress bars and completion statistics
- **Real-time Updates** - Optimistic UI updates for better UX
- **Cross-Project View** - See all tasks across projects
- **Status Management** - Track task status (Not Started, In Progress, Done)

### Test Credentials
```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report

# Run specific test class
./mvnw test -Dtest=AuthControllerTest

# Skip tests during build
./mvnw clean package -DskipTests
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in CI mode
npm test -- --ci --coverage --watchAll=false

# Run specific test file
npm test -- AuthService.test.tsx

# Update snapshots
npm test -- --updateSnapshot
```

### Test Coverage
- **Backend**: Spring Boot Test, JUnit 5, Mockito
- **Frontend**: Jest, React Testing Library
- **Integration**: Spring Security Test

## 🐳 Docker Setup

### Individual Services

#### Backend Dockerfile
```bash
cd backend
docker build -t taskmanager-backend .
docker run -p 8080:8080 taskmanager-backend
```

#### Frontend Dockerfile
```bash
cd frontend
docker build -t taskmanager-frontend .
docker run -p 3000:80 taskmanager-frontend
```

### Docker Compose Services
- **database**: PostgreSQL 15 with persistent volume
- **backend**: Spring Boot app with health checks
- **frontend**: React app served by Nginx

### Docker Commands
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose build backend
docker-compose up backend

# Access database
docker-compose exec database psql -U postgres -d taskmanager
```

## 📂 Project Structure

```
project-task-manager/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/hahn/taskmanager/
│   │   ├── controller/         # REST Controllers
│   │   ├── service/           # Business Logic
│   │   ├── repository/        # Data Access Layer
│   │   ├── entity/           # JPA Entities
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── security/         # Security Configuration
│   │   └── TaskManagerApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-docker.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React TypeScript SPA
│   ├── src/
│   │   ├── components/        # Reusable Components
│   │   ├── pages/            # Page Components
│   │   ├── context/          # React Context
│   │   ├── services/         # API Services
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql              # Database Initialization
├── docker-compose.yml        # Multi-service setup
└── README.md
```

## 🌟 Features

### Core Features
- ✅ User Authentication (JWT)
- ✅ Project CRUD Operations
- ✅ Task CRUD Operations
- ✅ Progress Tracking
- ✅ Task Status Management
- ✅ Responsive UI Design

### Advanced Features
- ✅ Cross-Project Task View
- ✅ Animated Progress Indicators
- ✅ Optimistic UI Updates
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ Docker Support
- ✅ Health Checks

## 🚦 Environment Variables

### Backend
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskmanager
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLong123456789
JWT_EXPIRATION=86400000
```

### Frontend
```bash
REACT_APP_API_BASE=http://localhost:8080/api
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**:
```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

2. **Database Connection Issues**:
- Ensure PostgreSQL is running
- Check database credentials
- Verify database exists

3. **CORS Issues**:
- Ensure frontend URL is in backend CORS configuration
- Check API base URL in frontend

4. **Docker Issues**:
```bash
# Remove all containers and volumes
docker-compose down -v
docker system prune -f

# Rebuild from scratch
docker-compose build --no-cache
```

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries for user-based filtering
- **Connection Pooling**: Configured HikariCP for efficient DB connections
- **Caching**: Browser caching for static assets
- **Bundle Size**: Optimized React build for production

## 🔒 Security

- **Password Hashing**: BCrypt encryption
- **JWT Tokens**: Stateless authentication with expiration
- **CORS**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection**: Protected via JPA/Hibernate

## 🎬 Demo

- **Screenshots**: (Add your screenshots here)
- **Demo Video**: (Add your video link here)

## 📝 License

This project is part of Hahn Software Morocco end-of-studies internship technical evaluation.

## 🤝 Contributing

This is a technical assessment project. For questions or feedback, please contact the evaluation team.

