#!/bin/bash

echo "🐳 Setting up Gutta Web with Docker..."

# Function to detect docker compose command
get_docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    elif docker compose version &> /dev/null; then
        echo "docker compose"
    else
        echo ""
    fi
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Get the correct docker compose command
DOCKER_COMPOSE=$(get_docker_compose_cmd)
if [ -z "$DOCKER_COMPOSE" ]; then
    echo "❌ Neither 'docker-compose' nor 'docker compose' is available."
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Using: $DOCKER_COMPOSE"

# Create .env.docker if it doesn't exist
if [ ! -f .env.docker ]; then
    echo "📄 Creating .env.docker from template..."
    cp .env.docker.example .env.docker
    echo "✅ Created .env.docker - you can edit this file to customize settings"
fi

echo "🏗️  Building and starting containers..."
$DOCKER_COMPOSE -f docker-compose.dev.yml up -d --build

echo "⏳ Waiting for database to be ready..."
timeout=60
counter=0
until $DOCKER_COMPOSE -f docker-compose.dev.yml exec -T db pg_isready -U postgres -d gutta_web > /dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        echo "❌ Database failed to start within $timeout seconds"
        echo "🔍 Check logs with: $DOCKER_COMPOSE -f docker-compose.dev.yml logs db"
        exit 1
    fi
    echo "⏳ Database is starting up... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

echo "📊 Setting up database schema..."
$DOCKER_COMPOSE -f docker-compose.dev.yml exec -T app npm run setup:db

echo "✅ Setup complete!"
echo ""
echo "🚀 Your application is running at:"
echo "   App:      http://localhost:3000"
echo "   DB Admin: http://localhost:8080"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker-compose -f docker-compose.dev.yml logs -f app"
echo "   Stop:         npm run docker:down"
echo "   Clean up:     npm run docker:clean"
echo ""
echo "🎉 Happy coding!"