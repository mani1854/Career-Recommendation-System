from django.conf import settings
from django.db import models


class AssessmentResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_results')
    scores = models.JSONField()
    dominant_type = models.CharField(max_length=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
