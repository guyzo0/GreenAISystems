from .role import Role
from .utilisateur import Utilisateur 
from .session_connexion import SessionConnexion 
from .parcours_apprentissage import ParcoursApprentissage 
from .cours import Cours 
from .session_apprentissage import SessionApprentissage 
from .reponse_ia import ReponseIA 
from .empreinte_carbone import EmpreinteCarbone 
from .plantation_arbres import PlantationArbres 
from .historique_api import HistoriqueAPI 
from .parcours_cours import ParcoursCours  

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
