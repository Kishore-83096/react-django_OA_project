from django.urls import path
from . import views
urlpatterns = [
    path("hello/", views.get_data,name="get_data"),
    path("welcome/",views.welcome, name="welcome"),
    path("register/",views.register_user,name="register_user"),
    path("login/",views.login_user,name="login_user"),
    path('dashboard/', views.user_dashboard, name='user_dashboard'),
    path('exam/', views.get_exam_questions, name='start_exam'),
    path('save_answer/', views.save_answer, name='save_answer'),
    path('submit_exam/', views.submit_exam, name='submit_exam'),
    path('results/', views.get_test_result, name='get_test_results'),

]