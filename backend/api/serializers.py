from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Customer, Subscription, Order


# -----------------------------
# Product Serializer
# -----------------------------
class ProductSerializer(serializers.ModelSerializer):

    price = serializers.DecimalField(
        source="price_per_litre",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "price_per_litre",
            "quantity",
            "image",
            "image_url",
            "available"
        ]

        extra_kwargs = {
            "image": {"required": False}
        }

    def get_image_url(self, obj):

        request = self.context.get("request")

        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)

        return None

    def update(self, instance, validated_data):

        image = validated_data.get("image", None)

        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.price_per_litre = validated_data.get("price_per_litre", instance.price_per_litre)
        instance.quantity = validated_data.get("quantity", instance.quantity)

        if image:
            instance.image = image

        instance.save()

        return instance


# -----------------------------
# Customer Serializer
# -----------------------------
class CustomerSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "username",
            "name",
            "phone",
            "address",
            "delivery_area",
            "created_at"
        ]


# -----------------------------
# Register Serializer
# -----------------------------
class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    name = serializers.CharField()
    phone = serializers.CharField()
    address = serializers.CharField()
    delivery_area = serializers.CharField()
    is_admin = serializers.BooleanField(default=False)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):

        username = validated_data["username"]
        password = validated_data["password"]

        name = validated_data["name"]
        phone = validated_data["phone"]
        address = validated_data["address"]
        delivery_area = validated_data["delivery_area"]
        is_admin = validated_data.get("is_admin", False)

        user = User.objects.create_user(
            username=username,
            password=password
        )

        if is_admin:
            user.is_staff = True
            user.is_superuser = False # Ensure not a superuser as per request
            user.save()

        customer = Customer.objects.create(
            user=user,
            name=name,
            phone=phone,
            address=address,
            delivery_area=delivery_area
        )

        return customer


# -----------------------------
# Subscription Serializer
# -----------------------------
class SubscriptionSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Subscription
        fields = "__all__"
        extra_kwargs = {
            "customer": {"required": False}
        }


# -----------------------------
# Order Serializer
# -----------------------------
class OrderSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Order
        fields = "__all__"