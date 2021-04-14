from django.urls import path

from display import views

urlpatterns = [
    path('', views.display, name='display')
]