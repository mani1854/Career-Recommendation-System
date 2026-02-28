from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .data import PERSONALITY_INFO, QUESTIONS
from .models import AssessmentResult
from .serializers import (
    AssessmentResultSerializer,
    AssessmentSubmissionSerializer,
    LoginSerializer,
    RegisterSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if not user:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username})


@api_view(['GET'])
def questions_view(_request):
    ordered = []
    for personality_type, prompts in QUESTIONS.items():
        for question in prompts:
            ordered.append({'type': personality_type, 'question': question})
    return Response({'questions': ordered, 'scale': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']})


@api_view(['POST'])
def submit_assessment_view(request):
    serializer = AssessmentSubmissionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    scores = {}
    answers = serializer.validated_data['answers']
    for personality_type, prompts in QUESTIONS.items():
        if personality_type not in answers or len(answers[personality_type]) != len(prompts):
            return Response(
                {'detail': f'Missing or invalid answers for {personality_type}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        scores[personality_type] = sum(answers[personality_type])

    dominant = max(scores, key=scores.get)
    result = AssessmentResult.objects.create(user=request.user, scores=scores, dominant_type=dominant)

    return Response(
        {
            'result': AssessmentResultSerializer(result).data,
            'personality': PERSONALITY_INFO[dominant],
            'all_personalities': PERSONALITY_INFO,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
def latest_result_view(request):
    latest = request.user.assessment_results.first()
    if not latest:
        return Response({'detail': 'No assessment submitted yet.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(
        {
            'result': AssessmentResultSerializer(latest).data,
            'personality': PERSONALITY_INFO[latest.dominant_type],
            'all_personalities': PERSONALITY_INFO,
        }
    )
