package com.ps2.controller;

import com.ps2.entity.PaymentMethod;
import com.ps2.repository.PaymentMethodRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodController(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        return ResponseEntity.ok(paymentMethodRepository.findAll());
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentMethod> createPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        PaymentMethod created = paymentMethodRepository.save(paymentMethod);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentMethod> updatePaymentMethod(@PathVariable Long id, @RequestBody PaymentMethod paymentMethod) {
        PaymentMethod existing = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new com.ps2.exception.ResourceNotFoundException("Payment method not found"));
        
        existing.setMethodName(paymentMethod.getMethodName());
        existing.setEnabled(paymentMethod.getEnabled());
        existing.setUpiId(paymentMethod.getUpiId());
        
        PaymentMethod updated = paymentMethodRepository.save(existing);
        return ResponseEntity.ok(updated);
    }
}
