from .role import Role 

from sqlalchemy.orm import sessionmaker
from app.database import engine, Base

DBSession = sessionmaker(bind=engine)

def init_roles():
    session = DBSession()
    existing_roles = session.query(Role).count()
    if existing_roles == 0:
        roles = [
            Role(role="user"),
            Role(role="admin")
        ]
        session.add_all(roles)
        session.commit()
        print("Rôles initiaux créés : user, admin")
    else:
        print("Rôles déjà existants")
    session.close()
