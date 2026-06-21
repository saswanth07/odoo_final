package com.ps2.service;

import com.ps2.dto.PromotionDto;
import java.util.List;

public interface PromotionService {
    PromotionDto createPromotion(PromotionDto promotionDto);
    PromotionDto updatePromotion(Long id, PromotionDto promotionDto);
    void deletePromotion(Long id);
    PromotionDto getPromotionById(Long id);
    List<PromotionDto> getAllPromotions();
}
