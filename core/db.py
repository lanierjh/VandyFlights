import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from google.colab import auth
import os
from google.cloud.sql.connector import Connector


auth.authenticate_user()

dotenv_path = os.path.join('../','.env')
load_dotenv(dotenv_path)

username = os.getenv("SQL_USERNAME")
password = os.getenv("SQL_PASSWORD")

#hidden username and password
INSTANCE_CONNECTION_NAME = "silicon-outcome-439221-p9:us-central1:vandyflights"

connector = Connector()

DB_USER = "chef"
DB_PASS = "food"
DB_NAME = "sandwiches"

# function to return the database connection object
def getconn():
    conn = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pymysql",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME
    )
    return conn

# create connection pool with 'creator' argument to our connection object function
pool = sqlalchemy.create_engine(
    "mysql+pymysql://",
    creator=getconn,
)

# SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{username}:{password}@127.0.0.1:3306/vandyflights"

# engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
# SessionLocal()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()