# AINotion Backend

A clean architecture .NET Core backend for the AINotion application.

## Project Structure

```
backend/
├── src/
│   ├── API/              # ASP.NET Core API layer
│   ├── Application/      # Business logic and application services
│   ├── Domain/           # Domain entities and business rules
│   ├── Infrastructure/   # Data access and external services
│   └── Shared/           # Shared utilities and extensions
├── tests/                # Unit and integration tests
├── docker/               # Docker configuration
└── Configuration files   # .env, docker-compose.yml, etc.
```

## Getting Started

### Prerequisites
- .NET 8.0 or higher
- SQL Server or Docker
- Visual Studio Code or Visual Studio

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Configure environment variables**
   - Copy `.env` and update with your settings

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Or run locally**
   ```bash
   dotnet restore
   dotnet run --project src/API/AINotion.API.csproj
   ```

## API Documentation

Once the API is running, visit:
- Swagger UI: `https://localhost:5001/swagger`

## Testing

```bash
dotnet test
```

## License

Proprietary - All rights reserved
