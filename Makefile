.PHONY: dev build start stop seed logs clean

# Start all services in development mode with hot reload
dev:
	docker compose up --build

# Build all containers without starting them
build:
	docker compose build

# Start services in background
start:
	docker compose up -d --build

# Stop all services
stop:
	docker compose down

# Run database seed script
seed:
	docker compose exec backend python seed.py

# Generate a new Alembic migration
migration:
	docker compose exec backend alembic revision --autogenerate -m "$(msg)"

# Apply pending migrations
migrate:
	docker compose exec backend alembic upgrade head

# View logs
logs:
	docker compose logs -f

# View backend logs only
logs-backend:
	docker compose logs -f backend

# Remove all containers, volumes, and build cache
clean:
	docker compose down -v --rmi local

# Reset database and re-seed
reset:
	docker compose down -v
	docker compose up -d --build
	@echo "Waiting for services to start..."
	@sleep 5
	docker compose exec backend python seed.py
