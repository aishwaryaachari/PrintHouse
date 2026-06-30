import json
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import (
    Category, Subcategory, Product, ProductVariant,
    QuantityPriceTier, PrintZone, BulkInquiry
)

User = get_user_model()


# ─── CATALOG VIEWS ────────────────────────────────────────────────────────────

@require_http_methods(["GET"])
def categories_view(request):
    """Return all active categories with their subcategories."""
    cats = Category.objects.filter(is_active=True, is_deleted=False).order_by('sort_order')
    data = []
    for cat in cats:
        subs = cat.subcategories.filter(is_active=True, is_deleted=False).order_by('sort_order')
        data.append({
            "id": str(cat.id),
            "name": cat.name,
            "slug": cat.slug,
            "subcategories": [
                {"id": str(s.id), "name": s.name, "slug": s.slug}
                for s in subs
            ]
        })
    return JsonResponse({"categories": data})


@require_http_methods(["GET"])
def products_view(request):
    """
    Return active products. Optionally filter by:
    ?category=<slug>   — filter by category slug
    ?subcategory=<slug> — filter by subcategory slug
    ?featured=true     — only featured products
    """
    qs = Product.objects.filter(is_active=True, is_deleted=False).select_related('category', 'subcategory')

    cat_slug = request.GET.get('category')
    sub_slug = request.GET.get('subcategory')
    featured = request.GET.get('featured')

    if cat_slug:
        qs = qs.filter(category__slug=cat_slug)
    if sub_slug:
        qs = qs.filter(subcategory__slug=sub_slug)
    if featured == 'true':
        qs = qs.filter(is_featured=True)

    products = []
    for p in qs:
        # Collect variants (colors + sizes)
        variants = p.variants.filter(is_active=True, is_deleted=False)
        colors = []
        sizes = []
        seen_colors = set()
        seen_sizes = set()
        for v in variants:
            if v.color_name and v.color_name not in seen_colors:
                colors.append({"name": v.color_name, "hex": v.color_hex, "image": v.image_url, "sku": v.sku})
                seen_colors.add(v.color_name)
            if v.size and v.size not in seen_sizes:
                sizes.append(v.size)
                seen_sizes.add(v.size)

        # Collect quantity price tiers
        tiers = p.price_tiers.filter(is_deleted=False).order_by('minimum_quantity')
        quantities = [t.minimum_quantity for t in tiers]
        price_per_item = {str(t.minimum_quantity): float(t.price_per_unit) for t in tiers}

        # Collect print zones
        zones = p.print_zones.filter(is_deleted=False)
        print_zones = [
            {
                "id": str(z.id),
                "title": z.title,
                "type": z.zone_type,
                "px": z.px, "py": z.py,
                "pWidth": z.p_width, "pHeight": z.p_height,
                "angle": 0,
                "shape": "rectangle"
            }
            for z in zones
        ]

        # Collect product images
        imgs = p.images.filter(is_deleted=False).order_by('sort_order')
        images = [i.image_url for i in imgs]
        if not images and colors:
            images = [c["image"] for c in colors if c["image"]]

        # Collect printing methods
        methods = [m.name for m in p.printing_methods.all()]

        products.append({
            "id": str(p.id),
            "slug": p.slug,
            "name": p.name,
            "badge": p.badge,
            "description": p.description,
            "short_description": p.short_description,
            "material": p.material,
            "thumbnail": p.thumbnail,
            "category": p.category.slug,
            "categoryName": p.category.name,
            "subcategory": p.subcategory.slug if p.subcategory else "",
            "subcategoryName": p.subcategory.name if p.subcategory else "",
            "colors": colors,
            "sizes": sizes,
            "customizations": ["Text", "Image"],
            "quantities": quantities,
            "pricePerItem": price_per_item,
            "images": images,
            "printZones": print_zones,
            "printingMethods": methods,
            "minimumOrderQuantity": p.minimum_order_quantity,
            "isFeatured": p.is_featured,
        })

    return JsonResponse({"products": products})


