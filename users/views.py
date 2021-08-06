from rest_framework import generics
from users.serializers import CustomTokenObtainPairSerializer, UserSerializer, RegisterSerializer
from users.models import User
from agenda.models import Cidadao
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth import logout
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework import permissions
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

@permission_classes((permissions.IsAuthenticatedOrReadOnly, ))
class UserLoginViewSet(APIView):

    def get(self, request, format=None):
        if(request.user.is_authenticated):
            resposta = {
                'logado': True,
                'email': request.user.email,
                'is_staff' : request.user.is_staff
            }

            # Verificar se o usuário é um Cidadao e retornado dados
            try:
               cidadao = Cidadao.objects.get(user = request.user)
               resposta["cidadao_id"] = cidadao.cidadao_id
               resposta["nome_completo"] = cidadao.nome_completo
            except:
               pass

            return Response(resposta)
        else:
            return Response({
                'logado': False
            })

@permission_classes((permissions.IsAuthenticated, ))
class LogoutView(APIView):
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            logout(request)
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            logout(request)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView.as_view()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
