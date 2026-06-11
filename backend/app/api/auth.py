from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.schemas import schemas
from app.services import crud

router = APIRouter()

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # For now, we'll just return a dummy token. Real implementation would use JWT.
    return {
        "access_token": f"token_for_{user.id}",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/social-login", response_model=schemas.Token)
async def social_login(social_data: schemas.SocialLogin, db: Session = Depends(get_db)):
    user = crud.get_or_create_social_user(db, social_data)
    return {
        "access_token": f"token_for_{user.id}",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/change-password/{user_id}")
async def change_password(user_id: int, pwd_data: schemas.PasswordChange, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not crud.verify_password(pwd_data.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Senha antiga incorreta")
    crud.update_password(db, user_id, pwd_data.new_password)
    return {"message": "Senha atualizada com sucesso"}

@router.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)
