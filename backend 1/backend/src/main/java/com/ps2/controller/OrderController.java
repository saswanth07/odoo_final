package com.ps2.controller;

import com.ps2.dto.OrderDto;
import com.ps2.dto.request.AddProductRequest;
import com.ps2.dto.request.CreateOrderRequest;
import com.ps2.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderDto created = orderService.createOrder(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    @PostMapping("/{orderId}/items")
    public ResponseEntity<OrderDto> addProductToOrder(@PathVariable Long orderId, @Valid @RequestBody AddProductRequest request) {
        OrderDto updatedOrder = orderService.addProductToOrder(orderId, request);
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{orderId}/items/{itemId}/quantity")
    public ResponseEntity<OrderDto> updateProductQuantity(@PathVariable Long orderId, @PathVariable Long itemId, @RequestParam Integer quantity) {
        OrderDto updatedOrder = orderService.updateProductQuantity(orderId, itemId, quantity);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<OrderDto> removeProductFromOrder(@PathVariable Long orderId, @PathVariable Long itemId) {
        OrderDto updatedOrder = orderService.removeProductFromOrder(orderId, itemId);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/{orderId}/coupon")
    public ResponseEntity<OrderDto> applyCoupon(@PathVariable Long orderId, @RequestParam String couponCode) {
        OrderDto updatedOrder = orderService.applyCoupon(orderId, couponCode);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/{orderId}/status")
    public ResponseEntity<java.util.Map<String, Object>> getOrderStatus(@PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(orderId);
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("orderId", order.getOrderId());
        response.put("status", order.getStatus());
        return ResponseEntity.ok(response);
    }
}
