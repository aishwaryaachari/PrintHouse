import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


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
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last[0] if last else "",
        )
        login(request, user)
        return JsonResponse({
            "success": True,
            "user": {"id": user.id, "name": user.get_full_name() or user.username, "email": user.email}
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
            "user": {"id": user.id, "name": user.get_full_name() or user.username, "email": user.email}
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
            "user": {"id": u.id, "name": u.get_full_name() or u.username, "email": u.email}
        })
    return JsonResponse({"authenticated": False}, status=401)


@csrf_exempt
@require_http_methods(["POST"])
def inquiry_view(request):
    try:
        from .models import BulkInquiry
        user = request.user if request.user.is_authenticated else None
        
        data = json.loads(request.body)
        items = data.get("items", [])
        total_price = data.get("totalPrice", 0)
        total_items = data.get("totalItems", 0)
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
        
        return JsonResponse({
            "success": True,
            "inquiry_id": inquiry.id
        })
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


@csrf_exempt
@require_http_methods(["POST"])
def submit_payment_view(request, inquiry_id):
    try:
        from .models import BulkInquiry
        from django.utils import timezone
        
        try:
            inquiry = BulkInquiry.objects.get(id=inquiry_id)
        except BulkInquiry.DoesNotExist:
            return JsonResponse({"error": "Inquiry not found."}, status=404)
            
        payment_method = request.POST.get("payment_method", "").strip()
        payment_notes = request.POST.get("payment_notes", "").strip()
        payment_receipt = request.FILES.get("payment_receipt")
        
        if not payment_method:
            return JsonResponse({"error": "Payment method is required."}, status=400)
        if not payment_receipt:
            return JsonResponse({"error": "Payment receipt screenshot is required."}, status=400)
            
        inquiry.payment_method = payment_method
        inquiry.payment_notes = payment_notes
        inquiry.payment_receipt = payment_receipt
        inquiry.payment_submitted_at = timezone.now()
        inquiry.status = 'PAYMENT_SUBMITTED'
        inquiry.save()
        
        return JsonResponse({
            "success": True,
            "message": "Payment receipt submitted successfully.",
            "status": inquiry.status
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
            data.append({
                "id": inf.id,
                "contact_email": inf.contact_email,
                "total_price": float(inf.total_price),
                "total_items": inf.total_items,
                "status": inf.get_status_display(),
                "status_code": inf.status,
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





