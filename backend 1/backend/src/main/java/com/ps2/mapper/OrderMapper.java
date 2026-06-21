package com.ps2.mapper;

import com.ps2.dto.OrderDto;
import com.ps2.dto.OrderItemDto;
import com.ps2.entity.Order;
import com.ps2.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDto toDto(Order entity) {
        if (entity == null) {
            return null;
        }
        OrderDto dto = new OrderDto();
        dto.setOrderId(entity.getOrderId());
        dto.setOrderNumber(entity.getOrderNumber());
        dto.setOrderType(entity.getOrderType());
        if (entity.getCustomer() != null) {
            dto.setCustomerId(entity.getCustomer().getCustomerId());
            dto.setCustomerName(entity.getCustomer().getName());
        } else {
            dto.setCustomerName("Guest");
        }
        if (entity.getTable() != null) {
            dto.setTableId(entity.getTable().getTableId());
            dto.setTableName(entity.getTable().getTableNumber());
        } else {
            dto.setTableName("Takeaway");
        }
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getUserId());
            dto.setUserName(entity.getUser().getName());
        } else {
            dto.setUserName("POS Session");
        }
        if (entity.getCoupon() != null) dto.setCouponId(entity.getCoupon().getCouponId());
        
        dto.setSubtotal(entity.getSubtotal());
        dto.setTaxAmount(entity.getTaxAmount());
        dto.setDiscountAmount(entity.getDiscountAmount());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getOrderItems() != null) {
            dto.setItems(entity.getOrderItems().stream().map(this::toItemDto).collect(Collectors.toList()));
        }

        return dto;
    }

    public OrderItemDto toItemDto(OrderItem entity) {
        if (entity == null) return null;
        OrderItemDto dto = new OrderItemDto();
        dto.setOrderItemId(entity.getOrderItemId());
        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getProductId());
            dto.setProductName(entity.getProduct().getName());
        }
        dto.setQuantity(entity.getQuantity());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setDiscount(entity.getDiscount());
        dto.setTotal(entity.getTotal());
        return dto;
    }
}
