# Core/views.py

# -------------------- Python Standard --------------------
import os
import json

# -------------------- Django --------------------
from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, get_user_model

# -------------------- Django REST Framework --------------------
from rest_framework import status
from rest_framework.decorators import (
    api_view, permission_classes, authentication_classes
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# -------------------- Local --------------------
from .models import ExamAttempt

User = get_user_model()

# =========================================================
#                BASIC / PUBLIC ENDPOINTS
# =========================================================

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def get_data(request):
    """Test endpoint to check API availability."""
    return Response({"message": "This a test!"})












@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def welcome(request):
    """Welcome message for exam portal."""
    return Response({
        "message": "Welcome to Exam Portal",
        "info": "Register or login to take exams"
    })












# =========================================================
#                AUTHENTICATION
# =========================================================
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register_user(request):
    """
    User registration:
    - Validates username, email, and password
    - Creates user if unique
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if not all([username, email, password, confirm_password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

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
    Login with username/email + password.
    Returns JWT access & refresh tokens.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        username_or_email = data.get("username") or data.get("email")
        password = data.get("password")

        if not username_or_email or not password:
            return Response({"error": "Username/Email and password are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        if "@" in username_or_email:
            try:
                username = User.objects.get(email=username_or_email).username
            except User.DoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            username = username_or_email

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)












# =========================================================
#                USER DASHBOARD
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    """
    Dashboard summary:
    - Exam availability
    - Total questions, marks
    - Timer
    """
    user = request.user
    json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()

    exam_available = False
    total_questions = 0
    total_marks = 0
    timer = 0

    if json_path.exists():
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data.get("questions"):
                    exam_available = True
                    total_questions = len(data["questions"])
                    timer = data.get("exam_settings", {}).get("timer in minutes", 0)
                    marks_per_question = data.get("exam_settings", {}).get("marks_per_question", 0)
                    total_marks = marks_per_question * total_questions
        except Exception as e:
            print("Error reading JSON:", e)

    return Response({
        "username": user.username,
        "exam_available": exam_available,
        "total_questions": total_questions,
        "total_marks": total_marks,
        "timer": timer
    })













# =========================================================
#                EXAM FLOW
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_exam_questions(request):
    """Return exam questions + settings for authenticated user."""
    user = request.user
    try:
        attempt, _ = ExamAttempt.objects.get_or_create(user=user, completed=False)

        json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
        if not json_path.exists():
            return Response({"error": "Exam not found"}, status=404)

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            questions = [
                {"id": q["id"], "question": q["question"], "options": q["options"]}
                for q in data.get("questions", [])
            ]

        return Response({
            "questions": questions,
            "exam_settings": data.get("exam_settings", {"timer": 0, "marks_per_question": 0}),
            "attempt_id": attempt.id,
            "saved_attempts": attempt.question_attempts  # updated ✅
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)














@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_answer(request):
    """
    Save/update a user's answer for a question.
    Payload: { "question_id": 1, "selected_option": "A" }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        question_id = str(data.get("question_id"))
        selected_option = data.get("selected_option")

        if not question_id or not selected_option:
            return Response({"error": "question_id and selected_option are required"}, status=400)

        attempt, _ = ExamAttempt.objects.get_or_create(user=request.user, completed=False)
        answers = attempt.answers
        answers[question_id] = selected_option
        attempt.answers = answers
        attempt.save()

        return Response({"message": "Answer saved successfully", "answers": attempt.answers})

    except Exception as e:
        return Response({"error": str(e)}, status=500)













@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_exam(request):
    """Submit exam, evaluate score, and mark attempt completed."""
    try:
        submitted_answers = request.data.get("answers", {})  # { "1": "Berlin", "2": "Queue", ... }

        # Get last ongoing attempt
        attempt = ExamAttempt.objects.filter(user=request.user, completed=False).last()
        if not attempt:
            return Response({"error": "No ongoing exam attempt found"}, status=404)

        json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
        if not json_path.exists():
            return Response({"error": "Questions file not found"}, status=404)

        with open(json_path, "r", encoding="utf-8") as f:
            exam_data = json.load(f)

        marks_per_question = exam_data.get("exam_settings", {}).get("marks_per_question", 0)
        total_marks = len(exam_data.get("questions", [])) * marks_per_question

        obtained_score = 0
        question_attempts = []

        # Evaluate answers
        for q in exam_data.get("questions", []):
            qid = str(q["id"])
            chosen_option = submitted_answers.get(qid)
            correct_answer = q.get("answer")

            if chosen_option == correct_answer:
                obtained_score += marks_per_question

            question_attempts.append({
                "question_id": q["id"],
                "question": q["question"],
                "chosen_option": chosen_option,
                "correct_answer": correct_answer
            })

        # Save attempt
        attempt.obtained_score = obtained_score
        attempt.total_marks = total_marks
        attempt.question_attempts = question_attempts
        attempt.completed = True
        attempt.submitted_at = timezone.now()
        attempt.save()

        return Response({
            "message": "Exam submitted successfully",
            "score": f"{obtained_score}/{total_marks}",
            "question_attempts": question_attempts
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)











@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_test_result(request):
    """Fetch all completed exam results for authenticated user."""
    try:
        attempts = ExamAttempt.objects.filter(
            user=request.user, completed=True
        ).order_by('-submitted_at')

        results = []
        for attempt in attempts:
            results.append({
                "username": request.user.username,
                "attempt_id": attempt.id,
                "score": f"{attempt.obtained_score}/{attempt.total_marks}",
                "obtained_score": attempt.obtained_score,
                "total_marks": attempt.total_marks,
                "completed": attempt.completed,
                "started_at": attempt.started_at,
                "submitted_at": attempt.submitted_at,
                "question_attempts": attempt.question_attempts
            })

        # Always return a list, even if empty
        return Response(results, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
