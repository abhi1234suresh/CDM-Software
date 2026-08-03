from django.db import models
from django.core.exceptions import ValidationError
from django.utils.timezone import now

class ApplicationStart(models.Model):
    start_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Application started at {self.start_time}"

    class Meta:
        verbose_name = "Application Start"
        verbose_name_plural = "Application Starts"

class DowntimeEvent(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    def clean(self):
        if self.end_time and self.end_time < self.start_time:
            raise ValidationError("End time must be after start time.")

    def duration_seconds(self):
        if self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        else:
            return (now() - self.start_time).total_seconds()

    def __str__(self):
        return f"Downtime from {self.start_time} to {self.end_time or 'ongoing'}"