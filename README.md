
## Back-end

### Structure

```bash
.
├── back
│   ├── app  # Contains the main application files.
│   │   ├── __init__.py  # This is what allows importing code from one file into another.
│   │   ├── main.py      # Initializes the FastAPI application.
│   │   ├── alembic.ini  # config file for alembic
│   │   ├── routers
│   │   │   ├── __init__.py
│   │   │   └── .  # Defines routes and endpoints
│   │   ├── config
│   │   │   ├── __init__.py
│   │   │   └── database.py  # Defines database config.
│   │   ├── models
│   │   │   ├── __init__.py
│   │   │   └── .  # Defines database models.
│   │   ├── crud
│   │   │   ├── __init__.py
│   │   │   └── .  # Defines CRUD operations.
│   │   ├── schemas
│   │   │   ├── __init__.py
│   │   │   └── . # Defines schemas (pydantic).
│   │   ├── services
│   │   │   ├── __init__.py
│   │   │   └── . # Defines usefull and resusable function (to avoid too big controllers in routers/)
│   │   ├── external_services
│   │   │   ├── __init__.py
│   │   │   ├── email.py          # Defines functions for sending emails.
│   │   │   └── notification.py   # Defines functions for sending notifications
│   │   └── alembic
│   │       └── .
│   ├── tests
│   │   ├── __init__.py
│   │   ├── test_main.py
│   │   └── test_xxx.py # Tests for the xxx module.
│   └── requirements.txt
├── front
│   ├── .
│   .
```

### Getting Started

1. [Create a virtual environment](#create-virtual-environment)
1. [Activate the virtual environment](#activate-virtual-environment)
1. [Install the dependencies](#install-dependencies)
1. [Setup environment variables](#setup-environment-variables)
1. [Create database](#create-database)
1. [Run the application](#run-the-application)

### Virtual environment

#### Create virtual environment

```bash
python3 -m venv venv
```

#### Activate virtual environment

| Platform | Shell      | Command to activate virtual environment |
| -------- | ---------- | --------------------------------------- |
| POSIX    | bash/zsh   | `$ source <venv>/bin/activate`          |
| POSIX    | fish       | `$ source <venv>/bin/activate.fish`     |
| POSIX    | csh/tcsh   | `$ source <venv>/bin/activate.csh`      |
| POSIX    | PowerShell | `$ <venv>/bin/Activate.ps1`             |
| Windows  | cmd.exe    | `C:\> <venv>\Scripts\activate.bat`      |
| Windows  | PowerShell | `PS C:\> <venv>\Scripts\Activate.ps1`   |

#### Deactivate virtual environment

```bash
deactivate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

### Run the application

```bash
uvicorn main:app --host 0.0.0.0 --port 3002
# or
python3 main.py
```

### Test types

```bash
pyright
```

### Setup environment Variables

Create a `.env` file (back/.env) and add the following environment variables:

```bash
ORS_API_KEY = "your_openrouteservice_api_key"
# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

DATABASE_USERNAME=postgres
DATABASE_PASSWORD=mysecretpassword
DATABASE_IP=localhost
DATABASE_NAME=db_name
DATABASE_PORT=5432
```

### Database

#### Create database

```bash
docker run -p 127.0.0.1:5432:5432 --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres

docker exec -it some-postgres psql -U postgres
# or
psql -h localhost -U postgres

CREATE DATABASE db_name;

\q # Quit psql
```

### API docs (Swagger)

```
/docs
```

### Alembic commands

```bash
alembic revision --autogenerate -m "message de migration"
alembic upgrade head
```