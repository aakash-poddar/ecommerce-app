package com.ecommerce.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String imageUrl;
    private String name;
    private String description;
    private double price;
    private Integer stock;
    private String category;
}
