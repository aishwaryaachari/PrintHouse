from django.contrib import admin
from .models import Product, BulkInquiry

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'badge')
    search_fields = ('name', 'category')
    list_filter = ('category',)

@admin.register(BulkInquiry)
class BulkInquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'contact_email', 'total_price', 'total_items', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('contact_email', 'id')
    list_editable = ('status',)
