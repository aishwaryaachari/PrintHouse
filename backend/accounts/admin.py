from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.db.models import Sum
from .models import Product, PrintZone, BulkInquiry, ContactMessage, CouponCode, ProductReview, PaymentSetting, Payment, CustomerNotification, ProductImage, ProductColor, ProductPriceTier

class MyAdminSite(admin.AdminSite):
    site_header = "Hari Om Print House Admin"
    site_title = "Hari Om Admin Portal"
    index_title = "Welcome to Hari Om Admin Panel"

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['total_users'] = User.objects.count()
        
        # Calculate stats
        extra_context['total_products'] = Product.objects.count()
        extra_context['total_inquiries'] = BulkInquiry.objects.count()
        
        extra_context['pending_inquiries'] = BulkInquiry.objects.filter(status='PENDING').count()
        extra_context['approved_inquiries'] = BulkInquiry.objects.filter(status='APPROVED').count()
        extra_context['rejected_inquiries'] = BulkInquiry.objects.filter(status='REJECTED').count()
        
        extra_context['total_orders'] = BulkInquiry.objects.filter(
            status__in=['APPROVED', 'PROCESSING', 'SHIPPED', 'COMPLETED']
        ).count()
        
        extra_context['revenue_summary'] = Payment.objects.filter(status='VERIFIED').aggregate(total=Sum('amount'))['total'] or 0
        
        return super().index(request, extra_context)

my_admin_site = MyAdminSite(name='my_admin')

# Register default Django models
my_admin_site.register(User, UserAdmin)
my_admin_site.register(Group, GroupAdmin)


from django.utils.html import format_html

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px; border-radius: 4px;" />', obj.image.url)
        return "No image uploaded yet"
    image_preview.short_description = "Preview"

class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px; border-radius: 4px;" />', obj.image.url)
        return "No image uploaded yet"
    image_preview.short_description = "Preview"

class ProductPriceTierInline(admin.TabularInline):
    model = ProductPriceTier
    extra = 1

class PrintZoneInline(admin.TabularInline):
    model = PrintZone
    extra = 1

@admin.register(Product, site=my_admin_site)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_primary', 'badge')
    search_fields = ('name', 'category')
    list_filter = ('category', 'is_primary')
    list_editable = ('is_primary',)
    inlines = [ProductImageInline, ProductColorInline, ProductPriceTierInline, PrintZoneInline]

@admin.register(PrintZone, site=my_admin_site)
class PrintZoneAdmin(admin.ModelAdmin):
    list_display = ('product', 'title', 'zone_id', 'zone_type', 'px', 'py', 'pWidth', 'pHeight')
    list_filter = ('product', 'zone_type')
    search_fields = ('title', 'zone_id')

@admin.register(BulkInquiry, site=my_admin_site)
class BulkInquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'contact_email', 'company_name', 'total_price', 'status', 'created_date', 'created_time', 'last_updated')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('contact_email', 'company_name', 'id')
    list_editable = ('status',)
    readonly_fields = ('created_date', 'created_time', 'last_updated', 'approved_at')
    
    actions = ['approve_inquiries', 'reject_inquiries']

    def approve_inquiries(self, request, queryset):
        for obj in queryset:
            obj.status = 'APPROVED'
            obj.save()
        self.message_user(request, f"Selected inquiries approved successfully.")
    approve_inquiries.short_description = "Approve selected inquiries"

    def reject_inquiries(self, request, queryset):
        for obj in queryset:
            obj.status = 'REJECTED'
            obj.save()
        self.message_user(request, f"Selected inquiries rejected successfully.")
    reject_inquiries.short_description = "Reject selected inquiries"

    # Time Display Methods
    def created_date(self, obj):
        from django.utils.timezone import localtime
        return localtime(obj.created_at).strftime('%Y-%m-%d')
    created_date.short_description = 'Created Date'

    def created_time(self, obj):
        from django.utils.timezone import localtime
        return localtime(obj.created_at).strftime('%H:%M:%S')
    created_time.short_description = 'Created Time'

    def last_updated(self, obj):
        from django.utils.timezone import localtime
        return localtime(obj.updated_at).strftime('%Y-%m-%d %H:%M:%S')
    last_updated.short_description = 'Last Updated'


@admin.register(PaymentSetting, site=my_admin_site)
class PaymentSettingAdmin(admin.ModelAdmin):
    list_display = ('upi_id', 'bank_name', 'account_name', 'account_number', 'ifsc_code')


@admin.register(Payment, site=my_admin_site)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'inquiry', 'amount', 'payment_method', 'status', 'submitted_at', 'verified_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('inquiry__id', 'inquiry__contact_email', 'id')
    readonly_fields = ('submitted_at', 'verified_at', 'created_at', 'updated_at')
    actions = ['verify_payments', 'reject_payments', 'mark_as_received']

    def verify_payments(self, request, queryset):
        from django.utils import timezone
        for payment in queryset:
            payment.status = 'VERIFIED'
            payment.verified_at = timezone.now()
            payment.save()
            
            # Update inquiry status to PROCESSING
            inquiry = payment.inquiry
            inquiry.status = 'PROCESSING'
            inquiry.save()
        self.message_user(request, "Selected payments verified and order status updated to Processing.")
    verify_payments.short_description = "Verify selected payments"

    def reject_payments(self, request, queryset):
        for payment in queryset:
            payment.status = 'FAILED'
            payment.save()
            
            # Revert inquiry status back to APPROVED so customer can re-submit
            inquiry = payment.inquiry
            inquiry.status = 'APPROVED'
            inquiry.save()
            
            # Create a notification for the rejection
            CustomerNotification.objects.create(
                user=inquiry.user,
                inquiry=inquiry,
                message=f"Your payment proof for order #HOPH-{inquiry.id} was rejected. Please re-submit payment proof."
            )
        self.message_user(request, "Selected payments marked as Failed and customer notified.")
    reject_payments.short_description = "Reject selected payments"

    def mark_as_received(self, request, queryset):
        self.verify_payments(request, queryset)
    mark_as_received.short_description = "Mark payment as received"


@admin.register(CustomerNotification, site=my_admin_site)
class CustomerNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'inquiry', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__username', 'message')


@admin.register(ContactMessage, site=my_admin_site)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'is_resolved', 'created_at')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('name', 'email', 'message')
    list_editable = ('is_resolved',)

@admin.register(CouponCode, site=my_admin_site)
class CouponCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percentage', 'valid_from', 'valid_to', 'is_active')
    list_filter = ('is_active', 'valid_from', 'valid_to')
    search_fields = ('code',)
    list_editable = ('is_active',)

@admin.register(ProductReview, site=my_admin_site)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_category', 'rating', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at', 'product_category')
    search_fields = ('user__username', 'comment')
    list_editable = ('is_approved',)


