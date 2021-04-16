from rest_framework.viewsets import ModelViewSet

from routes.api.serializers import RouteSerializer
from routes.models import Route


class RouteViewSet(ModelViewSet):
    """
    View for route CRUD operations
    """
    queryset = Route.objects.all().order_by('-updated')
    serializer_class = RouteSerializer
