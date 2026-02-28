from django.urls import path

from .views import (
    latest_result_view,
    login_view,
    questions_view,
    register_view,
    submit_assessment_view,
)

urlpatterns = [
    path('auth/register/', register_view),
    path('auth/login/', login_view),
    path('assessment/questions/', questions_view),
    path('assessment/submit/', submit_assessment_view),
    path('assessment/latest/', latest_result_view),
]
