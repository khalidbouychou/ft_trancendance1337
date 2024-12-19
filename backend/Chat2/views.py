from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication 
from rest_framework.views import APIView

# Create your views here.


class chat_view(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    