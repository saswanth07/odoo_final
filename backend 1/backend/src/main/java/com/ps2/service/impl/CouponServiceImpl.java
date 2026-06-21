package com.ps2.service.impl;

import com.ps2.dto.CouponDto;
import com.ps2.entity.Coupon;
import com.ps2.exception.BusinessException;
import com.ps2.exception.DuplicateResourceException;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.CouponMapper;
import com.ps2.repository.CouponRepository;
import com.ps2.service.CouponService;
import org.springframework.stereotype.Service;

@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;

    public CouponServiceImpl(CouponRepository couponRepository, CouponMapper couponMapper) {
        this.couponRepository = couponRepository;
        this.couponMapper = couponMapper;
    }

    @Override
    public CouponDto createCoupon(CouponDto couponDto) {
        if (couponRepository.findByCode(couponDto.getCode()).isPresent()) {
            throw new DuplicateResourceException("Coupon with code " + couponDto.getCode() + " already exists");
        }
        if (couponDto.getActive() == null) {
            couponDto.setActive(true);
        }
        Coupon coupon = couponMapper.toEntity(couponDto);
        coupon = couponRepository.save(coupon);
        return couponMapper.toDto(coupon);
    }

    @Override
    public CouponDto validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

        if (!coupon.getActive()) {
            throw new BusinessException("Coupon is no longer active");
        }

        return couponMapper.toDto(coupon);
    }

    @Override
    public void deactivateCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        coupon.setActive(false);
        couponRepository.save(coupon);
    }
}
