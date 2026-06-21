package com.ps2.service;

import com.ps2.dto.CouponDto;

public interface CouponService {
    CouponDto createCoupon(CouponDto couponDto);
    CouponDto validateCoupon(String code);
    void deactivateCoupon(Long id);
}
