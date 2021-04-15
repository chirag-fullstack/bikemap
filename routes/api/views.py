from rest_framework.viewsets import ModelViewSet

from routes.api.serializers import RouteSerializer
from routes.models import Route


class RouteViewSet(ModelViewSet):
    """
    API view with supported methods GET, POST, DELETE, PUT and PATCH
    """
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
