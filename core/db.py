from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://admin:anchordown@127.0.0.1:3306/vandyflights"
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://admin:anchordown@localhost:3306/vandyflights"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
# SessionLocal()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()