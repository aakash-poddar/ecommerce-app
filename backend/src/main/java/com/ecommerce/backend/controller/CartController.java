package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CartRequest;
import com.ecommerce.backend.dto.CartResponse;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request) {

        Long productId = request.getProductId();

        if (productId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Product Id is required"
            );
        }

        return cartService.addToCart(request);
    }

    @GetMapping
    public List<CartResponse> getCart() {
        return cartService.getCart();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearcart();
    }

    @PostMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request) {

        Long productId = request.getProductId();

        if (productId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Product Id is required"
            );
        }

        return cartService.removeFromCart(request);
    }
}