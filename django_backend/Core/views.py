from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.decorators import api_view
import os, json
from django.conf import settings
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

User = get_user_model()




# Create your views here.
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def get_data(request):
    data = {"message": "This a test!"}
    return Response(data)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def welcome(request):
    return Response({
        "message": "Welcome to Exam Portal",
        "info": "Register or login to take exams"
    })



@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if not username or not email or not password or not confirm_password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Correct way to create and save user
        user = User.objects.create_user(username=username, email=email, password=password)

        return Response({
            "message": "User registered successfully",
            "username": user.username,
            "email": user.email
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)










@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def login_user(request):
    """
    JWT login view: accepts username or email + password,
    returns access & refresh tokens on success.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        username_or_email = data.get("username") or data.get("email")
        password = data.get("password")

        if not username_or_email or not password:
            return Response(
                {"error": "Username/Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If user enters email instead of username
        if "@" in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                username = user_obj.username
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            username = username_or_email

        user = authenticate(username=username, password=password)

        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Login successful",
                    "username": user.username,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)










from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
import json

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    """
    JWT-protected dashboard data:
    - username (from JWT)
    - exam availability
    - total number of questions
    - total marks (marks_per_question * total_questions)
    - exam timer
    """
    user = request.user
    username = user.username

    # JSON path inside Core/exam
    json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
    exam_available = False
    total_questions = 0
    total_marks = 0
    timer = 0

    if json_path.exists():
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict) and "questions" in data and len(data["questions"]) > 0:
                    exam_available = True
                    total_questions = len(data["questions"])
                    # Fetch global exam settings
                    timer = data.get("exam_settings", {}).get("timer in minutes", 0)
                    marks_per_question = data.get("exam_settings", {}).get("marks_per_question", 0)
                    total_marks = marks_per_question * total_questions
        except Exception as e:
            print("Error reading JSON:", e)
            exam_available = False
    else:
        print("File does not exist")

    return Response({
        "username": username,
        "exam_available": exam_available,
        "total_questions": total_questions,
        "total_marks": total_marks,
        "timer": timer
    })








from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.http import JsonResponse
import json
from .models import ExamAttempt
from django.conf import settings

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_exam_questions(request):
    """
    Returns all exam questions for the authenticated user.
    """
    user = request.user  # get user from JWT

    try:
        # Get or create incomplete attempt
        attempt, created = ExamAttempt.objects.get_or_create(user=user, completed=False)

        # Load exam JSON
        json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
        if not json_path.exists():
            return JsonResponse({"error": "Exam not found"}, status=404)

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            questions = data.get("questions", [])
            exam_settings = data.get("exam_settings", {"timer": 0, "marks_per_question": 0})

            question_list = [
                {"id": q["id"], "question": q["question"], "options": q["options"]}
                for q in questions
            ]

        return JsonResponse({
            "questions": question_list,
            "exam_settings": exam_settings,
            "attempt_id": attempt.id,
            "saved_answers": attempt.answers
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)








from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import ExamAttempt
import json

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_answer(request):
    """
    Save or update an answer for a question (JWT-protected).
    Expected POST data:
    {
        "question_id": 1,
        "selected_option": "A"
    }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        question_id = str(data.get("question_id"))
        selected_option = data.get("selected_option")

        if question_id is None or selected_option is None:
            return Response({"error": "question_id and selected_option are required"}, status=400)

        user = request.user  # get authenticated user

        # Get latest incomplete attempt or create new
        attempt, created = ExamAttempt.objects.get_or_create(user=user, completed=False)

        # Update the answer
        answers = attempt.answers
        answers[question_id] = selected_option
        attempt.answers = answers
        attempt.save()

        return Response({"message": "Answer saved successfully", "answers": attempt.answers}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings
import json
from .models import ExamAttempt

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_exam(request):
    """
    Submit the exam for evaluation (JWT protected).
    """
    try:
        data = request.data  # DRF automatically parses JSON
        submitted_answers = data.get("answers", {})

        user = request.user  # get user from JWT
        attempt = ExamAttempt.objects.filter(user=user, completed=False).last()
        if not attempt:
            return Response({"error": "No ongoing exam attempt found"}, status=404)

        attempt.answers = submitted_answers

        # Load exam questions
        json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
        total_score = 0
        if json_path.exists():
            with open(json_path, "r", encoding="utf-8") as f:
                exam_data = json.load(f)
                marks_per_question = exam_data.get("exam_settings", {}).get("marks_per_question", 0)

                for q in exam_data.get("questions", []):
                    qid = str(q["id"])
                    selected = submitted_answers.get(qid)
                    correct = q.get("answer")
                    if selected == correct:
                        total_score += marks_per_question

        attempt.total_score = total_score
        attempt.completed = True
        attempt.submitted_at = timezone.now()
        attempt.save()

        return Response({
            "message": "Exam submitted successfully",
            "answers": attempt.answers,
            "total_score": total_score
        }, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)





@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_test_result(request):
    user = request.user  # JWT-authenticated user
    try:
        attempt = ExamAttempt.objects.filter(user=user, completed=True).order_by('-submitted_at').first()
        if not attempt:
            return Response({"error": "No completed exam found"}, status=404)

        return Response({
            "username": user.username,
            "total_score": attempt.total_score,
            "answers": attempt.answers,
            "submitted_at": attempt.submitted_at,
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
