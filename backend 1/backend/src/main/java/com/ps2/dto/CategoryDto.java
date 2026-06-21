package com.ps2.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {

    private Long categoryId;

    @NotBlank(message = "Category name is required")
    private String name;

    private String color;

    public CategoryDto() {}

    public CategoryDto(Long categoryId, String name, String color) {
        this.categoryId = categoryId;
        this.name = name;
        this.color = color;
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    private String image;
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
