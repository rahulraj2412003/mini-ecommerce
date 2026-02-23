from django.urls import path
from .views import place_order, order_history

urlpatterns = [
    path('orders/place/', place_order),
    path('orders/history/', order_history),
]