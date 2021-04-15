from django.views.generic import TemplateView


class RouteView(TemplateView):
    template_name = 'index.html'
