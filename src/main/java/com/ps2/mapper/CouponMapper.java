package com.ps2.mapper;

import com.ps2.dto.CouponDto;
import com.ps2.entity.Coupon;
import org.springframework.stereotype.Component;

@Component
public class CouponMapper {

    public CouponDto toDto(Coupon entity) {
        if (entity == null) {
            return null;
        }
        CouponDto dto = new CouponDto();
        dto.setCouponId(entity.getCouponId());
        dto.setCode(entity.getCode());
        dto.setDiscountType(entity.getDiscountType());
        dto.setDiscountValue(entity.getDiscountValue());
        dto.setActive(entity.getActive());
        return dto;
    }

    public Coupon toEntity(CouponDto dto) {
        if (dto == null) {
            return null;
        }
        Coupon entity = new Coupon();
        entity.setCouponId(dto.getCouponId());
        entity.setCode(dto.getCode());
        entity.setDiscountType(dto.getDiscountType());
        entity.setDiscountValue(dto.getDiscountValue());
        entity.setActive(dto.getActive());
        return entity;
    }
}
