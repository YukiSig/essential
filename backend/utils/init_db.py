from logging import getLogger
from flask import Flask
from db.dynamodb import ArticleDetails
from db.rds import db

log = getLogger(__name__)


def init_rds(app: Flask):
    try:
        log.info("Init RDS Start...")
        with app.app_context():
            db.drop_all()
            db.create_all()
        log.info("Init RDS Succeeded")
    except Exception as e:
        log.error(f"Init RDS Error: {e}")


def init_dynamodb():
    try:
        log.info("Init Dynamodn Start...")
        if ArticleDetails.exists():
            ArticleDetails.delete_table()
        ArticleDetails.create_table()
        log.info("Init RDS Succeeded")
    except Exception as e:
        log.error(f"Init RDS Error: {e}")


def ensure_dynamodb():
    try:
        log.info("create Dynamodn Start...")
        if not ArticleDetails.exists():
             ArticleDetails.create_table()
        log.info("create RDS Succeeded")
    except Exception as e:
        log.error(f"Init RDS Error: {e}")
