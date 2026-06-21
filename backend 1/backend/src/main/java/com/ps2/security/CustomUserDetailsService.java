package com.ps2.security;

import com.ps2.entity.Customer;
import com.ps2.entity.User;
import com.ps2.repository.CustomerRepository;
import com.ps2.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public CustomUserDetailsService(UserRepository userRepository, CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check if employee
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (userOptional.isPresent()) {
            return new CustomUserDetails(userOptional.get());
        }

        // Check if customer
        Optional<Customer> customerOptional = customerRepository.findByEmail(username);
        if (customerOptional.isPresent()) {
            return new CustomCustomerDetails(customerOptional.get());
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}
