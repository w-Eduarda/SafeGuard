from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MonitoredItemBase(BaseModel):
    item_type: str
    value: str

class MonitoredItemCreate(MonitoredItemBase):
    pass

class MonitoredItem(MonitoredItemBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DiscoveryBase(BaseModel):
    url: str
    data_type: str
    severity: str
    description: Optional[str] = None
    resolved: bool = False

class DiscoveryCreate(DiscoveryBase):
    pass

class Discovery(DiscoveryBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    message: str
    alert_type: str
    discovery_id: Optional[int] = None

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    owner_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[dict] = None

class TokenData(BaseModel):
    email: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class SocialLogin(BaseModel):
    email: EmailStr
    full_name: str
    provider: str # 'google' or 'github'
    provider_id: str
