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
        company_name = data.get("companyName", "")
        notes = data.get("notes", "")

        if not contact_email and user:
            contact_email = user.email
        if not contact_email:
            return JsonResponse({"error": "Contact email is required."}, status=400)
        if not items:
            return JsonResponse({"error": "Cart is empty."}, status=400)

        inquiry = BulkInquiry.objects.create(
            user=user,
            contact_email=contact_email,
            company_name=company_name,
            customer_notes=notes,
            total_estimated_price=total_price,
            status='PENDING'
        )
        return JsonResponse({"success": True, "inquiry_id": str(inquiry.id)})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
