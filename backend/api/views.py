from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from datetime import date, timedelta

from django.db.models import Sum, F, FloatField
from django.shortcuts import get_object_or_404

from .models import Product, Customer, Subscription, Order
from .serializers import (
    ProductSerializer,
    CustomerSerializer,
    SubscriptionSerializer,
    OrderSerializer,
    RegisterSerializer
)


# -----------------------------
# Product API (PUBLIC)
# -----------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-id")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    # IMPORTANT: allow PATCH / partial updates
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


# -----------------------------
# Customer API
# -----------------------------
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by("-id")
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


# -----------------------------
# Subscription API
# -----------------------------
class SubscriptionViewSet(viewsets.ModelViewSet):

    queryset = Subscription.objects.all().order_by("-id")
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.is_staff:
            return Subscription.objects.all().order_by("-id")

        return Subscription.objects.filter(
            customer__user=user
        ).order_by("-id")

    def perform_create(self, serializer):

        user = self.request.user

        # Admin can assign any customer
        if user.is_staff:
            serializer.save()

        # Customer can only create their own subscription
        else:

            customer = Customer.objects.filter(user=user).first()

            if not customer:
                raise Exception("Customer profile not found")

            serializer.save(customer=customer)


# -----------------------------
# Pause / Resume Subscription
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_subscription(request, sub_id):

    subscription = get_object_or_404(Subscription, id=sub_id)

    if not request.user.is_staff and subscription.customer.user != request.user:
        return Response({"error": "Unauthorized"}, status=403)

    subscription.active = not subscription.active
    subscription.save()

    return Response({
        "message": "Subscription updated",
        "active": subscription.active
    })


# -----------------------------
# Order API
# -----------------------------
class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.is_staff:
            return Order.objects.all().order_by("-id")

        return Order.objects.filter(
            customer__user=user
        ).order_by("-id")


# -----------------------------
# Skip Delivery
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def skip_delivery(request, order_id):

    order = get_object_or_404(Order, id=order_id)

    if not request.user.is_staff and order.customer.user != request.user:
        return Response({"error": "Unauthorized"}, status=403)

    order.status = "Skipped"
    order.save()

    return Response({"message": "Delivery skipped successfully"})


# -----------------------------
# Place Order
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):

    user = request.user

    customer = Customer.objects.filter(user=user).first()

    if not customer:
        return Response({"error": "Customer profile not found"}, status=404)

    items = request.data.get("items", [])

    if not items:
        return Response({"error": "No items provided"}, status=400)

    today = date.today()

    for item in items:

        product_id = item.get("product_id")
        quantity = int(item.get("quantity_litres", 0))

        product = Product.objects.filter(id=product_id).first()

        if not product:
            continue

        if product.quantity < quantity:
            return Response({"error": f"Insufficient stock for {product.name}. Only {product.quantity}L available."}, status=400)

        # Deduct stock
        product.quantity -= quantity
        product.save()

        Order.objects.create(
            customer=customer,
            product=product,
            quantity_litres=quantity,
            delivery_date=today,
            status="Pending"
        )

    return Response({"message": "Order placed successfully"})


# -----------------------------
# Automatic Daily Order Generator
# -----------------------------
def generate_today_orders():

    today = date.today()

    subscriptions = Subscription.objects.filter(active=True)

    for sub in subscriptions:

        exists = Order.objects.filter(
            customer=sub.customer,
            product=sub.product,
            delivery_date=today
        ).exists()

        if not exists:

            # Check stock
            if sub.product.quantity >= sub.quantity_litres:

                # Deduct stock
                sub.product.quantity -= sub.quantity_litres
                sub.product.save()

                Order.objects.create(
                    customer=sub.customer,
                    product=sub.product,
                    quantity_litres=sub.quantity_litres,
                    delivery_date=today,
                    status="Pending"
                )
            else:
                print(f"Stock insufficient for subscription: {sub.id} (Product: {sub.product.name})")


# -----------------------------
# API to Generate Orders
# -----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def generate_orders(request):

    generate_today_orders()

    return Response({
        "message": "Orders generated successfully"
    })


# -----------------------------
# Upcoming Deliveries
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_deliveries(request):

    today = date.today()
    next_week = today + timedelta(days=7)

    user = request.user

    if user.is_staff:

        orders = Order.objects.filter(
            delivery_date__range=[today, next_week]
        ).order_by("delivery_date")

    else:

        orders = Order.objects.filter(
            customer__user=user,
            delivery_date__range=[today, next_week]
        ).order_by("delivery_date")

    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


# -----------------------------
# Dashboard Stats API
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):

    today = date.today()
    tomorrow = today + timedelta(days=1)

    total_customers = Customer.objects.count()

    active_subscriptions = Subscription.objects.filter(
        active=True
    ).count()

    todays_orders = Order.objects.filter(
        delivery_date=today
    ).count()

    tomorrows_deliveries = Order.objects.filter(
        delivery_date=tomorrow
    ).count()

    monthly_revenue = Order.objects.filter(
        delivery_date__month=today.month,
        status="Delivered"
    ).aggregate(
        total=Sum(
            F('quantity_litres') * F('product__price_per_litre'),
            output_field=FloatField()
        )
    )["total"] or 0

    return Response({
        "total_customers": total_customers,
        "active_subscriptions": active_subscriptions,
        "todays_orders": todays_orders,
        "tomorrows_deliveries": tomorrows_deliveries,
        "monthly_revenue": monthly_revenue
    })


# -----------------------------
# Register Customer
# -----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        try:
            serializer.save()

            return Response({
                "message": "Registration successful"
            }, status=201)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=400)

    return Response(serializer.errors, status=400)


# -----------------------------
# Logged In User Info
# -----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):

    user = request.user

    data = {
        "id": user.id,
        "username": user.username,
        "is_staff": user.is_staff
    }

    if not user.is_staff and hasattr(user, "customer_profile"):

        customer = user.customer_profile

        data["customer_id"] = customer.id
        data["name"] = customer.name

    return Response(data)