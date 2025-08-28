# React-Django Online Assessment Platform

This is a basic **Online Assessment Platform** blueprint using **React** for the frontend and **Django** (+ Django REST Framework) for the backend, integrating **JWT authentication** and **MySQL** database.  
The installation process involves standard steps to clone, configure, and run both servers locally.

---

## 📌 Platform Overview

- **User Authentication:** Uses JWT for secure login and registration.  
- **Exam Management:** Admins and authorized users can create, update, and conduct exams through a web-based dashboard.  
- **Question Handling:** Allows question creation, editing, and viewing; questions are handled as backend resources exposed via REST.  
- **Exam Conduction:** Exam sessions flow securely; results and scores can be displayed after completion.  
- **Responsive Frontend:** React ensures smooth, modern UI interactions and mobile-friendly design.  

---

## 🛠 Tech Stack

- **Backend:** Python, Django, Django REST Framework  
- **Frontend:** React.js  
- **Database:** MySQL  
- **Authentication:** JWT (JSON Web Tokens, via `djangorestframework-simplejwt`)  
- **Dev Tools:** Postman (API testing), Git, VS Code  

---

## ⚙️ Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Kishore-83096/react-django_OA_project.git
cd react-django_OA_project
```

### 2. Setup Python Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate    # On Windows
# OR
source venv/bin/activate # On Linux/Mac
```

### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```
(Or install Django, DRF, SimpleJWT, mysqlclient, and cors-headers individually)

### 4. Configure Database
In `settings.py`, update with your MySQL details:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_db_name',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Start Backend Server
```bash
python manage.py runserver
```
Runs at: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### 7. Set Up and Start React Frontend
```bash
cd frontend
npm install
npm start
```
Runs at: [http://localhost:3000/](http://localhost:3000/)

### 8. Access the Platform
👉 Open a browser at [http://localhost:3000/](http://localhost:3000/) for registration, login, and exam management.

---

## 🔗 API & Testing

- Endpoints are exposed by Django REST Framework  
- JWT authentication is enabled for protected routes  
- Use **Postman** to test API requests and export collections  

---

## 🤝 Contributing & License

- Fork the repo, create a new branch, and submit a pull request  
- **License:** MIT (free to use and modify)  

---

🚀 This platform provides a straightforward exam solution for educators and organizations, and is scalable for more advanced features like analytics and proctoring.
