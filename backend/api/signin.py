from datetime import timedelta
from logging import getLogger
from flask import Flask, jsonify, request
from db.rds import db, Users
from bcrypt import checkpw
from flask_jwt_extended import create_access_token
from utils.init_db import ensure_table_exists

log = getLogger(__name__)


def signin(app: Flask):
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Invalid request parameters"}), 400

        with app.app_context():
            ensure_table_exists()

            user = db.session.query(Users).where(Users.email == email).first()

            if not user or not checkpw(
                password.encode("utf-8"), user.password.encode("utf-8")
            ):
                return (
                    jsonify({"message": "Invalid username or password"}),
                    401,
                )
            access_token = create_access_token(
                identity=str(user.id),
                expires_delta=timedelta(hours=1),
            )
        return (
            jsonify(
                {
                    "token": access_token,
                    "userId": user.id,
                    "userName": user.name,
                }
            ),
            200,
        )
    except Exception as e:
        log.error(e)
        return jsonify({"message": "Internal Server Error"}), 500