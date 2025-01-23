from logging import getLogger
from flask import Flask, jsonify, request
from db.rds import Articles, db, Users
from db.dynamodb import ArticleDetails
from flask_jwt_extended import get_jwt_identity

log = getLogger(__name__)

def update_article(app: Flask, id: int):
    try:
        data = request.get_json()

        title = data.get("title")
        article = data.get("article")
        tag = data.get("tag")

        user_id = get_jwt_identity()

        if not title or not article or not tag:
            return jsonify({"message": "Invalid request parameters"}), 400
        
        with app.app_context():
            base_query = (
                db.session.query(Articles)
                .join(Users, Users.id == Articles.user_id)
                .where(Users.id == user_id, Articles.id == id)
            )

            if not (db.session.query(base_query.exists()).scalar()):
                return (
                    jsonify({"message": "Invalid user"}),
                    401,
                )
            
            editted_article = base_query.first()

            # type guard
            if not editted_article:
                return(
                    jsonify({"message": "Resource not found"}),
                    404,
                )
            
            editted_article.title = title
            editted_article.tag = tag
            db.session.add(editted_article)

            try:
                db.session.flush()
                ArticleDetails(id=editted_article.id, details=article).save()
                db.session.commit()
            except Exception as e:
                log.error(e)
                db.session.rollback()

            return jsonify({"message": "Article updated successfully"}), 200

    except Exception as e:
        log.error(e)
        return jsonify({"message": "Internal Server Error"}), 500