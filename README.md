# TFS

A monorepo project with Express.js server and PostgreSQL database.

## Structure

```
tfs/
├── apps/
│   └── server/          # Express.js API server
├── packages/            # Shared packages (future)
└── infrastructure/      # Docker Compose for PostgreSQL
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL:
```bash
docker compose -f infrastucture/docker-compose.yml up -d
```

3. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start the server in development mode with hot reload
- `npm run start` - Start the server in production mode
- `npm run build` - Build all workspaces

## Database

PostgreSQL is configured in `infrastucture/docker-compose.yml`:
- Host: `localhost`
- Port: `5432`
- Database: `tfs`
- User: `postgres`
- Password: `postgres`
