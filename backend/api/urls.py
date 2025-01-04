from django.urls import path
from .views import ItemList
from .views import LoginView
from .views import ProtectedView
from .views import TokenRefreshCustomView
from .views import LogoutView

urlpatterns = [
	path('authinfo/', ProtectedView.as_view(), name='protected-view'),
    path('items/', ItemList.as_view(), name='item-list'),
    path('token/refresh/', TokenRefreshCustomView.as_view(), name='token-refresh'),
    path('login/', LoginView.as_view(), name='login-view'),
    path('logout/', LogoutView.as_view(), name='logout')
]