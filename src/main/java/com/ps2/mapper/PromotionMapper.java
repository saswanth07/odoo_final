package com.ps2.mapper;

import com.ps2.dto.PromotionDto;
import com.ps2.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

    public PromotionDto toDto(Promotion entity) {
        if (entity == null) {
            return null;
        }
        PromotionDto dto = new PromotionDto();
        dto.setPromotionId(entity.getPromotionId());
        dto.setType(entity.getType());
        dto.setMinQty(entity.getMinQty());
        dto.setMinAmount(entity.getMinAmount());
        dto.setDiscountType(entity.getDiscountType());
        dto.setDiscountValue(entity.getDiscountValue());
        return dto;
    }

    public Promotion toEntity(PromotionDto dto) {
        if (dto == null) {
            return null;
        }
        Promotion entity = new Promotion();
        entity.setPromotionId(dto.getPromotionId());
        entity.setType(dto.getType());
        entity.setMinQty(dto.getMinQty());
        entity.setMinAmount(dto.getMinAmount());
        entity.setDiscountType(dto.getDiscountType());
        entity.setDiscountValue(dto.getDiscountValue());
        return entity;
    }
}
