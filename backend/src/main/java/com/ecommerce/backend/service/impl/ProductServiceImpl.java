package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Map<String, String> uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return Map.of();

        try {
            String uploadsDir = "uploads";
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path target = Paths.get(uploadsDir).resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Map<String, String> result = new HashMap<>();
            result.put("url", "/uploads/" + filename);
            result.put("publicId", filename);
            return result;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }

    @Override
    public ProductResponse addProduct(ProductRequest request, MultipartFile file) {

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();

        // if a file was uploaded, store it and set imageUrl
        if (file != null && !file.isEmpty()) {
            Map<String, String> upload = uploadFile(file);
            if (upload.containsKey("url")) {
                product.setImageUrl(upload.get("url"));
            }
        }

        product = productRepository.save(product);

        return convertToResponse(product);
    }

    @Override
    public List<ProductResponse> readProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ProductResponse readProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return convertToResponse(product);
    }

    @Override
    public boolean deleteFile(String publicId) {
        return true;
    }

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile file) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock());

        if (file != null && !file.isEmpty()) {
            Map<String, String> upload = uploadFile(file);
            if (upload.containsKey("url")) product.setImageUrl(upload.get("url"));
        }

        product = productRepository.save(product);

        return convertToResponse(product);
    }

    private ProductResponse convertToResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .build();
    }
}