from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):

    name = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    price_per_litre = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.IntegerField(default=0)

    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        default=None
    )

    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (₹{self.price_per_litre}/L)"


class Customer(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=255)

    phone = models.CharField(max_length=20)

    address = models.TextField()

    delivery_area = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Subscription(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="subscriptions"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="subscriptions"
    )

    quantity_litres = models.IntegerField()

    delivery_time = models.CharField(
        max_length=20
    )

    start_date = models.DateField()

    active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.customer.name} → {self.product.name} ({self.quantity_litres}L)"


class Order(models.Model):

    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Delivered', 'Delivered'),
        ('Skipped', 'Skipped'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    quantity_litres = models.IntegerField()

    delivery_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    def __str__(self):
        return f"{self.customer.name} - {self.product.name} - {self.delivery_date}"