from sqlalchemy.orm import Session

from core.models import User
from core.schemas import UserCreate

def create_user(db: Session, user: UserCreate):
    from core.security.util import hash_password
    hashed_password = hash_password(user.password);
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username_or_email(db: Session, username: str, email: str):
    return db.query(User).filter((User.username == username) | (User.email == email)).first()


