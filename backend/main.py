from fastapi import FastAPI
from database import engine
from models import Base
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException 
from database import SessionLocal
from models import User
from schemas import UserCreate, UserResponse
from auth import hash_password
from auth import verify_password, create_access_token
from schemas import UserLogin, Token

#creates a new db session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db  #provide db session to API
    finally: 
        db.close()

#create FASTAPI app
app = FastAPI()
#create tables in database ( if not already created)
Base.metadata.create_all(bind=engine)

#root api
@app.get("/")
def root():
    return {"message": "Backend is running successfully"}


#user story: register
@app.post("/api/v1/auth/register", response_model= UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    #checking if email already exists 
    existing_user= db.query(User).filter(User.email== user.email).first()
    if existing_user: 
        raise HTTPException(status_code= 400, detail= "Email already registered")
    
    #hash password before storing
    hashed_pw = hash_password(user.password)

    #new user object
    new_user = User(
        name= user.name,
        email = user.email,
        password_hash= hashed_pw
    )

    #saving user to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user) #get updated data

    return new_user

from fastapi.security import OAuth2PasswordRequestForm

#user story: login
@app.post("/api/v1/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    #find user email
    db_user = db.query(User).filter(User.email == form_data.username).first()

    #if user not found 
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    #verify the password for the user
    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    #Create JWT token
    access_token = create_access_token(data={"sub": db_user.email})

    #return token   
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


#protected route
from auth import get_current_user

@app.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.name}, you are authenticated"}

#user story 3: resume upload
from fastapi import File, UploadFile
import shutil
import os
from models import Resume

#folder where resumes are stored
UPLOAD_DIR = "uploads"

@app.post("/api/v1/resume/upload")
def upload_resume(
    file: UploadFile = File(...),  #received uploaded file 
    current_user: User = Depends(get_current_user),  #only logged in users
    db: Session = Depends(get_db)
):
    # check file type( only pdf and docs)
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX allowed")

    # save file 
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # store in DB
    new_resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "message": "Resume uploaded successfully",
        "file_name": file.filename
    }

