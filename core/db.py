from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

dotenv_path = os.path.join('../','.env')
load_dotenv(dotenv_path)

username = os.getenv("SQL_USERNAME")
password = os.getenv("SQL_PASSWORD")

#hidden username and password
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{username}:{password}@127.0.0.1:3306/vandyflights"

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