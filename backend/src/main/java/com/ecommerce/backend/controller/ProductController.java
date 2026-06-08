package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import java.util.List;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ProductResponse addProduct(@RequestPart("food") @Valid ProductRequest request,
                                      @RequestPart(value = "file", required = false) MultipartFile file){

        ProductResponse response = productService.addProduct(request, file);
        return response;
    }

    @GetMapping
    public List<ProductResponse> readFoods(){
        return  productService.readProducts();

    }

    @GetMapping("/{id}")
    public ProductResponse  readFood(@PathVariable Long id){
        return productService.readProduct(id);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id,
                                         @RequestPart("food") @Valid ProductRequest request,
                                         @RequestPart(value = "file", required = false) MultipartFile file) {

        ProductResponse response = productService.updateProduct(id, request, file);
        return response;
    }

}
