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
            status='PENDING'
        )
        
        return JsonResponse({
            "success": True,
            "inquiry_id": inquiry.id
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

