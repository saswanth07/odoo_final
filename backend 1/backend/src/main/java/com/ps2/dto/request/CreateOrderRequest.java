package com.ps2.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateOrderRequest {

    private Long customerId;

    @NotNull(message = "Table ID is required")
    private Long tableId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private List<AddProductRequest> items;

    public CreateOrderRequest() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<AddProductRequest> getItems() { return items; }
    public void setItems(List<AddProductRequest> items) { this.items = items; }

    private String orderType;
    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
}
