package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ProductService {

    Map<String, String> uploadFile(MultipartFile file);

    ProductResponse addProduct(ProductRequest request, MultipartFile file);

    ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile file);

    List<ProductResponse> readProducts();

    ProductResponse readProduct(Long id);

    boolean deleteFile(String publicId);

    void deleteProduct(Long id);
}
