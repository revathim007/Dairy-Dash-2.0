from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    ProductViewSet,
    CustomerViewSet,
    SubscriptionViewSet,
    OrderViewSet,
    generate_orders,
    register_customer,
    get_me,
    dashboard_stats,
    upcoming_deliveries,
    skip_delivery,
    toggle_subscription,   # ⭐ NEW IMPORT
    place_order,           # ⭐ NEW IMPORT
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = router.urls + [

    # Order generation
    path("generate-orders/", generate_orders, name="generate-orders"),

    # Admin dashboard stats
    path("dashboard-stats/", dashboard_stats, name="dashboard-stats"),

    # Upcoming Deliveries
    path("upcoming-deliveries/", upcoming_deliveries, name="upcoming-deliveries"),

    # Skip Delivery
    path("skip-delivery/<int:order_id>/", skip_delivery, name="skip-delivery"),

    # Place Order
    path("place-order/", place_order, name="place-order"),

    # ⭐ Pause / Resume Subscription
    path("toggle-subscription/<int:sub_id>/", toggle_subscription, name="toggle-subscription"),

    # Authentication
    path("register/", register_customer, name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),

    # Logged-in user info
    path("me/", get_me, name="me"),
]