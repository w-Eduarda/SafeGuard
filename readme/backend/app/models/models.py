from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    monitored_items = relationship("MonitoredItem", back_populates="owner")
    discoveries = relationship("Discovery", back_populates="owner")
    alerts = relationship("Alert", back_populates="owner")

class MonitoredItem(Base):
    __tablename__ = "monitored_items"

    id = Column(Integer, primary_key=True, index=True)
    item_type = Column(String, nullable=False) # e.g., 'email', 'name', 'document'
    value = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="monitored_items")

class Discovery(Base):
    __tablename__ = "discoveries"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, nullable=False)
    data_type = Column(String, nullable=False) # e.g., 'cpf', 'email', 'phone'
    severity = Column(String, nullable=False) # e.g., 'low', 'medium', 'high'
    description = Column(String)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="discoveries")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    discovery_id = Column(Integer, ForeignKey("discoveries.id"), nullable=True)
    message = Column(String, nullable=False)
    alert_type = Column(String, nullable=False) # e.g., 'email', 'telegram', 'dashboard'
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="alerts")
    discovery = relationship("Discovery")
