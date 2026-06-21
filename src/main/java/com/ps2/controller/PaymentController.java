package com.ps2.controller;

import com.ps2.dto.PaymentDto;
import com.ps2.entity.PaymentStatus;
import com.ps2.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody PaymentDto paymentDto) {
        PaymentDto created = paymentService.createPayment(paymentDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<PaymentDto> updatePaymentStatus(@PathVariable Long paymentId, @RequestParam PaymentStatus status) {
        PaymentDto updated = paymentService.updatePaymentStatus(paymentId, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<java.util.List<PaymentDto>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
