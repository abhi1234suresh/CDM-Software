from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .Data.shared_memory_reader import SharedMemoryReader
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .Data.shared_memory_reader import SharedMemoryReader
import math


# Global reader instance
reader = SharedMemoryReader()
reader.connect_to_sensors()

def sanitize_float(value):
    try:
        val = float(value)
        if math.isnan(val) or math.isinf(val):
            return 0.0  # You can change to None or safe defaults
        return val
    except (ValueError, TypeError):
        return 0.0

@api_view(['GET'])
def live_sensors(request):
    """API endpoint to get live sensor data"""
    try:
        sensor_data = reader.read_all_sensors()
        formatted_data = {}
        for sensor_id, data in sensor_data.items():
            formatted_data[sensor_id] = {
                'PM10': sanitize_float(data.get('PM10', 0)),
                'PM2.5': sanitize_float(data.get('PM2.5', 0)),
                'Temperature': sanitize_float(data.get('Temperature', 0)),
                'Humidity': sanitize_float(data.get('Humidity', 0)),
                'Type': data.get('Type', 'NA'),
                'Q': data.get('Q', 'NA'),
                'PM_Status': data.get('PM_Status', 'NA'),
                'Temperature_Quality': data.get('Temperature_Quality', 'NA'),
                'Humidity_Quality': data.get('Humidity_Quality', 'NA'),
                'Timestamp': data.get('Timestamp', ''),
            }
        return Response(formatted_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def sensor_detail(request, sensor_id):
    """API endpoint for specific sensor data"""
    try:
        sensor_data = reader.read_sensor_data(sensor_id)
        if not sensor_data:
            return Response({'error': 'Sensor not found'}, status=404)
        # Optionally sanitize sensor detail data here if needed
        return Response(sensor_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
