# API Endpoints Documentation

## 1. Hello API
**Method:** GET  
**URL:** `http://127.0.0.1:8000/api/hello/`  
**Response:**
```json
{
  "message": "User registered successfully",
  "username": "rahul1",
  "email": "rahul1@example.com"
}
```

---

## 2. Welcome API
**Method:** GET  
**URL:** `http://127.0.0.1:8000/api/welcome`  
**Response:**
```json
{
  "message": "Welcome to Exam Portal",
  "info": "Register or login to take exams"
}
```

---

## 3. Register API
**Method:** POST  
**URL:** `http://127.0.0.1:8000/api/register/`  
**Request:**
```json
{
  "username": "rahul1",
  "email": "rahul1@example.com",
  "password": "test123",
  "confirm_password": "test123"
}
```
**Response:**
```json
{
  "message": "Welcome to Exam Portal",
  "info": "Register or login to take exams"
}
```

---

## 4. Login API
**Method:** POST  
**URL:** `http://127.0.0.1:8000/api/login/`  
**Request:**
```json
{
  "username": "rahul1",
  "password": "test123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "username": "rahul1",
  "access": "<JWT_ACCESS_TOKEN>",
  "refresh": "<JWT_REFRESH_TOKEN>"
}
```

---

## 5. Dashboard API
**Method:** GET  
**URL:** `http://127.0.0.1:8000/api/dashboard/`  
**Authorization:** Bearer Token Required  
**Response:**
```json
{
  "username": "rahul1",
  "exam_available": true,
  "total_questions": 3,
  "total_marks": 45,
  "timer": 1
}
```

---

## 6. Exam API
**Method:** GET  
**URL:** `http://127.0.0.1:8000/api/exam/`  
**Authorization:** Bearer Token Required  
**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Rome"]
    },
    {
      "id": 2,
      "question": "Which data structure uses FIFO (First In First Out)?",
      "options": ["Stack", "Queue", "Heap", "Tree"]
    },
    {
      "id": 3,
      "question": "React is mainly used for?",
      "options": ["Database", "Styling", "Frontend UI", "Operating System"]
    }
  ],
  "exam_settings": {
    "timer in minutes": 1,
    "marks_per_question": 15
  },
  "attempt_id": 18,
  "saved_answers": {}
}
```

---

## 7. Save Answer API
**Method:** POST  
**URL:** `http://127.0.0.1:8000/api/save_answer/`  
**Authorization:** Bearer Token Required  
**Request:**
```json
{
  "question_id": 1,
  "selected_option": "A"
}
```
**Response:**
```json
{
  "message": "Answer saved successfully",
  "answers": {
    "1": "A"
  }
}
```

---

## 8. Submit Exam API
**Method:** POST  
**URL:** `http://127.0.0.1:8000/api/submit_exam/`  
**Authorization:** Bearer Token Required  
**Request:**
```json
{
  "answers": {
    "1": "A",
    "2": "C",
    "3": "B"
  }
}
```
**Response:**
```json
{
  "message": "Exam submitted successfully",
  "answers": {
    "1": "A",
    "2": "C",
    "3": "B"
  },
  "total_score": 0
}
```

---

## 9. Results API
**Method:** GET  
**URL:** `http://127.0.0.1:8000/api/results/`  
**Authorization:** Bearer Token Required  
**Response:**
```json
{
  "username": "rahul1",
  "total_score": 0,
  "answers": {
    "1": "A",
    "2": "C",
    "3": "B"
  },
  "submitted_at": "2025-08-28T09:54:01.301793Z"
}
```
