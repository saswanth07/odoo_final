package com.ps2.dto;

import com.ps2.entity.KitchenStage;
import java.util.List;

public class KitchenOrderDto {

    private Long kitchenOrderId;
    private Long orderId;
    private String orderNumber;
    private KitchenStage stage;
    private List<KitchenItemDto> items;
    private String tableNumber;
    private String createdAt;

    public KitchenOrderDto() {}

    public Long getKitchenOrderId() { return kitchenOrderId; }
    public void setKitchenOrderId(Long kitchenOrderId) { this.kitchenOrderId = kitchenOrderId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public KitchenStage getStage() { return stage; }
    public void setStage(KitchenStage stage) { this.stage = stage; }

    public List<KitchenItemDto> getItems() { return items; }
    public void setItems(List<KitchenItemDto> items) { this.items = items; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
