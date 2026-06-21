package com.ps2.controller;

import com.ps2.dto.request.LoginRequest;
import com.ps2.dto.response.JwtResponse;
import com.ps2.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/customer/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody com.ps2.dto.request.CustomerRegisterRequest registerRequest) {
        authService.registerCustomer(registerRequest);
        return ResponseEntity.ok("Customer registered successfully!");
    }

    @PutMapping("/theme")
    public ResponseEntity<Void> updateTheme(@RequestParam String theme, java.security.Principal principal) {
        if (principal != null) {
            authService.updateTheme(principal.getName(), theme);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
    }
}