@require_http_methods(["GET"])
def product_detail_view(request, slug):
    """Return full detail for a single product by its slug."""
    try:
        p = Product.objects.get(slug=slug, is_active=True, is_deleted=False)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found."}, status=404)

    variants = p.variants.filter(is_active=True, is_deleted=False)
    colors, sizes, seen_colors, seen_sizes = [], [], set(), set()
    for v in variants:
        if v.color_name and v.color_name not in seen_colors:
            colors.append({"name": v.color_name, "hex": v.color_hex, "image": v.image_url, "sku": v.sku})
            seen_colors.add(v.color_name)
        if v.size and v.size not in seen_sizes:
            sizes.append(v.size)
            seen_sizes.add(v.size)

    tiers = p.price_tiers.filter(is_deleted=False).order_by('minimum_quantity')
    quantities = [t.minimum_quantity for t in tiers]
    price_per_item = {str(t.minimum_quantity): float(t.price_per_unit) for t in tiers}

    zones = p.print_zones.filter(is_deleted=False)
    print_zones = [
        {
            "id": str(z.id),
            "title": z.title,
            "type": z.zone_type,
            "px": z.px, "py": z.py,
            "pWidth": z.p_width, "pHeight": z.p_height,
            "angle": 0,
            "shape": "rectangle"
        }
        for z in zones
    ]

    imgs = p.images.filter(is_deleted=False).order_by('sort_order')
    images = [i.image_url for i in imgs]
    if not images and colors:
        images = [c["image"] for c in colors if c["image"]]

    methods = [m.name for m in p.printing_methods.all()]

    return JsonResponse({
        "id": str(p.id),
        "slug": p.slug,
        "name": p.name,
        "badge": p.badge,
        "description": p.description,
        "short_description": p.short_description,
        "material": p.material,
        "thumbnail": p.thumbnail,
        "category": p.category.slug,
        "categoryName": p.category.name,
        "subcategory": p.subcategory.slug if p.subcategory else "",
        "subcategoryName": p.subcategory.name if p.subcategory else "",
        "colors": colors,
        "sizes": sizes,
        "customizations": ["Text", "Image"],
        "quantities": quantities,
        "pricePerItem": price_per_item,
        "images": images,
        "printZones": print_zones,
        "printingMethods": methods,
        "minimumOrderQuantity": p.minimum_order_quantity,
        "isFeatured": p.is_featured,
    })


