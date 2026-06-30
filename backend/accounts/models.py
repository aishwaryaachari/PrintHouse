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

    # Customizer Settings & Validation Rules
    snap_guides_enabled = models.BooleanField(default=True, help_text="Enable vertical and horizontal guide lines")
    safety_margins_enabled = models.BooleanField(default=True, help_text="Turn border red and show warnings if design exceeds printable zone")
    rotation_enabled = models.BooleanField(default=True, help_text="Enable rotation controls in customization editor")
    max_logo_size = models.PositiveIntegerField(default=150, help_text="Maximum allowed logo dimension in pixels")
    max_text_length = models.PositiveIntegerField(default=50, help_text="Maximum characters allowed in custom text fields")
    default_logo_size = models.PositiveIntegerField(default=120, help_text="Default logo width in pixels upon placement")
    default_text_size = models.PositiveIntegerField(default=24, help_text="Default font size for added text")
    text_customization_enabled = models.BooleanField(default=True, help_text="Allow text customization")
    logo_customization_enabled = models.BooleanField(default=True, help_text="Allow logo uploads")

    def __str__(self):
        return self.name

class PrintZone(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='print_zones_rel')
    zone_id = models.CharField(max_length=50, help_text="e.g. front_logo, lid_engraving, cover")
    title = models.CharField(max_length=100, help_text="Display title, e.g. Main Body Print")
    zone_type = models.CharField(max_length=50, default='flat', help_text="flat or cylindrical")
    px = models.FloatField(help_text="X position ratio (0.0 to 1.0) on template canvas")
    py = models.FloatField(help_text="Y position ratio (0.0 to 1.0) on template canvas")
    pWidth = models.FloatField(help_text="Width ratio (0.0 to 1.0) relative to template width")
    pHeight = models.FloatField(help_text="Height ratio (0.0 to 1.0) relative to template height")
    angle = models.FloatField(default=0, help_text="Default print zone angle in degrees")
    shape = models.CharField(max_length=50, default='rectangle', help_text="rectangle or circle")

    def __str__(self):
        return f"{self.product.name} - {self.title} ({self.zone_id})"


class BulkInquiry(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('COMPLETED', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    contact_email = models.EmailField()
    items = models.JSONField(default=list, help_text="List of items in the cart with their custom logo, color, size, etc.")
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_items = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # B2B Checkout Fields
    company_name = models.CharField(max_length=255, blank=True, null=True)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    gst_number = models.CharField(max_length=15, blank=True, null=True)
    delivery_address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    # B2B Payment Fields
    payment_method = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. UPI, BANK_TRANSFER")
    payment_receipt = models.FileField(upload_to='receipts/', blank=True, null=True)
    payment_notes = models.TextField(blank=True, null=True)
    payment_submitted_at = models.DateTimeField(blank=True, null=True)

    # Admin remarks and timestamps
    approved_at = models.DateTimeField(blank=True, null=True)
    admin_remarks = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        from django.utils import timezone
        
        if self.status == 'APPROVED' and not self.approved_at:
            self.approved_at = timezone.now()
            
        is_new = self.pk is None
        old_status = None
        if not is_new:
            old_status = BulkInquiry.objects.get(pk=self.pk).status
        
        super().save(*args, **kwargs)
        
        if self.user:
            if is_new:
                CustomerNotification.objects.create(
                    user=self.user,
                    inquiry=self,
                    message="Your inquiry has been received."
                )
            elif old_status != self.status:
                message_map = {
                    'APPROVED': "Your inquiry has been approved.",
                    'REJECTED': "Your inquiry has been rejected.",
                    'PROCESSING': "Your order is being processed.",
                    'SHIPPED': "Your order has been shipped.",
                    'COMPLETED': "Your order has been delivered.",
                }
                msg = message_map.get(self.status)
                if msg:
                    CustomerNotification.objects.create(
                        user=self.user,
                        inquiry=self,
                        message=msg
                    )

    def __str__(self):
        return f"Inquiry/Order #{self.id} - {self.contact_email} (₹{self.total_price}) [{self.status}]"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUBMITTED', 'Payment Submitted'),
        ('VERIFIED', 'Payment Verified'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]

    inquiry = models.ForeignKey(BulkInquiry, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_receipt = models.FileField(upload_to='receipts/', blank=True, null=True)
    payment_notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submitted_at = models.DateTimeField(blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    admin_remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} for Inquiry #{self.inquiry.id} - ₹{self.amount} ({self.status})"


class CustomerNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    inquiry = models.ForeignKey(BulkInquiry, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:30]}"


class PaymentSetting(models.Model):
    # UPI Settings
    upi_id = models.CharField(max_length=100, default="hariom@upi", help_text="UPI ID for payment")
    qr_code = models.FileField(upload_to='payment/', null=True, blank=True, help_text="QR Code image for UPI payment")
    
    # Bank Settings
    bank_name = models.CharField(max_length=100, default="State Bank of India", help_text="Bank Name")
    account_name = models.CharField(max_length=150, default="Hari Om Print House", help_text="Account Name")
    account_number = models.CharField(max_length=50, default="1234567890", help_text="Bank Account Number")
    ifsc_code = models.CharField(max_length=20, default="SBIN0001234", help_text="IFSC Code")

    def __str__(self):
        return "B2B Payment Configuration"


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

class CouponCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percentage = models.PositiveIntegerField(help_text="Percentage discount e.g. 10 for 10%")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Coupon: {self.code} ({self.discount_percentage}% Off)"

class ProductReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product_category = models.CharField(max_length=50, help_text="e.g. bottles, mugs, diaries, pens")
    rating = models.PositiveIntegerField(default=5, help_text="1 to 5 stars")
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} on {self.product_category} ({self.rating} stars)"

