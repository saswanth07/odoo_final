package com.ps2.service;

import com.ps2.dto.PaymentDto;
import com.ps2.entity.PaymentStatus;

public interface PaymentService {
    PaymentDto createPayment(PaymentDto paymentDto);
    PaymentDto updatePaymentStatus(Long paymentId, PaymentStatus status);
    java.util.List<PaymentDto> getPaymentsByCustomerId(Long customerId);
    java.util.List<PaymentDto> getAllPayments();
}
