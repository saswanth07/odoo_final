package com.ps2.controller;

import com.ps2.dto.request.RegisterRequest;
import com.ps2.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final AuthService authService;
    private final com.ps2.service.UserService userService;

    public EmployeeController(AuthService authService, com.ps2.service.UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEmployee(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.registerEmployee(registerRequest);
        return ResponseEntity.ok("Employee registered successfully. Password sent via email.");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<com.ps2.dto.UserDto>> getAllEmployees() {
        return ResponseEntity.ok(userService.getAllEmployees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.ps2.dto.UserDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getEmployeeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.ps2.dto.UserDto> updateEmployee(@PathVariable Long id, @RequestBody com.ps2.dto.UserDto userDto) {
        return ResponseEntity.ok(userService.updateEmployee(id, userDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        userService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> archiveEmployee(@PathVariable Long id) {
        userService.archiveEmployee(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestParam String newPassword) {
        userService.changePassword(id, newPassword);
        return ResponseEntity.ok().build();
    }
}
