from django.contrib import admin
from .models import Product, Customer, Subscription, Order

admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Subscription)
admin.site.register(Order)