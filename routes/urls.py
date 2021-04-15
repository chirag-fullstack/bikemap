from django.urls import path, include

from routes.views import RouteView

urlpatterns = [
    path('', RouteView.as_view()),
    path('api/', include('routes.api.urls')),
]