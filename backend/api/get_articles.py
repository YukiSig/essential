from logging import getLogger
from flask import Flask, jsonify
from pynamodb.exceptions import DoesNotExist
from db.rds import Articles, db
from db.dynamodb import ArticleDetails

log = getLogger(__name__)


def get_article_by_id(app: Flask, id: int):
    try:
        with app.app_context():
            article = (
                db.session.query(Articles).where(Articles.id == id).first()
            )

            if not article:
                return (
                    jsonify({"message": "Resource not found"}),
                    404,
                )

            try:
                article_details = ArticleDetails.query(article.id)
                return (
                    jsonify(
                        {
                            "title": article.title,
                            "article": article_details.next().details,
                            "tag": article.tag,
                            "userId": article.user_id,
                        }
                    ),
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