from logging import getLogger
from flask import Flask, jsonify
from pynamodb.exceptions import DoesNotExist
from db.rds import Articles, db
from db.dynamodb import ArticleDetails
from flask_jwt_extended import get_jwt_identity

log = getLogger(__name__)

def delete_article_by_id(app: Flask, id: int):
    try:
        user_id = get_jwt_identity()

        with app.app_context():

            article = (
                db.session.query(Articles).get(id)
            )

            if not article:
                return (
                    jsonify({"message": "Resource not found"}),
                    404,
                )

            db.session.delete(article)

            try:
                db.session.flush()
                ArticleDetails(id=article.id, details=article).delete()
                db.session.commit()
                return (
                    jsonify({"message": "Article deleted successfully."}),
                    200,
                )
            except DoesNotExist:
                return (
                    jsonify({"message": "Resource not found"}),
                    404,
                )

    except Exception as e:
        log.error(e)
        return jsonify({"message": "Internal Server Error"}), 500