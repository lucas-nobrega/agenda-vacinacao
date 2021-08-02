from .models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'email', 'name', 'is_staff', 'is_active', 'is_superuser']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

   def validate(self, attrs):
      data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
      data.update({'email': self.user.email})
      data.update({'id': self.user.id})
      data.update({'is_staff': self.user.is_staff})
      data.update({'is_active': self.user.is_active})
      data.update({'is_superuser': self.user.is_superuser})
      return data