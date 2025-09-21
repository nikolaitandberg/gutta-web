#!/bin/bash

# Alternative docker setup script using 'docker compose' (newer syntax)
echo "🐳 Setting up Gutta Web with Docker (using docker compose)..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version > /dev/null 2>&1; then
    echo "❌ 'docker compose' is not available."
    echo "Please install Docker Compose plugin or use legacy docker-compose"
    exit 1
fi

echo "✅ Using: docker compose"

# Create .env.docker if it doesn't exist
if [ ! -f .env.docker ]; then
    echo "📄 Creating .env.docker from template..."
    cp .env.docker.example .env.docker
    echo "✅ Created .env.docker - you can edit this file to customize settings"
fi

echo "🏗️  Building and starting containers..."
docker compose -f docker-compose.dev.yml up -d --build

echo "⏳ Waiting for database to be ready..."
timeout=60
counter=0
until docker compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres -d gutta_web > /dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        echo "❌ Database failed to start within $timeout seconds"
        echo "🔍 Check logs with: docker compose -f docker-compose.dev.yml logs db"
        exit 1
    fi
    echo "⏳ Database is starting up... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

echo "📊 Setting up database schema..."
docker compose -f docker-compose.dev.yml exec -T app npm run setup:db

echo "✅ Setup complete!"
echo ""
echo "🚀 Your application is running at:"
echo "   App:      http://localhost:3000"
echo "   DB Admin: http://localhost:8080"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker compose -f docker-compose.dev.yml logs -f app"
echo "   Stop:         docker compose -f docker-compose.dev.yml down"
echo "   Clean up:     docker compose -f docker-compose.dev.yml down -v"
echo ""
echo "🎉 Happy coding!"