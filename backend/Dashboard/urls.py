from django.urls import path
from . import views

urlpatterns = [
    path('api/live-sensors/', views.live_sensors, name='live-sensors'),
    path('api/sensor/<str:sensor_id>/', views.sensor_detail, name='sensor-detail'),
]
