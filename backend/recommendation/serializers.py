from django.contrib.auth.models import User
from rest_framework import serializers

from .models import AssessmentResult


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class AssessmentSubmissionSerializer(serializers.Serializer):
    answers = serializers.DictField(child=serializers.ListField(child=serializers.IntegerField(min_value=0, max_value=4)))


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ['id', 'scores', 'dominant_type', 'created_at']
