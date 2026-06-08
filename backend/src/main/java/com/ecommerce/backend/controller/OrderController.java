package com.ecommerce.backend.controller;



import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(
            @RequestBody OrderRequest request) {

        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getOrders() {

        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(
            @PathVariable Long orderId) {

        orderService.removeOrder(orderId);
    }

    // Admin
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> getOrdersOfAllUsers() {

        return orderService.getOrdersOfAllUsers();
    }

    // Admin
    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public void updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        orderService.updateOrderStatus(orderId, status);
    }
}