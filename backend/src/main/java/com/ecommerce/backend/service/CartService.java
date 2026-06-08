package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CartRequest;
import com.ecommerce.backend.dto.CartResponse;
import com.ecommerce.backend.entity.Cart;

import java.util.List;

public interface CartService {
    CartResponse addToCart(CartRequest request);


    List<CartResponse> getCart();

    void clearcart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
