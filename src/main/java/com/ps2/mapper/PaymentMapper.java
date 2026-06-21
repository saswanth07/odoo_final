package com.ps2.mapper;

import com.ps2.dto.PaymentDto;
import com.ps2.entity.Order;
import com.ps2.entity.Payment;
import com.ps2.entity.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDto toDto(Payment entity) {
        if (entity == null) {
            return null;
        }
        PaymentDto dto = new PaymentDto();
        dto.setPaymentId(entity.getPaymentId());
        if (entity.getOrder() != null) {
            dto.setOrderId(entity.getOrder().getOrderId());
        }
        if (entity.getPaymentMethod() != null) {
            dto.setMethodId(entity.getPaymentMethod().getMethodId());
            dto.setMethodName(entity.getPaymentMethod().getMethodName());
        }
        dto.setAmount(entity.getAmount());
        dto.setTransactionRef(entity.getTransactionRef());
        dto.setPaymentStatus(entity.getPaymentStatus());
        dto.setPaymentDate(entity.getPaymentDate());
        return dto;
    }

    public Payment toEntity(PaymentDto dto, Order order, PaymentMethod method) {
        if (dto == null) return null;
        Payment entity = new Payment();
        entity.setPaymentId(dto.getPaymentId());
        entity.setOrder(order);
        entity.setPaymentMethod(method);
        entity.setAmount(dto.getAmount());
        entity.setTransactionRef(dto.getTransactionRef());
        entity.setPaymentStatus(dto.getPaymentStatus());
        return entity;
    }
}
