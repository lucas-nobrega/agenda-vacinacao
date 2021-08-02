from django.urls import path, re_path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    re_path(r'^(?!static\/).*', views.index, name='index'),
]