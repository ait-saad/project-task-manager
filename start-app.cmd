@echo off
REM Project Task Manager - Docker Startup Script for Windows
REM This script builds and starts the entire application stack

echo.
echo 🚀 Starting Project Task Manager Application...
echo =======================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo ✅ Docker Compose is available
echo.

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

echo.
echo ⏳ Waiting for services to be healthy...

REM Wait for database to be ready
echo    📊 Waiting for database...
:waitdb
docker-compose exec -T database pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto waitdb
)
echo    ✅ Database is ready

REM Wait for backend to be ready
echo    🔧 Waiting for backend...
:waitbackend
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto waitbackend
)
echo    ✅ Backend is ready

REM Wait for frontend to be ready
echo    🌐 Waiting for frontend...
:waitfrontend
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto waitfrontend
)
echo    ✅ Frontend is ready

echo.
echo 🎉 Application is now running!
echo =======================================
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8080/api
echo 📊 Database: localhost:5432
echo.
echo 🔐 Test Credentials:
echo    Email:    john@example.com
echo    Password: password123
echo.
echo    Email:    jane@example.com
echo    Password: password123
echo.
echo 📋 Useful Commands:
echo    View logs:     docker-compose logs -f
echo    Stop app:      docker-compose down
echo    Reset data:    docker-compose down -v
echo    Restart:       docker-compose restart
echo.
echo 🎯 Ready for Hahn Software Internship Demo!
echo =======================================
echo.
pause