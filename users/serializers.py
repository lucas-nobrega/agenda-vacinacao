from .models import User
from agenda.models import Cidadao
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
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

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    data_nascimento = serializers.DateField(write_only=True, required=True)
    nome_completo = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'data_nascimento', 'nome_completo')
        extra_kwargs = {
            'email': {'required': True},
            'data_nascimento': {'required': True},
            'nome_completo': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Senhas não são as mesmas."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        Cidadao.objects.create(
           user= user,
           nome_completo = validated_data['nome_completo'],
           data_nascimento = validated_data['data_nascimento'],
        )

        return user