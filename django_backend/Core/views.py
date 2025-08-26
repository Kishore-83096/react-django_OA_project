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


# Create your views here.
@api_view(["GET"])
def get_data(request):
    data = {"message": "This a test!"}
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def welcome(request):
    return Response({
        "message": "Welcome to Exam Portal",
        "info": "Register or login to take exams"
    })


@api_view(["POST"])
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            confirm_password = data.get("confirm_password")

            # Validation
            if not username or not email or not password or not confirm_password:
                return JsonResponse({"error": "All fields (username, email, password, confirm_password) are required"}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already taken"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            # Create user
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password)
            )
            return JsonResponse({
                "message": "User registered successfully",
                "username": user.username,
                "email": user.email
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)





from rest_framework.authtoken.models import Token

@api_view(["POST"])
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            username_or_email = data.get("username") or data.get("email")
            password = data.get("password")

            if not username_or_email or not password:
                return JsonResponse({"error": "Username/Email and password are required"}, status=400)

            if "@" in username_or_email:
                try:
                    user_obj = User.objects.get(email=username_or_email)
                    username = user_obj.username
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid email or password"}, status=400)
            else:
                username = username_or_email

            user = authenticate(username=username, password=password)

            if user is not None:
                # Create or get token
                token, created = Token.objects.get_or_create(user=user)
                return JsonResponse({
                    "message": "Login successful",
                    "username": user.username,
                    "token": token.key
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)











@api_view(["GET"])
def user_dashboard(request):
    """
    Dashboard data:
    - username
    - exam availability
    - total number of questions
    - total marks (marks_per_question * total_questions)
    - exam timer
    """
    username = request.GET.get("username", "Guest")

    # JSON path inside Core/exam
    json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
    print("Resolved JSON path:", json_path)
    print("Exists?", json_path.exists())

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

    return JsonResponse({
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
def get_exam_questions(request):
    """
    Returns all exam questions (id, question text, options)
    and global exam settings (timer, marks per question).
    Also creates/retrieves an incomplete ExamAttempt for the user.
    """
    username = request.GET.get("username")
    if not username:
        return JsonResponse({"error": "username is required"}, status=400)

    try:
        user = User.objects.get(username=username)

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

            # Only send question text and options
            question_list = [
                {"id": q["id"], "question": q["question"], "options": q["options"]}
                for q in questions
            ]

        return JsonResponse({
            "questions": question_list,
            "exam_settings": exam_settings,
            "attempt_id": attempt.id,
            "saved_answers": attempt.answers  # previously saved answers
        })

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)







from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import ExamAttempt
import json
from django.utils import timezone
import psycopg2

@api_view(["POST"])
def save_answer(request):
    """
    Save or update an answer for a question.
    Expected POST data: 
    {
        "username": "user1",
        "question_id": 1,
        "selected_option": "A"
    }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        question_id = str(data.get("question_id"))  # store as string key in answers dict
        selected_option = data.get("selected_option")

        if not username or question_id is None or selected_option is None:
            return JsonResponse({"error": "username, question_id and selected_option are required"}, status=400)

        user = User.objects.get(username=username)

        # Get latest incomplete attempt or create new
        attempt, created = ExamAttempt.objects.get_or_create(user=user, completed=False)

        # Update the answer
        answers = attempt.answers
        answers[question_id] = selected_option
        attempt.answers = answers
        attempt.save()

        return JsonResponse({"message": "Answer saved successfully", "answers": attempt.answers}, status=200)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def submit_exam(request):
    """
    Submit the exam for evaluation.
    Expected POST data: 
    {
        "username": "user1",
        "answers": {"1": "Paris", "2": "Queue", ...}  # all selected answers
    }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        submitted_answers = data.get("answers", {})
        print("Submitted answers:", submitted_answers)

        if not username:
            return JsonResponse({"error": "username is required"}, status=400)

        user = User.objects.get(username=username)

        # Get latest incomplete attempt
        attempt = ExamAttempt.objects.filter(user=user, completed=False).last()
        if not attempt:
            return JsonResponse({"error": "No ongoing exam attempt found"}, status=404)

        # Save submitted answers
        attempt.answers = submitted_answers

        # Load exam questions
        json_path = (settings.BASE_DIR / "Core" / "exam" / "questions.json").resolve()
        total_score = 0
        if json_path.exists():
            with open(json_path, "r", encoding="utf-8") as f:
                exam_data = json.load(f)
                marks_per_question = exam_data.get("exam_settings", {}).get("marks_per_question", 0)
                
                # Evaluate score
                for q in exam_data.get("questions", []):
                    qid = str(q["id"])
                    selected = submitted_answers.get(qid)
                    correct = q.get("answer")  # <--- use 'answer' from JSON
                    if selected == correct:
                        total_score += marks_per_question

        attempt.total_score = total_score
        attempt.completed = True
        attempt.submitted_at = timezone.now()
        attempt.save()

        return JsonResponse({
            "message": "Exam submitted successfully",
            "answers": attempt.answers,
            "total_score": total_score
        }, status=200)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import ExamAttempt
from django.contrib.auth.models import User
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ExamAttempt  # your model

@api_view(["GET"])
def get_test_result(request):
    username = request.GET.get("username")
    if not username:
        return Response({"error": "username is required"}, status=400)

    try:
        user = User.objects.get(username=username)
        attempt = ExamAttempt.objects.filter(user=user, completed=True).order_by('-submitted_at').first()
        print("Fetched attempt:", attempt)
        if not attempt:
            return Response({"error": "No completed exam found"}, status=404)

        return Response({
            "username": user.username,
            "total_score": attempt.total_score,
            "answers": attempt.answers,
            "submitted_at": attempt.submitted_at,
        })

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
