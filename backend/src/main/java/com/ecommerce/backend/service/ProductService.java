package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;

import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Long id);
}
