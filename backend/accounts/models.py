from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False, db_index=True)

    class Meta:
        abstract = True


# ================= AUTH & CORE =================

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    account_status = models.CharField(max_length=20, default='ACTIVE')
    email_verified = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group', related_name='custom_user_set', blank=True,
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='custom_user_set', blank=True,
        verbose_name='user permissions'
    )

    class Meta:
        db_table = 'auth_user_custom'

    def __str__(self):
        return self.email or self.username


class LoginHistory(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    status = models.CharField(max_length=20)  # SUCCESS, FAILED

    class Meta:
        verbose_name_plural = 'Login Histories'


class Address(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=20)  # BILLING, SHIPPING
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='India')

    class Meta:
        verbose_name_plural = 'Addresses'


# ================= CATALOG - CATEGORIES =================

class Category(BaseModel):
    """Top-level category: Drinkware, Stationery, etc."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=255, blank=True, help_text="Icon class or SVG path")
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class Subcategory(BaseModel):
    """Sub-level category: Stainless Steel Bottles, Ceramic Mugs, etc."""
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120)
    description = models.TextField(blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name_plural = 'Subcategories'
        ordering = ['sort_order', 'name']
        unique_together = [('category', 'slug')]

    def __str__(self):
        return f"{self.category.name} → {self.name}"


# ================= PRINTING METHODS =================

class PrintingMethod(BaseModel):
    """
    Reusable printing technique table.
    e.g. Screen Print, UV Print, Laser Engraving, Sublimation, DTF, DTG, Embroidery
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    suitable_for = models.TextField(blank=True, help_text="e.g. fabric, metal, glass, paper")

    def __str__(self):
        return self.name


# ================= PRODUCT =================

class Product(BaseModel):
    """
    Core product entity. Every product is customizable.
    Supports hundreds of products across all categories.
    """
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    subcategory = models.ForeignKey(
        Subcategory, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='products'
    )
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    sku_prefix = models.CharField(max_length=20, blank=True, help_text="e.g. BTL, MUG, PEN")
    badge = models.CharField(max_length=50, blank=True, help_text="e.g. Best Seller, New")
    material = models.CharField(max_length=255, blank=True, help_text="e.g. 304 Stainless Steel")
    thumbnail = models.CharField(max_length=500, blank=True)
    minimum_order_quantity = models.IntegerField(default=25)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False)

    # Printing
    printing_methods = models.ManyToManyField(PrintingMethod, blank=True, related_name='products')

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['subcategory', 'is_active']),
        ]

    def __str__(self):
        return self.name


class ProductImage(BaseModel):
    """Multiple images per product."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']


class ProductVariant(BaseModel):
    """
    A specific combination of size + color for a product.
    Each variant has its own SKU and base price.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    size = models.CharField(max_length=100, blank=True, help_text="e.g. 500ml, A5, L, One Size")
    color_name = models.CharField(max_length=100, blank=True)
    color_hex = models.CharField(max_length=10, blank=True)
    image_url = models.CharField(max_length=500, blank=True)
    material_note = models.CharField(max_length=255, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        parts = [self.product.name]
        if self.size:
            parts.append(self.size)
        if self.color_name:
            parts.append(self.color_name)
        return ' - '.join(parts)


class QuantityPriceTier(BaseModel):
    """
    Volume-based pricing tiers per product.
    e.g. 25 units → ₹320/unit, 100 units → ₹240/unit
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_tiers')
    minimum_quantity = models.IntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['minimum_quantity']
        unique_together = [('product', 'minimum_quantity')]

    def __str__(self):
        return f"{self.product.name}: {self.minimum_quantity}+ units @ ₹{self.price_per_unit}"


class PrintZone(BaseModel):
    """
    Defines a specific printable area on a product.
    Coordinates map directly to the Fabric.js canvas customizer.
    """
    ZONE_TYPE_CHOICES = [
        ('flat', 'Flat'),
        ('cylindrical', 'Cylindrical'),
        ('curved', 'Curved'),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='print_zones')
    title = models.CharField(max_length=100)
    zone_type = models.CharField(max_length=50, choices=ZONE_TYPE_CHOICES, default='flat')
    # Proportional coordinates (0.0 to 1.0) relative to canvas dimensions
    px = models.FloatField(help_text="X position as fraction of canvas width")
    py = models.FloatField(help_text="Y position as fraction of canvas height")
    p_width = models.FloatField(help_text="Width as fraction of canvas width")
    p_height = models.FloatField(help_text="Height as fraction of canvas height")
    max_width_mm = models.FloatField(null=True, blank=True, help_text="Physical max width in mm")
    max_height_mm = models.FloatField(null=True, blank=True, help_text="Physical max height in mm")
    supported_printing_methods = models.ManyToManyField(PrintingMethod, blank=True)

    def __str__(self):
        return f"{self.product.name} → {self.title}"


# ================= ARTWORK & DESIGN ENGINE =================

class Artwork(BaseModel):
    """Customer-uploaded brand assets. Reusable across multiple designs."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='artworks')
    original_filename = models.CharField(max_length=255)
    stored_filename = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500, help_text="Local path or S3/Cloudinary URL")
    file_type = models.CharField(max_length=50, help_text="e.g. image/png, image/svg+xml")
    file_size_bytes = models.IntegerField()
    preview_image_path = models.CharField(max_length=500, blank=True)
    width_px = models.IntegerField(null=True, blank=True)
    height_px = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.original_filename


