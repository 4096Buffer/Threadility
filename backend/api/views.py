from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .models import Users
from .serializers import LoginSerializer
from .serializers import ItemSerializer
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from .models import Users
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny


class ItemList(APIView):
    def get(self, request):
        items = Item.objects.all()  
        serializer = ItemSerializer(items, many=True)  # Serializuj dane
        return Response(serializer.data)  # Zwróć w formacie JSON

import logging

logger = logging.getLogger(__name__)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user_data = serializer.validated_data
            response = Response({'message' : 'OK LOGGED IN'}, status=status.HTTP_200_OK)

            response.set_cookie(
                key = 'refresh_token',
                value = user_data['refresh'],
                httponly = True,
                secure = False,
                max_age = 7 * 24 * 60 * 60, 
                path = '/'
            )

            response.set_cookie(
                key = 'access_token',
                value = user_data['access'],
                httponly = True,
                secure = False, #change to True in production #change to strict in
                max_age = 10 * 60, #10 mins
                path = '/'
            )

            return response

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class ProtectedView(APIView):
    def get(self, request):
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return Response({"auth" : False, "message" : "Token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            access_token = AccessToken(access_token)
            user = Users.objects.get(id = access_token['user_id'])

            return Response({"auth" : True, "data" : {"name" : user.name}})

        except Exception as e:
            print(e)
            return Response({"auth": False, "message": "Error"}, status=401)

class TokenRefreshCustomView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            logger.error("Refresh token missing in cookies")
            return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)

            new_access_token = str(token.access_token)

            response = Response({"success": True}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=new_access_token,
                httponly=True,
                secure=False,  
                max_age=15 * 60  
            )
            return response

        except Exception as e:
            response = Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')

            logger.error(f"Invalid refresh token ERR: {e}")
            return response
class LogoutView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try: 
            refresh_token = request.COOKIES.get('refresh_token')

            if not refresh_token:
                return Response({"error" : "cant logout if you not login - wisemen"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist() 
                        
            response = Response({"message": "Successfully logged out"}, status=200)

            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')
            
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=401)