package com.ps2.mapper;

import com.ps2.dto.FeedbackDto;
import com.ps2.entity.Feedback;
import com.ps2.entity.Customer;
import com.ps2.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {

    public FeedbackDto toDto(Feedback entity) {
        if (entity == null) return null;
        
        FeedbackDto dto = new FeedbackDto();
        dto.setFeedbackId(entity.getFeedbackId());
        dto.setRating(entity.getRating());
        dto.setComments(entity.getComments());
        dto.setCreatedAt(entity.getCreatedAt());
        
        if (entity.getCustomer() != null) {
            dto.setCustomerId(entity.getCustomer().getCustomerId());
        }
        if (entity.getOrder() != null) {
            dto.setOrderId(entity.getOrder().getOrderId());
        }
        
        return dto;
    }

    public Feedback toEntity(FeedbackDto dto, Customer customer, Order order) {
        if (dto == null) return null;
        
        Feedback entity = new Feedback();
        entity.setFeedbackId(dto.getFeedbackId());
        entity.setRating(dto.getRating());
        entity.setComments(dto.getComments());
        entity.setCustomer(customer);
        entity.setOrder(order);
        
        return entity;
    }
}
