"""agendavacina URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework import routers
from agenda import views
from users.views import UserLoginViewSet, UserViewSet
from rest_framework_simplejwt.views import (
    TokenVerifyView,
    TokenRefreshView,
)
from users.views import LogoutView, CustomTokenObtainPairView

router = routers.DefaultRouter()
router.register(r'grupo-atendimento', views.GrupoAtendimentoViewSet)
router.register(r'user', UserViewSet)
router.register(r'cidadao', views.CidadaoViewSet)
router.register(r'local-vacinacao', views.LocalVacinacaoViewSet)
router.register(r'agendamento-vacinacao', views.AgendamentoVacinacaoViewSet, basename=views.AgendamentoVacinacaoSerializer)
router.register(r'local-vacinacao-proximos', views.LocalVacinacaoProximoViewSet, basename=views.LocalVacinacaoProximoViewSet)
router.register(r'cidadao-agentamentos', views.CidadaoAgendamentoViewSet, basename=views.CidadaoAgendamentoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('agenda/', include('agenda.urls')),
    path('api/v1/', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/verlogin/', UserLoginViewSet.as_view(), name="verlogin"),

    path(
        "manifest.json",
        TemplateView.as_view(
            template_name="manifest.json",
            content_type="application/json"
        ),
        name="manifest.json",
    ),
    path(
        "asset-manifest.json",
        TemplateView.as_view(
            template_name="asset-manifest.json",
            content_type="application/json"
        ),
        name="asset-manifest.json",
    ),
 
]
