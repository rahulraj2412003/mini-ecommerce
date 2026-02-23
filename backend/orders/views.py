from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from cart.models import Cart, CartItem
from .models import Order, OrderItem

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user

    cart = get_object_or_404(Cart, user=user)
    cart_items = CartItem.objects.filter(cart=cart)

    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    total = sum(item.quantity * item.product.price for item in cart_items)

    order = Order.objects.create(
        user=user,
        total_amount=total
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    cart_items.delete()  # ✅ Clear cart after order

    return Response({
        "message": "Order placed successfully 🎉",
        "order_id": order.id
    })