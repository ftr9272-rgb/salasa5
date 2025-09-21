import sys
import os
from logging.config import fileConfig

# ensure project root and src on path
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, os.path.abspath(ROOT))
sys.path.insert(0, os.path.abspath(os.path.join(ROOT, 'src')))

from alembic import context
from sqlalchemy import engine_from_config, pool

# this will import your Flask app which initialises db
from src.main import app
from src.models.supplier import db

# Interpret the config file for Python logging.
config = context.config
fileConfig(config.config_file_name)

# Provide the target metadata for 'autogenerate'
target_metadata = db.metadata

# we will get the DB URL from the Flask app config
def get_url():
    return app.config.get('SQLALCHEMY_DATABASE_URI')


def run_migrations_offline():
    url = get_url()
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
        url=get_url()
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
