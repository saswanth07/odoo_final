package com.ps2.service.impl;

import com.ps2.dto.PaymentDto;
import com.ps2.entity.Order;
import com.ps2.entity.OrderStatus;
import com.ps2.entity.Payment;
import com.ps2.entity.PaymentMethod;
import com.ps2.entity.PaymentStatus;
import com.ps2.exception.BusinessException;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.PaymentMapper;
import com.ps2.repository.OrderRepository;
import com.ps2.repository.PaymentMethodRepository;
import com.ps2.repository.PaymentRepository;
import com.ps2.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMapper paymentMapper;

    public PaymentServiceImpl(PaymentRepository paymentRepository, OrderRepository orderRepository, PaymentMethodRepository paymentMethodRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.paymentMapper = paymentMapper;
    }

    @Override
    @Transactional
    public PaymentDto createPayment(PaymentDto paymentDto) {
        Order order = orderRepository.findById(paymentDto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new BusinessException("Order is already paid");
        }

        PaymentMethod method = paymentMethodRepository.findById(paymentDto.getMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        if (!method.getEnabled()) {
            throw new BusinessException("Payment method is disabled");
        }

        if (paymentDto.getPaymentStatus() == null) {
            paymentDto.setPaymentStatus(PaymentStatus.PENDING);
        }

        Payment payment = paymentMapper.toEntity(paymentDto, order, method);
        payment = paymentRepository.save(payment);

        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        }

        return paymentMapper.toDto(payment);
    }

    @Override
    @Transactional
    public PaymentDto updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setPaymentStatus(status);
        payment = paymentRepository.save(payment);

        if (status == PaymentStatus.SUCCESS) {
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        }

        return paymentMapper.toDto(payment);
    }

    @Override
    public java.util.List<PaymentDto> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByOrder_Customer_CustomerId(customerId).stream()
                .map(paymentMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }
}
