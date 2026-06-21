package com.ps2.service.impl;

import com.ps2.dto.request.LoginRequest;
import com.ps2.dto.request.RegisterRequest;
import com.ps2.dto.response.JwtResponse;
import com.ps2.entity.Customer;
import com.ps2.entity.User;
import com.ps2.exception.DuplicateResourceException;
import com.ps2.repository.UserRepository;
import com.ps2.security.CustomUserDetails;
import com.ps2.security.CustomCustomerDetails;
import com.ps2.security.JwtUtils;
import com.ps2.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final com.ps2.repository.CustomerRepository customerRepository;
    private final com.ps2.service.EmailService emailService;

    public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder encoder, JwtUtils jwtUtils, com.ps2.repository.CustomerRepository customerRepository, com.ps2.service.EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.customerRepository = customerRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void registerCustomer(com.ps2.dto.request.CustomerRegisterRequest request) {
        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Error: Email is already in use by another customer!");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Error: Email is already in use by an employee!");
        }

        com.ps2.entity.Customer customer = new com.ps2.entity.Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setPassword(encoder.encode(request.getPassword()));

        customerRepository.save(customer);
    }

    @Override
    @Transactional
    public void registerEmployee(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent() || customerRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Error: Email is already in use!");
        }

        // Generate a random password
        String generatedPassword = java.util.UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(generatedPassword));
        user.setRole(registerRequest.getRole());

        userRepository.save(user);
        
        emailService.sendPasswordEmail(user.getEmail(), generatedPassword);
    }

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomCustomerDetails) {
            CustomCustomerDetails customerDetails = (CustomCustomerDetails) principal;
            return new JwtResponse(jwt,
                    customerDetails.getCustomer().getCustomerId(),
                    customerDetails.getCustomer().getName(),
                    customerDetails.getUsername(),
                    "CUSTOMER",
                    customerDetails.getCustomer().getTheme());
        } else if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            return new JwtResponse(jwt,
                    userDetails.getUser().getUserId(),
                    userDetails.getUser().getName(),
                    userDetails.getUsername(),
                    userDetails.getUser().getRole().name(),
                    userDetails.getUser().getTheme());
        }
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
    }

    @Override
    @Transactional
    public void updateTheme(String email, String theme) {
        java.util.Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTheme(theme);
            userRepository.save(user);
            return;
        }
        java.util.Optional<Customer> custOpt = customerRepository.findByEmail(email);
        if (custOpt.isPresent()) {
            Customer customer = custOpt.get();
            customer.setTheme(theme);
            customerRepository.save(customer);
            return;
        }
        throw new com.ps2.exception.ResourceNotFoundException("User/Customer not found with email: " + email);
    }
}
