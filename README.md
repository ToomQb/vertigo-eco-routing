# EcoRoute - Computer Science Master's 2024-2025

## Table of Contents
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Configuration](#installation-and-configuration)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Running Applications](#running-applications)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Database Migration (Alembic)](#database-migration-alembic)
- [Contributing](#contributing)

## Technologies Used

### Backend
- Python 3.10+
- FastAPI
- PostgreSQL
- Alembic
- Docker (for database)

### Frontend
- Node.js v20.19.2
- npm v10.8.2
- TypeScript
- React
- Next.js
- shadcn/ui
- Tailwind CSS

### Tools
- Uvicorn (ASGI server)
- pip (Python dependency management)
- npm (Node.js dependency management)

## Project Structure

```
.
├── back
│   ├── alembic               # Migrations
│   ├── app
│   │   ├── main.py           # FastAPI entry point
│   │   ├── routers           # API routes
│   │   ├── config            # Database configuration
│   │   ├── models            # ORM models
│   │   ├── crud              # CRUD operations
│   │   ├── schemas           # Pydantic schemas
│   │   ├── services          # Utility functions
│   │   └──  external_services # Emails, notifications
│   ├── tests                 # Backend tests
│   └── requirements.txt      # Python dependencies
├── front
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── app               # Next.js pages
│   │   ├── components        # React components
│   │   │   ├── global        # Global components (navbar, map, input, theme...)
│   │   │   ├── ui            # shadcn/ui primitives
│   │   ├── lib               # Libraries, helpers
│   ├── package.json          # Node.js dependencies, npm scripts
│   └── tsconfig.json         # TypeScript configuration
```

## Prerequisites

- Python 3.10+
- Node.js v20.19.2 (with npm v10.8.2)
- Docker (for PostgreSQL database)
- OpenSSL (for generating a secret key if needed)

## Installation and Configuration

### 1. Create and activate Python virtual environment (backend)
```bash
cd back
python3 -m venv venv
source venv/bin/activate   # (Linux/macOS)
# On Windows PowerShell: .\venv\Scripts\Activate.ps1
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Node.js dependencies (frontend)
```bash
cd ../front
npm install
```

### Global Option
To automate everything, you can create a bash script at the root that does everything at once:

```bash
#!/bin/bash
cd back && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../front && npm install
```

### Environment Variables

Create a `.env` file in the `back/` directory with at least:

```env
ORS_API_KEY="your_openrouteservice_key"
SECRET_KEY="09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

DATABASE_USERNAME=postgres
DATABASE_PASSWORD=mysecretpassword
DATABASE_IP=localhost
DATABASE_NAME=db_name
DATABASE_PORT=5432
```

To generate a SECRET_KEY, you can use the command:

```bash
openssl rand -hex 32
```

### Database Setup

Launch PostgreSQL in a Docker container:

```bash
docker run -p 127.0.0.1:5432:5432 --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

Connect to PostgreSQL and create the database:

```bash
docker exec -it some-postgres psql -U postgres
# or
psql -h localhost -U postgres

CREATE DATABASE db_name;
\q
```

## Running Applications

### Backend
From the `back/` folder (with virtual environment activated):

```bash
uvicorn app.main:app --host 0.0.0.0 --port 3002
```

### Frontend
From the `front/` folder:

```bash
npm run dev
```


## Testing

- **Backend**: Use Pyright for static typing, unit tests are located in `back/tests/`

- **Frontend**: Unit tests with Vitest

  1. **Configure Vitest**

     - Create (or modify) a `vite.config.ts` file at the root of the `front` folder with the following content:

     ```ts
     /// <reference types="vitest" />
     import { defineConfig } from 'vite';
     import react from '@vitejs/plugin-react';

     export default defineConfig({
       plugins: [react()],
       test: {
         globals: true,          // Allows using `describe`, `it`, etc. without imports
         environment: 'jsdom',   // Simulates a DOM environment for tests
         setupFiles: './src/setupTests.ts', // Optional setup file run before tests
       },
     });
     ```

  2. **Install necessary dependencies**

     ```bash
     npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
     ```

  3. **Write tests**

     - Place your test files inside `front/src` close to your components, e.g. `front/src/components/navbar.test.tsx`.

  4. **Run tests**

     ```bash
     npm run test
     ```

## API Documentation

Once the backend is running, access the Swagger documentation at:

```
http://localhost:3002/docs
```

## Database Migration (Alembic)

To create a migration after modifying models:

```bash
alembic revision --autogenerate -m "migration message"
alembic upgrade head
```

## Contributing

1. Fork & clone the repository
2. Create a feature/bugfix branch with a descriptive name
3. Follow the code structure (backend and frontend)
4. Write clear commit messages
5. Open a Pull Request for review
6. Ask questions if needed