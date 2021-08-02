from users.serializers import CustomTokenObtainPairSerializer, UserSerializer
from users.models import User
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

class UserLoginViewSet(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        if(request.user.is_authenticated == True):
            return Response({
                'logado': True,
                'email': request.user.email,
            })
        else:
            return Response({
                'logado': False
            })

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

class CustomTokenObtainPairView(TokenObtainPairView):
   serializer_class = CustomTokenObtainPairSerializer
   token_obtain_pair = TokenObtainPairView.as_view()