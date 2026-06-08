package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);

    List<OrderResponse> getUserOrders();

    void removeOrder(Long orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(Long orderId, String status);
}
