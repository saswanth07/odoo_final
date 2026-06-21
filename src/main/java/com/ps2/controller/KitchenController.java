package com.ps2.controller;

import com.ps2.dto.KitchenOrderDto;
import com.ps2.entity.KitchenStage;
import com.ps2.service.KitchenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {

    private final KitchenService kitchenService;

    public KitchenController(KitchenService kitchenService) {
        this.kitchenService = kitchenService;
    }

    @PostMapping("/send/{orderId}")
    public ResponseEntity<KitchenOrderDto> sendOrderToKitchen(@PathVariable Long orderId) {
        KitchenOrderDto kitchenOrder = kitchenService.sendOrderToKitchen(orderId);
        return ResponseEntity.ok(kitchenOrder);
    }

    @PutMapping("/stage/{kitchenOrderId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN')")
    public ResponseEntity<KitchenOrderDto> updateKitchenStage(@PathVariable Long kitchenOrderId, @RequestParam KitchenStage stage) {
        KitchenOrderDto updated = kitchenService.updateKitchenStage(kitchenOrderId, stage);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/item/{kitchenItemId}/complete")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN')")
    public ResponseEntity<KitchenOrderDto> markItemCompleted(@PathVariable Long kitchenItemId) {
        KitchenOrderDto updated = kitchenService.markItemCompleted(kitchenItemId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/active")
    public ResponseEntity<List<KitchenOrderDto>> getActiveKitchenOrders() {
        return ResponseEntity.ok(kitchenService.getActiveKitchenOrders());
    }
}
