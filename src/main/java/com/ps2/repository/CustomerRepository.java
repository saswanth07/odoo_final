package com.ps2.repository;

import com.ps2.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);
    java.util.List<Customer> findByNameContainingIgnoreCaseOrPhoneContaining(String name, String phone);
}
