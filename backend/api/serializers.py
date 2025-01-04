from rest_framework import serializers
from .models import Item
from .models import Users
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        
        return token

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name']

class LoginSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=32, required=True)
    password = serializers.CharField(max_length=128, write_only=True, required=True)  

    def validate(self, data):
        name = data.get('name')
        password = data.get('password')
        
        try:
            user = Users.objects.get(name=name)
        except Users.DoesNotExist:
            raise serializers.ValidationError({"name": "Użytkownik o podanej nazwie nie istnieje."})

        if not check_password(password, user.password):
            raise serializers.ValidationError({"password": "Nieprawidłowe hasło."})

        refresh = RefreshToken()
        refresh['user_id'] = user.id

        return {
        	'refresh' : str(refresh),
        	'access' : str(refresh.access_token),
        	'user_id' : user.id
        }


