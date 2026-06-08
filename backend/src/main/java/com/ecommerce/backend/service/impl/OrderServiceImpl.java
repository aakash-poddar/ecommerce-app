package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.AuthenticationFacade;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public OrderResponse createOrder(OrderRequest request) {

        Long loggedInUserId = userService.getLoggedInUserId();
        User user = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .totalAmount(request.getAmount())
                .address(request.getUserAddress())
                .phone(request.getPhoneNumber())
                .status("PLACED")
                .orderDate(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Order place hone ke baad cart clear
        cartRepository.deleteByUserId(loggedInUserId);

        return convertToResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getUserOrders() {

        Long loggedInUserId = userService.getLoggedInUserId();

        return orderRepository.findByUserId(loggedInUserId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void removeOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Long currentUserId = userService.getLoggedInUserId();
        boolean isAdmin = authenticationFacade.getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));

        if (!isAdmin && (order.getUser() == null || !currentUserId.equals(order.getUser().getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own order");
        }

        orderRepository.delete(order);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {

        return orderRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        orderRepository.save(order);
    }

    private OrderResponse convertToResponse(Order order) {

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .email(order.getUser().getEmail())
                .userAddress(order.getAddress())
                .phoneNumber(order.getPhone())
                .amount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .orderStatus(order.getStatus())
                .orderDate(order.getOrderDate())
                .build();
    }
}