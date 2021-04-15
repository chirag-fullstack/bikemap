from rest_framework import serializers

from routes.models import Route


class RouteSerializer(serializers.ModelSerializer):
    """
    Route Serializer
    """
    class Meta:
        model = Route
        fields = '__all__'
