import logging
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required

from api.signin import signin
from api.signup import signup
from api.create_article import create_article
from api.get_articles import get_article_by_id
from api.update_article import update_article
from api.list_articles import list_articles
from api.delete_article import delete_article_by_id
from db.rds import Config, db
from utils.init_db import init_dynamodb, init_rds

logging.basicConfig(level=logging.INFO)
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", "http://localhost:*"
).split(",")

app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "secret-key")

db.init_app(app)
CORS(app, origins=allowed_origins)
jwt = JWTManager(app)

@app.route("/signin", methods=["POST"])
def signin_endpoint():
    return signin(app)

@app.route("/signup", methods=["POST"])
def signup_endpoint():
    return signup(app)
@app.route("/posts", methods=["GET"])
@jwt_required()
def list_articles_endpoint():
    return list_articles(app)

@app.route("/posts", methods=["POST"])
@jwt_required()
def create_article_endpoint():
    return create_article(app)

@app.route("/posts/<int:id>", methods=["GET"])
@jwt_required()
def get_article_by_id_end_point(id: int):
    return get_article_by_id(app, id)

@app.route("/posts/<int:id>", methods=["PUT"])
@jwt_required()
def update_article_endpoint(id: int):
    return update_article(app, id)

@app.route("/posts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_article_by_id_endpoint(id: int):
    return delete_article_by_id(app, id)

@app.cli.command("init-rds")
def init_rds_endpoint():
    init_rds(app)

@app.cli.command("init-dynamodb")
def init_dynamodb_endpoint():
    init_dynamodb()