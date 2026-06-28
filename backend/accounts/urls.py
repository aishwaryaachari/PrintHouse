from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),
    path('inquiry/', views.inquiry_view, name='inquiry'),
    path('products/', views.get_products_view, name='products'),
    path('coupon/validate/', views.validate_coupon_view, name='validate_coupon'),
    path('coupon/list/', views.get_coupons_view, name='get_coupons'),
    path('payment/settings/', views.payment_settings_view, name='payment_settings'),
    path('inquiry/<int:inquiry_id>/submit-payment/', views.submit_payment_view, name='submit_payment'),
    path('inquiries/', views.get_inquiries_view, name='get_inquiries'),
    path('orders/', views.get_orders_view, name='get_orders'),
    path('payments/', views.get_payment_history_view, name='get_payments'),
    path('notifications/', views.notifications_view, name='notifications'),
    path('inquiry/<int:inquiry_id>/status/', views.order_status_view, name='order_status'),
]
