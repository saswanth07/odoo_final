package com.ps2.mapper;

import com.ps2.dto.CategoryDto;
import com.ps2.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category entity) {
        if (entity == null) {
            return null;
        }
        CategoryDto dto = new CategoryDto(entity.getCategoryId(), entity.getName(), entity.getColor());
        dto.setImage(entity.getImage());
        return dto;
    }

    public Category toEntity(CategoryDto dto) {
        if (dto == null) {
            return null;
        }
        Category entity = new Category();
        entity.setCategoryId(dto.getCategoryId());
        entity.setName(dto.getName());
        entity.setColor(dto.getColor());
        entity.setImage(dto.getImage());
        return entity;
    }
}
