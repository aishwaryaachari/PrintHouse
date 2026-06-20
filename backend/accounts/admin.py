from django.contrib import admin
from .models import Product, PrintZone, BulkInquiry, ContactMessage, CouponCode, ProductReview, PaymentSetting

class PrintZoneInline(admin.TabularInline):
    model = PrintZone
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'badge')
    search_fields = ('name', 'category')
    list_filter = ('category',)
    inlines = [PrintZoneInline]

@admin.register(PrintZone)
class PrintZoneAdmin(admin.ModelAdmin):
    list_display = ('product', 'title', 'zone_id', 'zone_type', 'px', 'py', 'pWidth', 'pHeight')
    list_filter = ('product', 'zone_type')
    search_fields = ('title', 'zone_id')

@admin.register(BulkInquiry)
class BulkInquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'contact_email', 'company_name', 'total_price', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('contact_email', 'company_name', 'id')
    list_editable = ('status',)

@admin.register(PaymentSetting)
class PaymentSettingAdmin(admin.ModelAdmin):
    list_display = ('upi_id', 'bank_name', 'account_name', 'account_number', 'ifsc_code')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'is_resolved', 'created_at')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('name', 'email', 'message')
    list_editable = ('is_resolved',)

@admin.register(CouponCode)
class CouponCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percentage', 'valid_from', 'valid_to', 'is_active')
    list_filter = ('is_active', 'valid_from', 'valid_to')
    search_fields = ('code',)
    list_editable = ('is_active',)

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_category', 'rating', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at', 'product_category')
    search_fields = ('user__username', 'comment')
    list_editable = ('is_approved',)

