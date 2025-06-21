import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    # SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:henrytran@localhost/habittracker'
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
