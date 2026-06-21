package com.ps2.service;

import com.ps2.dto.request.LoginRequest;
import com.ps2.dto.request.RegisterRequest;
import com.ps2.dto.response.JwtResponse;

public interface AuthService {
    void registerCustomer(com.ps2.dto.request.CustomerRegisterRequest request);
    void registerEmployee(RegisterRequest registerRequest);
    JwtResponse authenticateUser(LoginRequest loginRequest);
    void updateTheme(String email, String theme);
}
