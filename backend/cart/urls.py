from django.urls import path
from .views import add_to_cart, view_cart, remove_from_cart, update_cart_item

urlpatterns = [
    path('cart/add/', add_to_cart),
    path('cart/', view_cart),
    path('cart/remove/<int:item_id>/', remove_from_cart),
    path('cart/update/<int:item_id>/', update_cart_item),
]

