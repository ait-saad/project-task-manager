#!/bin/bash

# Project Task Manager - Docker Startup Script
# This script builds and starts the entire application stack

echo "🚀 Starting Project Task Manager Application..."
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ Error: Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker is running"
echo "✅ Docker Compose is available"
echo ""

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."

# Wait for database to be ready
echo "   📊 Waiting for database..."
until docker-compose exec -T database pg_isready -U postgres > /dev/null 2>&1; do
    sleep 2
done
echo "   ✅ Database is ready"

# Wait for backend to be ready
echo "   🔧 Waiting for backend..."
until curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; do
    sleep 2
done
echo "   ✅ Backend is ready"

# Wait for frontend to be ready
echo "   🌐 Waiting for frontend..."
until curl -s http://localhost:3000/health > /dev/null 2>&1; do
    sleep 2
done
echo "   ✅ Frontend is ready"

echo ""
echo "🎉 Application is now running!"
echo "======================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080/api"
echo "📊 Database: localhost:5432"
echo ""
echo "🔐 Test Credentials:"
echo "   Email:    john@example.com"
echo "   Password: password123"
echo ""
echo "   Email:    jane@example.com"
echo "   Password: password123"
echo ""
echo "📋 Useful Commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop app:      docker-compose down"
echo "   Reset data:    docker-compose down -v"
echo "   Restart:       docker-compose restart"
echo ""
echo "🎯 Ready for Hahn Software Internship Demo!"
echo "======================================="