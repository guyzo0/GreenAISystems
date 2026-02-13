from faker import Faker
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.role import Role

fake = Faker()

def seed_role(n: int = 20):
    db: Session = SessionLocal()

    role1 = Role(
        id=1,
        role="user"
    )

    role2 = Role(
        id=2,
        role="admin"
    )

    db.add(role1)
    db.add(role2)

    db.commit()
    db.close()

    print("2 roles inserted successfully 🚀")


if __name__ == "__main__":
    seed_role()
