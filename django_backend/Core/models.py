from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField  # if using Postgres, else use TextField with JSON

from django.db import models
from django.contrib.auth.models import User

class ExamAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    # Instead of a single integer, store both obtained and total marks
    obtained_score = models.IntegerField(default=0)  # e.g. 20
    total_marks = models.IntegerField(default=0)     # e.g. 45

    # JSON field to store detailed question attempts
    # Example:
    # [
    #   {"question_id": 1, "question": "What is the capital of France?", 
    #    "chosen_option": "Berlin", "correct_answer": "Paris"},
    #   {"question_id": 2, "question": "...", ... }
    # ]
    question_attempts = models.JSONField(default=list)

    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.obtained_score}/{self.total_marks}"


