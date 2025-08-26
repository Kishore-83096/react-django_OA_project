This is a basic online assessment platform blueprint using **React** for the frontend and **Django** (+ Django REST Framework) for the backend, integrating **JWT authentication** and **MySQL** database. The installation process involves standard steps to clone, configure, and run both servers locally.

## Platform Overview

- **User Authentication:** Uses JWT for secure login and registration.
- **Exam Management:** Admins and authorized users can create, update, and conduct exams through a web-based dashboard.
- **Question Handling:** Allows question creation, editing, and viewing; questions are handled as backend resources exposed via REST.
- **Exam Conduction:** Exam sessions flow securely; results and scores can be displayed after completion.
- **Responsive Frontend:** React ensures smooth, modern UI interactions and mobile-friendly design.

## Tech Stack

- **Backend:** Python, Django, Django REST Framework.
- **Frontend:** React.js.
- **Database:** MySQL.
- **Authentication:** JWT (JSON Web Tokens), typically via djangorestframework-simplejwt.
- **Dev Tools:** Postman (for API testing), Git, VS Code.

## Installation Steps

1. **Clone the Repository**
   - Use `git clone` to download the source code; change to the project directory.
   git clone https://github.com/Kishore-83096/react-django_OA_project.git
   cd react-django_OA_project
2. **Setup Python Virtual Environment**
   - Use `python -m venv venv` and activate with either `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac).
   python -m venv venv
   venv\Scripts\activate

3. **Install Backend Dependencies**
   - Run `pip install -r requirements.txt` (recommended), or install Django, Django REST Framework, SimpleJWT, mysqlclient, and cors-headers individually.
4. **Configure Database**
   - 
    Create a MySQL database and update Django’s `settings.py` with host, username, password, etc..
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

5. **Run Migrations**
   - Use `python manage.py makemigrations` and `python manage.py migrate` to set up DB tables.


6. **Start Backend Server**
   - Launch Django with `python manage.py runserver` (defaults to http://127.0.0.1:8000/).

7. **Set Up and Start React Frontend**
   - From `frontend` directory, use `npm install` and `npm start` (serves at http://localhost:3000/).

8. **Access the Platform**
   - Open a browser at http://localhost:3000/ for registration, login, and exam management.

## API & Testing

- Endpoints are exposed by Django REST, with JWT-auth-enabled routes for protected resources.
- Use Postman to test API requests, export collections for documentation and automated tests.

## Contributing and License

- Fork the repo, create a new branch, submit a pull request.
- **License:** MIT, use and modify freely.

This platform provides a straightforward exam solution for educators and organizations, scalable for more advanced features like analytics and proctoring.



