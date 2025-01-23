from logging import getLogger
from flask import Flask, jsonify, request
from db.rds import db, Users
from bcrypt import hashpw, gensalt
from utils.init_db import ensure_table_exists

log = getLogger(__name__)


def signup(app: Flask):
    try:
        data = request.get_json()

        user_name = data.get("userName")
        email = data.get("email")
        password = data.get("password")

        if not user_name or not email or not password:
            return jsonify({"message": "Invalid request parameters"}), 400

        with app.app_context():
            ensure_table_exists()
            user = db.session.query(Users).where(Users.email == email).first()

            if user:
                return jsonify({"message": "This user already exists"}), 400

        # パスワードのハッシュ化
        hashed_password = hashpw(password.encode("utf-8"), gensalt())

        with app.app_context():
            new_user = Users()
            new_user.name = user_name 
            new_user.email = email
            new_user.password = hashed_password.decode("utf-8")

            db.session.add(new_user)
            db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        log.error(e)
        return jsonify({"message": "Internal Server Error"}), 500
