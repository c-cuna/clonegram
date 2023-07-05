from django.urls import path
from accounts.views import MyTokenObtainPairView, RegisterViewSet, CurrentUserView, EditAccountViewSet, ChangePasswordView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('user/update/<uuid:id>/', EditAccountViewSet.as_view(), name='auth_update'),
    path('user/changepassword/<uuid:id>/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('register/', RegisterViewSet.as_view(), name='auth_register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/verify/', TokenVerifyView.as_view(), name='token_verify'),
]