# ─── AUTH VIEWS ───────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def signup_view(request):
    try:
        data = json.loads(request.body)
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name or not email or not password:
            return JsonResponse({"error": "All fields are required."}, status=400)
        if len(password) < 6:
            return JsonResponse({"error": "Password must be at least 6 characters."}, status=400)
        if User.objects.filter(username=email).exists():
            return JsonResponse({"error": "An account with this email already exists."}, status=400)

        first_name, *last = name.split(" ", 1)
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=first_name, last_name=last[0] if last else "",
        )
        login(request, user)
        return JsonResponse({
            "success": True,
            "user": {"id": str(user.id), "name": user.get_full_name() or user.username, "email": user.email}
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return JsonResponse({"error": "Email and password are required."}, status=400)

        user = authenticate(request, username=email, password=password)
        if user is None:
            return JsonResponse({"error": "Invalid email or password."}, status=401)

        login(request, user)
        return JsonResponse({
            "success": True,
            "user": {"id": str(user.id), "name": user.get_full_name() or user.username, "email": user.email}
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True})


@require_http_methods(["GET"])
def me_view(request):
    if request.user.is_authenticated:
        u = request.user
        return JsonResponse({
            "authenticated": True,
            "user": {"id": str(u.id), "name": u.get_full_name() or u.username, "email": u.email}
        })
    return JsonResponse({"authenticated": False}, status=401)


@csrf_exempt
@require_http_methods(["POST"])
def inquiry_view(request):
    try:
        user = request.user if request.user.is_authenticated else None
        data = json.loads(request.body)
        items = data.get("items", [])
        total_price = data.get("totalPrice", 0)
        contact_email = data.get("email", "")
        
        # B2B fields
        company_name = data.get("companyName", "").strip()
        contact_person = data.get("contactPerson", "").strip()
        phone_number = data.get("phoneNumber", "").strip()
        gst_number = data.get("gstNumber", "").strip()
        delivery_address = data.get("deliveryAddress", "").strip()
        notes = data.get("notes", "").strip()
        
        if not contact_email and user:
            contact_email = user.email
        if not contact_email:
            return JsonResponse({"error": "Contact email is required."}, status=400)
        if not items:
            return JsonResponse({"error": "Cart is empty."}, status=400)

        inquiry = BulkInquiry.objects.create(
            user=user,
            contact_email=contact_email,
            items=items,
            total_price=total_price,
            total_items=total_items,
            status='PENDING',
            company_name=company_name,
            contact_person=contact_person,
            phone_number=phone_number,
            gst_number=gst_number or None,
            delivery_address=delivery_address,
            notes=notes
        )
        return JsonResponse({"success": True, "inquiry_id": str(inquiry.id)})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_products_view(request):
    try:
        from .models import Product
        seed_default_products()
        
        products = Product.objects.all()
        data = {}
        for p in products:
            zones = []
            for z in p.print_zones_rel.all():
                zones.append({
                    "id": z.zone_id,
                    "title": z.title,
                    "type": z.zone_type,
                    "px": z.px,
                    "py": z.py,
                    "pWidth": z.pWidth,
                    "pHeight": z.pHeight,
                    "angle": z.angle,
                    "shape": z.shape
                })
            
            # Convert string keys back to numbers if needed (pricePerItem is e.g. {25: 320, 50: 280})
            price_map = {}
            for k, v in p.price_per_item.items():
                try:
                    price_map[int(k)] = v
                except ValueError:
                    price_map[k] = v

            data[p.category] = {
                "name": p.name,
                "badge": p.badge,
                "description": p.description,
                "features": p.features,
                "offer": p.offer,
                "sizes": p.sizes,
                "colors": p.colors,
                "customizations": p.customizations,
                "quantities": p.quantities,
                "pricePerItem": price_map,
                "images": p.images,
                "printZones": zones,
                "snapGuidesEnabled": p.snap_guides_enabled,
                "safetyMarginsEnabled": p.safety_margins_enabled,
                "rotationEnabled": p.rotation_enabled,
                "maxLogoSize": p.max_logo_size,
                "maxTextLength": p.max_text_length,
                "defaultLogoSize": p.default_logo_size,
                "defaultTextSize": p.default_text_size,
                "textCustomizationEnabled": p.text_customization_enabled,
                "logoCustomizationEnabled": p.logo_customization_enabled
            }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def seed_default_products():
    from .models import Product, PrintZone
    if Product.objects.exists():
        return
    
    # 1. Bottles
    p1 = Product.objects.create(
        category="bottles",
        name="Steel Insulated Bottle",
        badge="Best Seller",
        description="Our premium insulated bottle keeps water cold for 24 hours and hot for 12. A perfect canvas to showcase your brand identity.",
        features=[
            "Double-walled vacuum insulation",
            "BPA-free stainless steel (Grade 304)",
            "Leak-proof screw lid",
            "Dishwasher safe body",
            "Print area: 5cm × 8cm (front zone)"
        ],
        offer="Build your ideal bundle and save. Get 10% off when you buy 2, 15% off when you buy 3, and 20% off on 4 or more.",
        sizes=["500ml", "750ml", "1L"],
        colors=[
            {"name": "Matte White", "hex": "#e8e8e8", "image": "/bottle_white.png"},
            {"name": "Matte Black", "hex": "#1a1a1a", "image": "/bottle_black.png"},
            {"name": "Steel Grey", "hex": "#8a8a8a", "image": "/bottle_grey.png"}
        ],
        customizations=["Text", "Image"],
        quantities=[25, 50, 100, 250, 500, 1000],
        price_per_item={"25": 320, "50": 280, "100": 240, "250": 200, "500": 170, "1000": 150},
        images=["/product_bottle.png"],
        snap_guides_enabled=True,
        safety_margins_enabled=True,
        rotation_enabled=True,
        max_logo_size=150,
        max_text_length=50,
        default_logo_size=120,
        default_text_size=24,
        text_customization_enabled=True,
        logo_customization_enabled=True
    )
    PrintZone.objects.create(
        product=p1, zone_id="front_logo", title="Main Body Print", zone_type="cylindrical",
        px=0.35, py=0.3, pWidth=0.3, pHeight=0.45, angle=0, shape="rectangle"
    )
    PrintZone.objects.create(
        product=p1, zone_id="lid_engraving", title="Lid Engraving", zone_type="flat",
        px=0.4, py=0.1, pWidth=0.2, pHeight=0.08, angle=0, shape="rectangle"
    )

    # 2. Mugs
    p2 = Product.objects.create(
        category="mugs",
        name="Ceramic Coffee Mug",
        badge="Classic",
        description="Classic 11oz ceramic mug with a smooth finish. Perfect for morning coffees and corporate giveaways.",
        features=[
            "High-quality ceramic",
            "Microwave and dishwasher safe",
            "Smooth, glossy finish",
            "Comfortable C-handle",
            "Vibrant full-color printing"
        ],
        offer="Volume discounts available. Save 20% on orders over 100.",
        sizes=["11oz", "15oz"],
        colors=[
            {"name": "White", "hex": "#ffffff", "image": "/mug_white.png"},
            {"name": "Black", "hex": "#111111", "image": "/mug_black.png"},
            {"name": "Grey", "hex": "#8a8a8a", "image": "/mug_grey.png"}
        ],
        customizations=["Text", "Image"],
        quantities=[25, 50, 100, 250, 500, 1000],
        price_per_item={"25": 150, "50": 120, "100": 100, "250": 85, "500": 70, "1000": 60},
        images=["/mug_black.png", "/mug_grey.png", "/mug_white.png"],
        snap_guides_enabled=True,
        safety_margins_enabled=True,
        rotation_enabled=True,
        max_logo_size=150,
        max_text_length=50,
        default_logo_size=120,
        default_text_size=24,
        text_customization_enabled=True,
        logo_customization_enabled=True
    )
    PrintZone.objects.create(
        product=p2, zone_id="front", title="Front Print", zone_type="cylindrical",
        px=0.3, py=0.3, pWidth=0.4, pHeight=0.4, angle=0, shape="rectangle"
    )

    # 3. Diaries
    p3 = Product.objects.create(
        category="diaries",
        name="Premium Leatherette Diary",
        badge="Executive",
        description="A5 softcover diary with premium 80gsm ruled paper. The perfect corporate companion.",
        features=[
            "Premium faux leather cover",
            "192 pages of 80gsm ruled paper",
            "Ribbon bookmark",
            "Elastic closure band",
            "Expandable inner pocket"
        ],
        offer="Free embossing on orders over 50.",
        sizes=["A5", "A4"],
        colors=[
            {"name": "Black", "hex": "#111111", "image": "/diary_black.png"},
            {"name": "Grey", "hex": "#8a8a8a", "image": "/diary_grey.png"},
            {"name": "White", "hex": "#ffffff", "image": "/diary_white.png"}
        ],
        customizations=["Text", "Image"],
        quantities=[25, 50, 100, 250, 500, 1000],
        price_per_item={"25": 250, "50": 220, "100": 190, "250": 160, "500": 140, "1000": 120},
        images=["/diary_black.png", "/diary_grey.png", "/diary_white.png"],
        snap_guides_enabled=True,
        safety_margins_enabled=True,
        rotation_enabled=True,
        max_logo_size=180,
        max_text_length=60,
        default_logo_size=120,
        default_text_size=24,
        text_customization_enabled=True,
        logo_customization_enabled=True
    )
    PrintZone.objects.create(
        product=p3, zone_id="cover", title="Front Cover", zone_type="flat",
        px=0.25, py=0.2, pWidth=0.5, pHeight=0.6, angle=0, shape="rectangle"
    )

    # 4. Pens
    p4 = Product.objects.create(
        category="pens",
        name="Metallic Rollerball Pen",
        badge="Premium",
        description="Smooth-writing premium rollerball pen with a heavy metallic body for laser engraving.",
        features=[
            "Heavy metallic body",
            "Smooth-writing rollerball tip",
            "Premium black ink",
            "Sleek professional design",
            "Perfect for precision laser engraving"
        ],
        offer="Custom presentation boxes available on bulk orders.",
        sizes=["Standard"],
        colors=[
            {"name": "Black", "hex": "#111111", "image": "/pen_black.png"},
            {"name": "Blue", "hex": "#0000ff", "image": "/pen_blue.png"},
            {"name": "Grey", "hex": "#8a8a8a", "image": "/pen_grey.png"}
        ],
        customizations=["Text", "Image"],
        quantities=[50, 100, 250, 500, 1000],
        price_per_item={"50": 80, "100": 60, "250": 45, "500": 35, "1000": 25},
        images=["/pen_black.png", "/pen_blue.png", "/pen_grey.png"],
        snap_guides_enabled=True,
        safety_margins_enabled=True,
        rotation_enabled=True,
        max_logo_size=80,
        max_text_length=30,
        default_logo_size=120,
        default_text_size=24,
        text_customization_enabled=True,
        logo_customization_enabled=True
    )
    PrintZone.objects.create(
        product=p4, zone_id="barrel", title="Pen Barrel", zone_type="flat",
        px=0.45, py=0.4, pWidth=0.1, pHeight=0.4, angle=0, shape="rectangle"
    )



@csrf_exempt
@require_http_methods(["POST"])
def validate_coupon_view(request):
    try:
        from django.utils import timezone
        from .models import CouponCode
        
        data = json.loads(request.body)
        code_str = data.get("code", "").strip()
        
        if not code_str:
            return JsonResponse({"error": "Coupon code is required."}, status=400)
            
        try:
            coupon = CouponCode.objects.get(code__iexact=code_str)
        except CouponCode.DoesNotExist:
            return JsonResponse({"error": "Invalid coupon code."}, status=400)
            
        now = timezone.now()
        if not coupon.is_active or coupon.valid_from > now or coupon.valid_to < now:
            return JsonResponse({"error": "This coupon has expired or is inactive."}, status=400)
            
        return JsonResponse({
            "success": True,
            "code": coupon.code,
            "discount_percentage": coupon.discount_percentage
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_coupons_view(request):
    try:
        from django.utils import timezone
        from .models import CouponCode
        now = timezone.now()
        coupons = CouponCode.objects.filter(is_active=True, valid_from__lte=now, valid_to__gte=now)
        return JsonResponse({
            "success": True,
            "coupons": [{"code": c.code, "discount_percentage": c.discount_percentage} for c in coupons]
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def payment_settings_view(request):
    try:
        from .models import PaymentSetting
        setting, _ = PaymentSetting.objects.get_or_create(id=1)
        return JsonResponse({
            "success": True,
            "upi_id": setting.upi_id,
            "qr_code": setting.qr_code.url if setting.qr_code else None,
            "bank_name": setting.bank_name,
            "account_name": setting.account_name,
            "account_number": setting.account_number,
            "ifsc_code": setting.ifsc_code
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def map_inquiry_status_for_frontend(inquiry):
    db_status = inquiry.status
    latest_payment = inquiry.payments.order_by('-created_at').first()
    payment_status = latest_payment.status if latest_payment else 'PENDING'
    
    if db_status == 'PENDING':
        return 'Pending', 'PENDING'
    elif db_status == 'REJECTED':
        return 'Rejected', 'REJECTED'
    elif db_status == 'APPROVED':
        if payment_status == 'PENDING':
            return 'Approved', 'AWAITING_PAYMENT'
        elif payment_status == 'SUBMITTED':
            return 'Payment Submitted', 'PAYMENT_SUBMITTED'
        elif payment_status == 'VERIFIED':
            return 'Payment Verified', 'PAYMENT_VERIFIED'
        elif payment_status == 'FAILED':
            return 'Payment Failed', 'AWAITING_PAYMENT'
        elif payment_status == 'REFUNDED':
            return 'Refunded', 'REJECTED'
    elif db_status == 'PROCESSING':
        return 'Processing', 'PROCESSING'
    elif db_status == 'SHIPPED':
        return 'Shipped', 'SHIPPED'
    elif db_status == 'COMPLETED':
        return 'Completed', 'DELIVERED'
        
    return inquiry.get_status_display(), db_status


@csrf_exempt
@require_http_methods(["POST"])
def submit_payment_view(request, inquiry_id):
    try:
        from .models import BulkInquiry, Payment, CustomerNotification
        from django.utils import timezone
        
        try:
            inquiry = BulkInquiry.objects.get(id=inquiry_id)
        except BulkInquiry.DoesNotExist:
            return JsonResponse({"error": "Inquiry not found."}, status=404)
            
        # Block checkout if inquiry is Pending or Rejected
        if inquiry.status in ['PENDING', 'REJECTED']:
            return JsonResponse({"error": "Customer cannot place an order until the inquiry is approved."}, status=400)
            
        # If payment is already verified or submitted, reject double-submissions
        latest_payment = inquiry.payments.order_by('-created_at').first()
        if latest_payment and latest_payment.status in ['SUBMITTED', 'VERIFIED']:
            return JsonResponse({"error": "Payment has already been submitted or verified."}, status=400)
            
        payment_method = request.POST.get("payment_method", "").strip()
        payment_notes = request.POST.get("payment_notes", "").strip()
        payment_receipt = request.FILES.get("payment_receipt")
        
        if not payment_method:
            return JsonResponse({"error": "Payment method is required."}, status=400)
        if not payment_receipt:
            return JsonResponse({"error": "Payment receipt screenshot is required."}, status=400)
            
        # Maintain direct B2B fields for backward compatibility
        inquiry.payment_method = payment_method
        inquiry.payment_notes = payment_notes
        inquiry.payment_receipt = payment_receipt
        inquiry.payment_submitted_at = timezone.now()
        inquiry.save()
        
        # Create dedicated Payment record
        Payment.objects.create(
            inquiry=inquiry,
            amount=inquiry.total_price,
            payment_method=payment_method,
            payment_receipt=payment_receipt,
            payment_notes=payment_notes,
            status='SUBMITTED',
            submitted_at=timezone.now()
        )
        
        # Notify user
        if inquiry.user:
            CustomerNotification.objects.create(
                user=inquiry.user,
                inquiry=inquiry,
                message=f"Your payment proof for inquiry #HOPH-{inquiry.id} has been submitted and is awaiting verification."
            )
        
        return JsonResponse({
            "success": True,
            "message": "Payment receipt submitted successfully.",
            "status": "PAYMENT_SUBMITTED"
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_inquiries_view(request):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
            
        from .models import BulkInquiry
        inquiries = BulkInquiry.objects.filter(user=request.user).order_by('-created_at')
        
        data = []
        for inf in inquiries:
            display_status, status_code = map_inquiry_status_for_frontend(inf)
            data.append({
                "id": inf.id,
                "contact_email": inf.contact_email,
                "total_price": float(inf.total_price),
                "total_items": inf.total_items,
                "status": display_status,
                "status_code": status_code,
                "company_name": inf.company_name,
                "contact_person": inf.contact_person,
                "phone_number": inf.phone_number,
                "gst_number": inf.gst_number,
                "delivery_address": inf.delivery_address,
                "notes": inf.notes,
                "payment_method": inf.payment_method,
                "payment_receipt": inf.payment_receipt.url if inf.payment_receipt else None,
                "payment_notes": inf.payment_notes,
                "payment_submitted_at": inf.payment_submitted_at.isoformat() if inf.payment_submitted_at else None,
                "created_at": inf.created_at.isoformat(),
                "items": inf.items
            })
        return JsonResponse({"success": True, "inquiries": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_orders_view(request):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
            
        from .models import BulkInquiry
        orders = BulkInquiry.objects.filter(
            user=request.user,
            status__in=['APPROVED', 'PROCESSING', 'SHIPPED', 'COMPLETED']
        ).order_by('-created_at')
        
        data = []
        for o in orders:
            data.append({
                "id": o.id,
                "contact_email": o.contact_email,
                "total_price": float(o.total_price),
                "total_items": o.total_items,
                "status": o.get_status_display(),
                "status_code": o.status,
                "company_name": o.company_name,
                "contact_person": o.contact_person,
                "phone_number": o.phone_number,
                "gst_number": o.gst_number,
                "delivery_address": o.delivery_address,
                "notes": o.notes,
                "created_at": o.created_at.isoformat(),
                "items": o.items
            })
        return JsonResponse({"success": True, "orders": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_payment_history_view(request):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
            
        from .models import Payment
        payments = Payment.objects.filter(inquiry__user=request.user).order_by('-created_at')
        
        data = []
        for p in payments:
            data.append({
                "id": p.id,
                "inquiry_id": p.inquiry.id,
                "amount": float(p.amount),
                "payment_method": p.payment_method,
                "payment_receipt": p.payment_receipt.url if p.payment_receipt else None,
                "payment_notes": p.payment_notes,
                "status": p.get_status_display(),
                "status_code": p.status,
                "submitted_at": p.submitted_at.isoformat() if p.submitted_at else None,
                "verified_at": p.verified_at.isoformat() if p.verified_at else None,
                "created_at": p.created_at.isoformat()
            })
        return JsonResponse({"success": True, "payments": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def notifications_view(request):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
            
        from .models import CustomerNotification
        
        if request.method == "POST":
            try:
                data = json.loads(request.body)
                notif_id = data.get("notification_id")
                if notif_id:
                    CustomerNotification.objects.filter(id=notif_id, user=request.user).update(is_read=True)
                else:
                    CustomerNotification.objects.filter(user=request.user).update(is_read=True)
                return JsonResponse({"success": True})
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=400)
                
        # GET request
        notifications = CustomerNotification.objects.filter(user=request.user).order_by('-created_at')
        data = []
        for n in notifications:
            data.append({
                "id": n.id,
                "inquiry_id": n.inquiry.id if n.inquiry else None,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat()
            })
        return JsonResponse({"success": True, "notifications": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def order_status_view(request, inquiry_id):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
            
        from .models import BulkInquiry
        try:
            inquiry = BulkInquiry.objects.get(id=inquiry_id, user=request.user)
        except BulkInquiry.DoesNotExist:
            return JsonResponse({"error": "Inquiry not found."}, status=404)
            
        latest_payment = inquiry.payments.order_by('-created_at').first()
        
        return JsonResponse({
            "success": True,
            "inquiry_id": inquiry.id,
            "inquiry_status": inquiry.get_status_display(),
            "inquiry_status_code": inquiry.status,
            "payment_status": latest_payment.get_status_display() if latest_payment else "Not Submitted",
            "payment_status_code": latest_payment.status if latest_payment else None,
            "created_at": inquiry.created_at.isoformat(),
            "updated_at": inquiry.updated_at.isoformat(),
            "approved_at": inquiry.approved_at.isoformat() if inquiry.approved_at else None,
            "admin_remarks": inquiry.admin_remarks
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)





