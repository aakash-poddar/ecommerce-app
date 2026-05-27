package com.ecommerce.backend.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role;  // "ROLE_USER" or "ROLE_ADMIN"


}
