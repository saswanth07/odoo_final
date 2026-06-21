package com.ps2.service;

import com.ps2.dto.OrderDto;
import com.ps2.dto.request.AddProductRequest;
import com.ps2.dto.request.CreateOrderRequest;
import java.util.List;

public interface OrderService {
    OrderDto createOrder(CreateOrderRequest request);
    OrderDto getOrderById(Long id);
    List<OrderDto> getAllOrders();
    OrderDto addProductToOrder(Long orderId, AddProductRequest request);
    OrderDto updateProductQuantity(Long orderId, Long orderItemId, Integer quantity);
    OrderDto removeProductFromOrder(Long orderId, Long orderItemId);
    OrderDto applyCoupon(Long orderId, String couponCode);
    List<OrderDto> getOrdersByCustomerId(Long customerId);
}
