# Exam Portal API Endpoints

## 1. Test Message
- **Method:** GET
- **URL:** http://127.0.0.1:8000/api/hello/
- **Response:**
```
{
    "message": "This a test!"
}
```

## 2. Welcome Message
- **Method:** GET
- **URL:** http://127.0.0.1:8000/api/welcome/
- **Response:**
```
{
    "message": "Welcome to Exam Portal",
    "info": "Register or login to take exams"
}
```

## 3. Register User
- **Method:** POST
- **URL:** http://127.0.0.1:8000/api/register/
- **Request Body:**
```
{
  "username": "Krishnpriya",
  "email": "krishn@exam.com",
  "password": "test123",
  "confirm_password": "test123"
}
```
- **Response:**
```
{
    "message": "User registered successfully",
    "username": "Krishnpriya",
    "email": "krishn@exam.com"
}
```

## 4. Login User
- **Method:** POST
- **URL:** http://127.0.0.1:8000/api/login/
- **Request Body:**
```
{
  "username": "Krishnpriya",
  "password": "test123"
}
```
- **Response:**
```
{
    "message": "Login successful",
    "username": "Krishnpriya",
    "token": "e579004a0f6eb66cf56efe514510a56c2aa3de6b"
}
```

## 5. User Dashboard
- **Method:** GET
- **URL:** http://127.0.0.1:8000/api/dashboard/?username=krishn
- **Response:**
```
{
    "username": "krishn",
    "exam_available": true,
    "total_questions": 3,
    "total_marks": 45,
    "timer": 1
}
```

## 6. Get Exam Questions
- **Method:** GET
- **URL:** http://127.0.0.1:8000/api/exam/?username=rahul
- **Response:**
```
{
    "questions": [
        {"id": 1, "question": "What is the capital of France?", "options": ["Berlin","Madrid","Paris","Rome"]},
        {"id": 2, "question": "Which data structure uses FIFO (First In First Out)?", "options": ["Stack","Queue","Heap","Tree"]},
        {"id": 3, "question": "React is mainly used for?", "options": ["Database","Styling","Frontend UI","Operating System"]}
    ],
    "exam_settings": {"timer in minutes": 1, "marks_per_question": 15},
    "attempt_id": 11,
    "saved_answers": {}
}
```

## 7. Save Question Answer
- **Method:** POST
- **URL:** http://127.0.0.1:8000/api/save_answer/
- **Request Body:**
```
{
  "username": "rahul",
  "question_id": {"1": "Berlin", "2": "Heap", "3": "Frontend UI"},
  "selected_option": 1
}
```
- **Response:**
```
{
    "message": "Answer saved successfully",
    "answers": {"{'1': 'Berlin', '2': 'Heap', '3': 'Frontend UI'}": 1}
}
```

## 8. Submit Exam
- **Method:** POST
- **URL:** http://127.0.0.1:8000/api/submit_exam/?username=rahul
- **Request Body:**
```
{
    "answer": {"1": "Paris", "2": "Queue", "3": "Frontend UI"},
    "username": "rahul"
}
```
- **Response:**
```
{
    "message": "Exam submitted successfully",
    "answers": {},
    "total_score": 0
}
```

## 9. Get Exam Results
- **Method:** GET
- **URL:** http://127.0.0.1:8000/api/results/?username=rahul
- **Response:**
```
{
    "username": "rahul",
    "total_score": 0,
    "answers": {},
    "submitted_at": "2025-08-26T17:07:43.383914Z"
}
```

