package com.ps2.service.impl;

import com.ps2.dto.PromotionDto;
import com.ps2.entity.Promotion;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.PromotionMapper;
import com.ps2.repository.PromotionRepository;
import com.ps2.service.PromotionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    public PromotionServiceImpl(PromotionRepository promotionRepository, PromotionMapper promotionMapper) {
        this.promotionRepository = promotionRepository;
        this.promotionMapper = promotionMapper;
    }

    @Override
    public PromotionDto createPromotion(PromotionDto promotionDto) {
        Promotion promotion = promotionMapper.toEntity(promotionDto);
        promotion = promotionRepository.save(promotion);
        return promotionMapper.toDto(promotion);
    }

    @Override
    public PromotionDto updatePromotion(Long id, PromotionDto promotionDto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));

        promotion.setType(promotionDto.getType());
        promotion.setMinQty(promotionDto.getMinQty());
        promotion.setMinAmount(promotionDto.getMinAmount());
        promotion.setDiscountType(promotionDto.getDiscountType());
        promotion.setDiscountValue(promotionDto.getDiscountValue());

        promotion = promotionRepository.save(promotion);
        return promotionMapper.toDto(promotion);
    }

    @Override
    public void deletePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));
        promotionRepository.delete(promotion);
    }

    @Override
    public PromotionDto getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));
        return promotionMapper.toDto(promotion);
    }

    @Override
    public List<PromotionDto> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toDto)
                .collect(Collectors.toList());
    }
}
