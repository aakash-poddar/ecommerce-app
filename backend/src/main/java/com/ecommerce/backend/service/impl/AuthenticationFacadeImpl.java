package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.service.AuthenticationFacade;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationFacadeImpl implements AuthenticationFacade {

    @Override
    public Authentication getAuthentication() {
        return  SecurityContextHolder.getContext().getAuthentication();
    }
}
