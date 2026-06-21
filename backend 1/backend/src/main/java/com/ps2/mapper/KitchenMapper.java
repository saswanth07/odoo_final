package com.ps2.mapper;

import com.ps2.dto.KitchenItemDto;
import com.ps2.dto.KitchenOrderDto;
import com.ps2.entity.KitchenItem;
import com.ps2.entity.KitchenOrder;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class KitchenMapper {

    public KitchenOrderDto toDto(KitchenOrder entity) {
        if (entity == null) {
            return null;
        }
        KitchenOrderDto dto = new KitchenOrderDto();
        dto.setKitchenOrderId(entity.getKitchenOrderId());
        if (entity.getOrder() != null) {
            dto.setOrderId(entity.getOrder().getOrderId());
            dto.setOrderNumber(entity.getOrder().getOrderNumber());
            if (entity.getOrder().getTable() != null) {
                dto.setTableNumber(entity.getOrder().getTable().getTableNumber());
            }
            if (entity.getOrder().getCreatedAt() != null) {
                dto.setCreatedAt(entity.getOrder().getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss")));
            }
        }
        dto.setStage(entity.getStage());

        if (entity.getKitchenItems() != null) {
            dto.setItems(entity.getKitchenItems().stream().map(this::toItemDto).collect(Collectors.toList()));
        }

        return dto;
    }

    public KitchenItemDto toItemDto(KitchenItem entity) {
        if (entity == null) return null;
        KitchenItemDto dto = new KitchenItemDto();
        dto.setKitchenItemId(entity.getKitchenItemId());
        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getProductId());
            dto.setProductName(entity.getProduct().getName());
        }
        dto.setCompleted(entity.getCompleted());
        dto.setQuantity(entity.getQuantity());
        return dto;
    }
}
