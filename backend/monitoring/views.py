from django.utils.timezone import now
from django.http import JsonResponse
from .models import DowntimeEvent, ApplicationStart
import logging

logger = logging.getLogger(__name__)

def uptime_view(request):
    """
    Calculates real-time uptime since the application last started in hours, minutes, and seconds.
    """
    try:
        app_start = ApplicationStart.objects.get(is_active=True)
        start_period = app_start.start_time
        logger.info(f"Using ApplicationStart record with start_time: {start_period}")
    except ApplicationStart.DoesNotExist:
        logger.warning("No active ApplicationStart record found")
        return JsonResponse({
            "uptime": {"hours": 0, "minutes": 0, "seconds": 0},
            "error": "No active application start time recorded"
        }, status=404)
    except ApplicationStart.MultipleObjectsReturned:
        logger.error("Multiple active ApplicationStart records found")
        app_start = ApplicationStart.objects.filter(is_active=True).order_by('-start_time').first()
        start_period = app_start.start_time
        logger.info(f"Falling back to latest ApplicationStart record: {start_period}")

    total_time_seconds = (now() - start_period).total_seconds()
    downtime_events = DowntimeEvent.objects.filter(start_time__gte=start_period)
    total_downtime_seconds = sum(event.duration_seconds() for event in downtime_events)
    uptime_seconds = max(total_time_seconds - total_downtime_seconds, 0)

    hours = int(uptime_seconds // 3600)
    minutes = int((uptime_seconds % 3600) // 60)
    seconds = int(uptime_seconds % 60)

    logger.info(f"Calculated uptime: {hours}h {minutes}m {seconds}s, Downtime events: {downtime_events.count()}")
    return JsonResponse({
        "uptime": {
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        }
    })