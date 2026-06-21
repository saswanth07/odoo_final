package com.ps2.dto;

public class KitchenItemDto {

    private Long kitchenItemId;
    private Long productId;
    private String productName;
    private Boolean completed;
    private Integer quantity;

    public KitchenItemDto() {}

    public Long getKitchenItemId() { return kitchenItemId; }
    public void setKitchenItemId(Long kitchenItemId) { this.kitchenItemId = kitchenItemId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
