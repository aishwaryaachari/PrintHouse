from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    category = models.CharField(max_length=50, unique=True, help_text="e.g. bottles, mugs, diaries, pens")
    name = models.CharField(max_length=255)
    badge = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField()
    features = models.JSONField(default=list, blank=True)
    offer = models.TextField(blank=True, null=True)
    sizes = models.JSONField(default=list, blank=True)
    colors = models.JSONField(default=list, blank=True)
    customizations = models.JSONField(default=list, blank=True)
    quantities = models.JSONField(default=list, blank=True)
    price_per_item = models.JSONField(default=dict, blank=True)
    images = models.JSONField(default=list, blank=True)
    print_zones = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name

class BulkInquiry(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    contact_email = models.EmailField()
    items = models.JSONField(default=list, help_text="List of items in the cart with their custom logo, color, size, etc.")
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_items = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Inquiry #{self.id} - {self.contact_email} (₹{self.total_price})"
