from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from store.models import Product
from .serializers import CartItemSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    # ✅ Get or create cart for user
    cart, created = Cart.objects.get_or_create(user=user)

    # ✅ Get product
    product = get_object_or_404(Product, id=product_id)

    # ✅ Get or create cart item
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()

    return Response({
        "message": "Product added to cart",
        "product": product.name,
        "quantity": cart_item.quantity
    })




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    user = request.user

    # ✅ Get user's cart
    cart = get_object_or_404(Cart, user=user)

    # ✅ Get cart items
    cart_items = CartItem.objects.filter(cart=cart)

    serializer = CartItemSerializer(cart_items, many=True)

    return Response({
        "cart_items": serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    user = request.user

    # ✅ Get user's cart
    cart = get_object_or_404(Cart, user=user)

    # ✅ Get cart item
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

    cart_item.delete()

    return Response({
        "message": "Item removed from cart"
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    user = request.user
    quantity = int(request.data.get('quantity', 1))

    # ✅ Get user's cart
    cart = get_object_or_404(Cart, user=user)

    # ✅ Get cart item securely
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

    # ✅ Prevent invalid quantity
    if quantity < 1:
        cart_item.delete()
        return Response({
            "message": "Item removed (quantity < 1)"
        })

    cart_item.quantity = quantity
    cart_item.save()

    return Response({
        "message": "Quantity updated",
        "item_id": cart_item.id,
        "new_quantity": cart_item.quantity
    })
