import os

from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.models import Model

class ArticleDetails(Model):
    class Meta: # type: ignore
        table_name = "articleDetails"
        billing_mode = "PAY_PER_REQUEST"
        host = os.getenv("DYNAMODB_ENDPOINT", None)
    id = NumberAttribute(hash_key=True)
    details = UnicodeAttribute()