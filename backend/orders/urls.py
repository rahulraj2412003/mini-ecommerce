from django.urls import path
from .views import place_order

urlpatterns = [
    path('orders/place/', place_order),
]