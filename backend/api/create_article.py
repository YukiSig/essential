from logging import getLogger
from flask import Flask, jsonify, request
from db.rds import Articles, db, Users
from db.dynamodb import ArticleDetails
from flask_jwt_extended import get_jwt_identity

log = getLogger(__name__)

def create_article(app: Flask):
    try:
        data = request.get_json()

        title = data.get("title")
        article = data.get("article")
        tag = data.get("tag")

        user_id = get_jwt_identity()

        if not title or not article or not tag:
            return jsonify({"message": "Invalid request parameters"}), 400
        
        with app.app_context():
            user = db.session.query(Users).where(Users.id == user_id).first()

            if not user:
                return(
                    jsonify({"message": "Invalid user"}),
                    401,
                )
            
            new_article = Articles()
            new_article.title = title
            new_article.tag = tag
            new_article.user_id = user_id
            db.session.add(new_article)

            try:
                db.session.flush()
                ArticleDetails(id=new_article.id, details=article).save()
                log.info(new_article.id)
                db.session.commit()
            except Exception as e:
                log.error(e)
                db.session.rollback()

        return jsonify({"message": "Article registered successfully"}), 201

    except Exception as e:
        log.error(e)
        return jsonify({"message": "Internal Server Error"}), 500