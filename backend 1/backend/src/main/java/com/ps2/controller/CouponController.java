package com.ps2.controller;

import com.ps2.dto.CouponDto;
import com.ps2.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponDto> createCoupon(@Valid @RequestBody CouponDto couponDto) {
        CouponDto created = couponService.createCoupon(couponDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<CouponDto> validateCoupon(@PathVariable String code) {
        CouponDto coupon = couponService.validateCoupon(code);
        return ResponseEntity.ok(coupon);
    }

    @PatchMapping("/{id}/deactivate")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateCoupon(@PathVariable Long id) {
        couponService.deactivateCoupon(id);
        return ResponseEntity.ok().build();
    }
}
