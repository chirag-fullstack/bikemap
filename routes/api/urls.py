from rest_framework.routers import SimpleRouter

from routes.api.views import RouteViewSet

router = SimpleRouter()
router.register('routes', RouteViewSet)

urlpatterns = router.urls
