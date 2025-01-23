from logging import getLogger
from flask import Flask, jsonify
from datetime import timezone
from zoneinfo import ZoneInfo
from random import randint
from db.rds import Articles, Users, db
from utils.init_db import ensure_dynamodb

log = getLogger(__name__)


def list_articles(app: Flask):
    try:
        with app.app_context():
            ensure_dynamodb()

            articles = (
                db.session.query(
                    Articles.id,
                    Articles.title,
                    Articles.created_at,
                    Articles.tag,
                    Users.name,
                )
                .join(Users, Users.id == Articles.user_id)
                .all()
            )

            response_articles = []

            for id, title, created_at, tag, name in articles:
                created_at_datetime = created_at.replace(
                    tzinfo=timezone.utc
                ).astimezone(ZoneInfo("Asia/Tokyo"))

                response_articles.append(
                    {
                        "id": id,
                        "title": title,
                        "author": name,
                        "datetime": created_at_datetime.strftime(
                            "%Y-%m-%d %H:%M:%S"
                        ),
                        "date": created_at_datetime.strftime("%b %d, %Y"),
                        "tag": tag,
                        "heats": randint(0, 20),
                    }
                )

        return jsonify(response_articles), 200

    except Exception as e:
        log.error(e)
        return jsonify({"message": "Internal Server Error"}), 500