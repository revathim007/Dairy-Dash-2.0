from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

# Django REST Framework Router
from rest_framework.routers import DefaultRouter

# Your API ViewSets
from api.views import ProductViewSet, CustomerViewSet, SubscriptionViewSet, OrderViewSet

# JWT Authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import include, path
urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('api/', include('api.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)