class Design(BaseModel):
    """
    A complete Fabric.js design session tied to a specific print zone.
    canvas_json allows exact reconstruction of the design.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='designs')
    print_zone = models.ForeignKey(PrintZone, on_delete=models.PROTECT)
    title = models.CharField(max_length=255, default="Untitled Design")
    canvas_json = models.JSONField(help_text="Complete Fabric.js canvas JSON export")
    thumbnail_url = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.title} (by {self.user.email})"


class DesignObject(BaseModel):
    """
    Normalized breakdown of each Fabric.js object in a design.
    Enables querying (e.g. find all designs using font 'Cinzel').
    """
    OBJECT_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('shape', 'Shape'),
        ('qr_code', 'QR Code'),
    ]
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='objects')
    object_type = models.CharField(max_length=50, choices=OBJECT_TYPE_CHOICES)
    artwork = models.ForeignKey(
        Artwork, on_delete=models.SET_NULL, null=True, blank=True,
        help_text="Set if this object is an uploaded image/artwork"
    )

    # Layout
    z_index = models.IntegerField(default=0)
    x_coordinate = models.FloatField()
    y_coordinate = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    scale_x = models.FloatField(default=1.0)
    scale_y = models.FloatField(default=1.0)
    rotation_angle = models.FloatField(default=0.0)
    opacity = models.FloatField(default=1.0)
    flip_x = models.BooleanField(default=False)
    flip_y = models.BooleanField(default=False)
    skew_x = models.FloatField(default=0.0)
    skew_y = models.FloatField(default=0.0)
    visible = models.BooleanField(default=True)

    # Text-specific (null if not a text object)
    text_content = models.TextField(blank=True)
    font_family = models.CharField(max_length=100, blank=True)
    font_size = models.FloatField(null=True, blank=True)
    font_weight = models.CharField(max_length=20, blank=True)
    font_style = models.CharField(max_length=20, blank=True)
    text_alignment = models.CharField(max_length=20, blank=True)
    text_color = models.CharField(max_length=20, blank=True)
    background_color = models.CharField(max_length=20, blank=True)
    letter_spacing = models.FloatField(null=True, blank=True)
    line_height = models.FloatField(null=True, blank=True)
    underline = models.BooleanField(default=False)
    strikethrough = models.BooleanField(default=False)

    # Image-specific
    original_width = models.IntegerField(null=True, blank=True)
    original_height = models.IntegerField(null=True, blank=True)
    crop_x = models.FloatField(null=True, blank=True)
    crop_y = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.design.title} — {self.object_type} (z:{self.z_index})"


# ================= INQUIRY & FUTURE ORDER PIPELINE =================

class BulkInquiry(BaseModel):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('REVIEWING', 'Under Review'),
        ('QUOTED', 'Quoted'),
        ('APPROVED', 'Approved'),
        ('IN_PRODUCTION', 'In Production'),
        ('DISPATCHED', 'Dispatched'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    company_name = models.CharField(max_length=255, blank=True)
    customer_notes = models.TextField(blank=True)
    total_estimated_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        verbose_name_plural = 'Bulk Inquiries'

    def __str__(self):
        return f"Inquiry #{str(self.id)[:8]} — {self.contact_email}"


class InquiryItem(BaseModel):
    """One line item within a bulk inquiry."""
    inquiry = models.ForeignKey(BulkInquiry, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT)
    design = models.ForeignKey(Design, on_delete=models.PROTECT, null=True, blank=True)
    quantity = models.IntegerField()
    calculated_unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    customer_notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        self.line_total = self.calculated_unit_price * self.quantity
        super().save(*args, **kwargs)


class Quote(BaseModel):
    """Admin-generated quote responding to a BulkInquiry."""
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]
    inquiry = models.OneToOneField(BulkInquiry, on_delete=models.CASCADE)
    final_price = models.DecimalField(max_digits=12, decimal_places=2)
    valid_until = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    admin_notes = models.TextField(blank=True)


class Order(BaseModel):
    """Future: Converts accepted Quote into a confirmed Order."""
    STATUS_CHOICES = [
        ('PROCESSING', 'Processing'),
        ('IN_PRODUCTION', 'In Production'),
        ('READY', 'Ready to Ship'),
        ('DISPATCHED', 'Dispatched'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    quote = models.OneToOneField(Quote, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROCESSING')
    shipping_address = models.ForeignKey(
        Address, on_delete=models.PROTECT, related_name='shipping_orders', null=True, blank=True
    )
    tracking_number = models.CharField(max_length=255, blank=True)
    estimated_delivery = models.DateField(null=True, blank=True)


# ================= AUDIT & LOGGING =================

class AuditLog(BaseModel):
    """Tracks all admin-level changes across the system."""
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('STATUS_CHANGE', 'Status Change'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    table_name = models.CharField(max_length=100)
    record_id = models.UUIDField()
    changes = models.JSONField(help_text="Old value vs new value")

    def __str__(self):
        return f"{self.action} on {self.table_name} by {self.user}"
