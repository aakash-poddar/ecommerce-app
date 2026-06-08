package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.CartRequest;
import com.ecommerce.backend.dto.CartResponse;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public CartResponse addToCart(CartRequest request) {

        Long userId = userService.getLoggedInUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository
                .findByUserIdAndProductId(userId, request.getProductId())
                .orElse(null);

        if (cart != null) {

            cart.setQuantity(cart.getQuantity() + 1);

        } else {

            cart = Cart.builder()
                    .user(user)
                    .product(product)
                    .quantity(1)
                    .build();
        }

        cart = cartRepository.save(cart);

        return convertToResponse(cart);
    }

    @Override
    public List<CartResponse> getCart() {

        Long userId = userService.getLoggedInUserId();

        return cartRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public void clearcart() {

        Long userId = userService.getLoggedInUserId();

        cartRepository.deleteByUserId(userId);
    }

    @Override
    public CartResponse removeFromCart(CartRequest request) {

        Long userId = userService.getLoggedInUserId();

        Cart cart = cartRepository
                .findByUserIdAndProductId(userId, request.getProductId())
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (cart.getQuantity() > 1) {

            cart.setQuantity(cart.getQuantity() - 1);

            cart = cartRepository.save(cart);

            return convertToResponse(cart);
        }

        CartResponse response = convertToResponse(cart);

        cartRepository.delete(cart);

        return response;
    }

    private CartResponse convertToResponse(Cart cart) {

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .productId(cart.getProduct().getId())
                .productName(cart.getProduct().getName())
                .price(cart.getProduct().getPrice())
                .quantity(cart.getQuantity())
                .build();
    }
}