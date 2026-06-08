package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.UserRequest;
import com.ecommerce.backend.dto.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();

    Long getLoggedInUserId();
}
