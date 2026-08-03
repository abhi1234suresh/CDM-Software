# monitoring/urls.py
from django.urls import path
from .views import uptime_view

urlpatterns = [
    path("api/uptime/", uptime_view, name="uptime"),
]
