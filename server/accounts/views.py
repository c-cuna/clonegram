from django.contrib.auth import get_user_model
from .serializers import MyTokenObtainPairSerializer, AccountSerializer, UserSerializer, PublicUserSerializer, ChangePasswordSerializer
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes= (AllowAny,)
    serializer_class= MyTokenObtainPairSerializer

class RegisterViewSet(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = AccountSerializer

class EditAccountViewSet(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    serializer_class = UserSerializer
    
class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(instance=self.request.user, data=request.data)
        if serializer.is_valid(raise_exception=True):
             serializer.save()
             return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(views.APIView):
    def get(self, request):
        serializer = UserSerializer(request.user,  context={"request": request})
        return Response(serializer.data)
    
 
class UserSearchApiView(generics.ListAPIView):
    serializer_class = PublicUserSerializer
    
    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(username__startswith=username)
        return queryset

