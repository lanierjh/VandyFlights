from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


SECRET_KEY = "84059ec5b41d4127d40ffe8000cc8bb2c88aca3f7a65e8a7bca90c30853c7cb05751dd63908d4bf69d53cd2dd57824c9c39a8f789935447b742d92707d82ec0950d4e3a6c5a8677e13e05c4130a6581ff192695d3a6e6b13cd33aeeb4ec7a2365e31c9d825d33815943aabb86b962b6ad46fdc21d16275f0ec451cecdf3afc6accff72f71b125bbb74c2921c00cc6f928968517179648ab87876ce7e01027661f3b4b4b694279981406aa0d59e20f429e5941a43a5970ee7ba6fe22af4a98374f2a4c3936b0b6e599e0c54e0edaf20bed5a34498d8e5d43551ad0a9870f649d326b89e67b493c0113ca8d3185175fbd6f50f8a6a251b4385458e9c50f0fa399f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    # expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)


# def is_token_blacklisted(token: str) -> bool:
#     return redis_client.get(token) is not None

def get_current_user(token: str = Depends(oauth2_scheme)):
    print("Token received:", token)
    # if is_token_blacklisted(token):
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Token is invalid or has been logged out"
    #     )
    payload = verify_access_token(token)
    print("Payload:", payload)
    return payload


