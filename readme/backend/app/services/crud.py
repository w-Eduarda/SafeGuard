from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_password(db: Session, user_id: int, new_password: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.hashed_password = get_password_hash(new_password)
        db.commit()
        return True
    return False

def get_or_create_social_user(db: Session, social_data: schemas.SocialLogin):
    db_user = get_user_by_email(db, email=social_data.email)
    if not db_user:
        # Para login social, geramos uma senha aleatória que não será usada
        import secrets
        random_password = secrets.token_urlsafe(32)
        db_user = models.User(
            email=social_data.email, 
            full_name=social_data.full_name,
            hashed_password=get_password_hash(random_password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user

def get_monitored_item(db: Session, item_id: int):
    return db.query(models.MonitoredItem).filter(models.MonitoredItem.id == item_id).first()

def get_monitored_items(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.MonitoredItem).filter(models.MonitoredItem.owner_id == user_id).offset(skip).limit(limit).all()

def create_monitored_item(db: Session, item: schemas.MonitoredItemCreate, user_id: int):
    db_item = models.MonitoredItem(**item.model_dump(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_discoveries(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Discovery).filter(models.Discovery.owner_id == user_id).offset(skip).limit(limit).all()

def create_discovery(db: Session, discovery: schemas.DiscoveryCreate, user_id: int):
    db_discovery = models.Discovery(**discovery.model_dump(), owner_id=user_id)
    db.add(db_discovery)
    db.commit()
    db.refresh(db_discovery)
    return db_discovery

def get_alerts(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Alert).filter(models.Alert.owner_id == user_id).offset(skip).limit(limit).all()

def create_alert(db: Session, alert: schemas.AlertCreate, user_id: int):
    db_alert = models.Alert(**alert.model_dump(), owner_id=user_id)
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert
