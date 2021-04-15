from django.contrib.gis.db.models import MultiLineStringField
from django.db import models


class Route(models.Model):
    """
    Route model with Geometry field Multiline
    """
    name = models.CharField(max_length=255)
    paths = MultiLineStringField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
