from django.utils.timezone import now
from .models import ApplicationStart
import threading
import logging

logger = logging.getLogger(__name__)

class ApplicationStartMiddleware:
    _lock = threading.Lock()
    _initialized = False

    def __init__(self, get_response):
        self.get_response = get_response
        with self._lock:
            if not self._initialized:
                try:
                    logger.info("Initializing ApplicationStartMiddleware")
                    # Check existing records
                    active_starts = ApplicationStart.objects.filter(is_active=True)
                    logger.info(f"Found {active_starts.count()} active ApplicationStart records")
                    if active_starts.count() > 0:
                        logger.warning(f"Deactivating {active_starts.count()} existing active records")
                        ApplicationStart.objects.filter(is_active=True).update(is_active=False)
                    
                    # Create new record
                    logger.info("Creating new ApplicationStart record")
                    app_start = ApplicationStart.objects.create(start_time=now(), is_active=True)
                    logger.info(f"Created ApplicationStart at {app_start.start_time}")
                    self._initialized = True
                except Exception as e:
                    logger.error(f"Error in ApplicationStartMiddleware: {str(e)}")
                    raise

    def __call__(self, request):
        return self.get_response(request)