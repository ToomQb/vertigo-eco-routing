from logging.config import fileConfig
from sqlalchemy import create_engine, text
from alembic import context

from app.config.database import Base, DATABASE_URL
from app.models import user, emission

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
config.set_main_option('sqlalchemy.url', DATABASE_URL)

engine = create_engine(DATABASE_URL) 

with engine.begin() as connection:
    version = connection.execute(text("SELECT version()")).scalar()
    dbname  = connection.execute(text("SELECT current_database()")).scalar()
    user    = connection.execute(text("SELECT current_user")).scalar()

    print(f"🧠 PostgreSQL version: {version}")
    print(f"📂 Connected database: {dbname}")
    print(f"👤 Connected user:     {user}")

    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )
    
    current_rev = context.get_context().get_current_revision()
    print("🔁 Current DB revision:", current_rev)
    print("🚀 Running migrations...")
    result = context.run_migrations()
    print("✅ Migrations done:", result)



