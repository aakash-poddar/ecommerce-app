package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.OrderItem;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
public class OrderResponse {

    private Long id;
    private Long userId;
    private String userAddress;
    private String phoneNumber;
    private String email;

    private double amount;

    private String paymentStatus;
    private String paymentMethod;

    private String orderStatus;

    private LocalDateTime orderDate;

    private List<OrderItem> orderedItems;
}
