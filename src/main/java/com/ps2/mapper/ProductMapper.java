package com.ps2.mapper;

import com.ps2.dto.ProductDto;
import com.ps2.entity.Category;
import com.ps2.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDto toDto(Product entity) {
        if (entity == null) {
            return null;
        }
        ProductDto dto = new ProductDto();
        dto.setProductId(entity.getProductId());
        if (entity.getCategory() != null) {
            dto.setCategoryId(entity.getCategory().getCategoryId());
            dto.setCategoryName(entity.getCategory().getName());
        }
        dto.setName(entity.getName());
        dto.setPrice(entity.getPrice());
        dto.setUnitMeasure(entity.getUnitMeasure());
        dto.setTax(entity.getTax());
        dto.setDescription(entity.getDescription());
        dto.setImage(entity.getImage());
        dto.setStock(entity.getStock());
        dto.setActive(entity.getActive());
        return dto;
    }

    public Product toEntity(ProductDto dto, Category category) {
        if (dto == null) {
            return null;
        }
        Product entity = new Product();
        entity.setProductId(dto.getProductId());
        entity.setCategory(category);
        entity.setName(dto.getName());
        entity.setPrice(dto.getPrice());
        entity.setUnitMeasure(dto.getUnitMeasure());
        entity.setTax(dto.getTax());
        entity.setDescription(dto.getDescription());
        entity.setImage(dto.getImage());
        entity.setStock(dto.getStock());
        entity.setActive(dto.getActive());
        return entity;
    }
}
