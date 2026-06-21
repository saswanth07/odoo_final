package com.ps2.service;

import com.ps2.dto.KitchenOrderDto;
import com.ps2.entity.KitchenStage;
import java.util.List;

public interface KitchenService {
    KitchenOrderDto sendOrderToKitchen(Long orderId);
    KitchenOrderDto updateKitchenStage(Long kitchenOrderId, KitchenStage stage);
    KitchenOrderDto markItemCompleted(Long kitchenItemId);
    List<KitchenOrderDto> getActiveKitchenOrders();
}
