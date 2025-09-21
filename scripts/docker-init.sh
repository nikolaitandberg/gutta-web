#!/bin/bash

echo "🐳 Setting up Gutta Web with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env.docker if it doesn't exist
if [ ! -f .env.docker ]; then
    echo "📄 Creating .env.docker from template..."
    cp .env.docker.example .env.docker
    echo "✅ Created .env.docker - you can edit this file to customize settings"
fi

echo "🏗️  Building and starting containers..."
docker-compose -f docker-compose.dev.yml up -d --build

echo "⏳ Waiting for database to be ready..."
until docker-compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres -d gutta_web; do
    echo "⏳ Database is starting up..."
    sleep 2
done

echo "📊 Setting up database schema..."
docker-compose -f docker-compose.dev.yml exec -T app npm run setup:db

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