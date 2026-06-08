package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
   Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);

   List<Cart> findByUserId(Long userId);

   void deleteByUserId(Long userId);
}


