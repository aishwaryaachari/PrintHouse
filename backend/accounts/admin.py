from django.contrib import admin
from .models import (
    User, LoginHistory, Address,
    Category, Subcategory, PrintingMethod,
    Product, ProductImage, ProductVariant, QuantityPriceTier, PrintZone,
    Artwork, Design, DesignObject,
    BulkInquiry, InquiryItem, Quote, Order, AuditLog
)


# ─── INLINES ──────────────────────────────────────────────────────────────────

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image_url', 'alt_text', 'is_primary', 'sort_order')


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('sku', 'size', 'color_name', 'color_hex', 'base_price', 'stock_quantity', 'is_active')


class QuantityPriceTierInline(admin.TabularInline):
    model = QuantityPriceTier
    extra = 3
    fields = ('minimum_quantity', 'price_per_unit')


class PrintZoneInline(admin.TabularInline):
    model = PrintZone
    extra = 1
    fields = ('title', 'zone_type', 'px', 'py', 'p_width', 'p_height', 'max_width_mm', 'max_height_mm')


class InquiryItemInline(admin.TabularInline):
    model = InquiryItem
    extra = 0
    readonly_fields = ('line_total',)
    fields = ('variant', 'design', 'quantity', 'calculated_unit_price', 'line_total', 'customer_notes')


class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 1
    fields = ('name', 'slug', 'sort_order', 'is_active')


# ─── CATEGORIES ───────────────────────────────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    inlines = [SubcategoryInline]


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'sort_order', 'is_active')
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
    prepopulated_fields = {'slug': ('name',)}


# ─── PRINTING METHODS ─────────────────────────────────────────────────────────

@admin.register(PrintingMethod)
class PrintingMethodAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'suitable_for')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


# ─── PRODUCTS ─────────────────────────────────────────────────────────────────

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'subcategory', 'badge', 'minimum_order_quantity', 'is_active', 'is_featured')
    list_filter = ('category', 'subcategory', 'is_active', 'is_featured', 'printing_methods')
    search_fields = ('name', 'sku_prefix', 'description')
    list_editable = ('is_active', 'is_featured')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('printing_methods',)
    inlines = [ProductImageInline, ProductVariantInline, QuantityPriceTierInline, PrintZoneInline]
    fieldsets = (
        ('Core Info', {
            'fields': ('category', 'subcategory', 'name', 'slug', 'sku_prefix', 'badge', 'short_description', 'description')
        }),
        ('Material & Specs', {
            'fields': ('material', 'thumbnail', 'minimum_order_quantity')
        }),
        ('Printing', {
            'fields': ('printing_methods',)
        }),
        ('Visibility', {
            'fields': ('is_active', 'is_featured')
        }),
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('sku', 'product', 'size', 'color_name', 'base_price', 'stock_quantity', 'is_active')
    list_filter = ('product__category', 'is_active')
    search_fields = ('sku', 'product__name', 'color_name')
    list_editable = ('base_price', 'stock_quantity', 'is_active')


@admin.register(PrintZone)
class PrintZoneAdmin(admin.ModelAdmin):
    list_display = ('product', 'title', 'zone_type', 'max_width_mm', 'max_height_mm')
    list_filter = ('zone_type', 'product__category')
    search_fields = ('product__name', 'title')
    filter_horizontal = ('supported_printing_methods',)


# ─── USER ─────────────────────────────────────────────────────────────────────

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'phone', 'account_status', 'email_verified', 'is_staff', 'date_joined')
    list_filter = ('account_status', 'email_verified', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    readonly_fields = ('date_joined', 'last_login')


# ─── INQUIRIES ────────────────────────────────────────────────────────────────

@admin.register(BulkInquiry)
class BulkInquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_name', 'contact_email', 'contact_phone', 'total_estimated_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('contact_email', 'company_name')
    list_editable = ('status',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [InquiryItemInline]


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('inquiry', 'final_price', 'status', 'valid_until')
    list_filter = ('status',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'tracking_number', 'estimated_delivery')
    list_filter = ('status',)
    search_fields = ('user__email', 'tracking_number')


# ─── DESIGN ENGINE ────────────────────────────────────────────────────────────

@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'user', 'file_type', 'file_size_bytes', 'created_at')
    list_filter = ('file_type',)
    search_fields = ('original_filename', 'user__email')


@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'print_zone', 'created_at')
    search_fields = ('title', 'user__email')


# ─── MISC ─────────────────────────────────────────────────────────────────────

admin.site.register(LoginHistory)
admin.site.register(Address)
admin.site.register(DesignObject)
admin.site.register(InquiryItem)
admin.site.register(AuditLog)

admin.site.site_header = "Hari Om Print House — Admin"
admin.site.site_title = "Print House Admin"
admin.site.index_title = "Welcome to Print House Management"
