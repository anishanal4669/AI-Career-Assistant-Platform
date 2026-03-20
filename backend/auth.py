from passlib.context import CryptContext

#CryptContect handles password hashing using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Hashing function
def hash_password(password: str):
    return pwd_context.hash(password)

#Function to verify entered password with stored password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


from jose import JWTError, jwt
from datetime import datetime, timedelta

#Secret key: used to sign JWT tokens 
SECRET_KEY = "supersecretkey"
#Encoding Algorithm
ALGORITHM = "HS256"
#Alloted expiry time for token
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#function to create JWT token
def create_access_token(data: dict):
    to_encode = data.copy()
    #copy user data 
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    #set token expiry time
    to_encode.update({"exp": expire})
    #add expiry to token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    #generate token


from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

#oauth2_scheme takes token from request header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

#To get db session for each request
def get_db():
    #create new db session
    db = SessionLocal()
    try:
        #provide session to API
        yield db
    finally:
        db.close()

#Function to get current logged in user using JWT token 
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    #error if token is invalid
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    try:
        #decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        #extract email from token
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    #find user in db using email
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user

