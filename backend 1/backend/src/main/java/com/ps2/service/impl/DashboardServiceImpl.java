package com.ps2.service.impl;

import com.ps2.repository.OrderItemRepository;
import com.ps2.repository.OrderRepository;
import com.ps2.service.DashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final com.ps2.repository.UserRepository userRepository;
    private final com.ps2.service.PosSessionService posSessionService;
    private final com.ps2.mapper.OrderMapper orderMapper;

    public DashboardServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository, com.ps2.repository.UserRepository userRepository, com.ps2.service.PosSessionService posSessionService, com.ps2.mapper.OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.posSessionService = posSessionService;
        this.orderMapper = orderMapper;
    }

    @Override
    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = orderRepository.getTotalRevenue();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    public Long getTotalOrders() {
        Long count = orderRepository.getTotalOrdersCount();
        return count != null ? count : 0L;
    }

    @Override
    public List<Map<String, Object>> getTopProducts() {
        List<Object[]> results = orderItemRepository.findTopProducts();
        return mapResults(results);
    }

    @Override
    public List<Map<String, Object>> getTopCategories() {
        return List.of();
    }

    private com.ps2.entity.User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new com.ps2.exception.ResourceNotFoundException("User not found"));
    }

    @Override
    public com.ps2.dto.PosSessionDto getEmployeeSummary(String email) {
        com.ps2.entity.User user = getUserByEmail(email);
        return posSessionService.getActiveSessionsByUser(user.getUserId()).stream().findFirst().orElse(null);
    }

    @Override
    public Long getEmployeeOrdersCount(String email) {
        com.ps2.entity.User user = getUserByEmail(email);
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        return orderRepository.countByUser_UserIdAndCreatedAtBetween(user.getUserId(), startOfDay, endOfDay);
    }

    @Override
    public java.math.BigDecimal getEmployeeRevenue(String email) {
        com.ps2.entity.User user = getUserByEmail(email);
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        java.math.BigDecimal revenue = orderRepository.sumTotalAmountByUser_UserIdAndCreatedAtBetween(user.getUserId(), startOfDay, endOfDay);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    public Map<String, Object> getCustomerSummary(Long customerId) {
        Map<String, Object> summary = new HashMap<>();
        List<com.ps2.entity.Order> orders = orderRepository.findByCustomer_CustomerId(customerId);
        summary.put("totalOrders", orders.size());
        
        BigDecimal totalSpent = orders.stream()
                .filter(o -> o.getStatus() == com.ps2.entity.OrderStatus.PAID)
                .map(com.ps2.entity.Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.put("totalAmountSpent", totalSpent);
        
        long activeOrders = orders.stream()
                .filter(o -> o.getStatus() != com.ps2.entity.OrderStatus.COMPLETED && o.getStatus() != com.ps2.entity.OrderStatus.PAID)
                .count();
        summary.put("currentOrders", activeOrders);
        
        return summary;
    }

    @Override
    public List<com.ps2.dto.OrderDto> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomer_CustomerId(customerId).stream()
                .map(orderMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getCustomerFavorites(Long customerId) {
        // Simplified mockup for favorites. In a real app this would be a complex group-by query
        return List.of();
    }

    @Override
    public BigDecimal getAverageOrderValue() {
        BigDecimal aov = orderRepository.getAverageOrderValue();
        return aov != null ? aov : BigDecimal.ZERO;
    }

    @Override
    public List<Map<String, Object>> getSalesTrend() {
        List<Object[]> results = orderRepository.getSalesTrend();
        List<Map<String, Object>> mapped = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", result[0]);
            map.put("total", result[1]);
            mapped.add(map);
        }
        return mapped;
    }

    private List<Map<String, Object>> mapResults(List<Object[]> results) {
        List<Map<String, Object>> mapped = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", result[0]);
            map.put("quantity", result[1]);
            mapped.add(map);
        }
        return mapped;
    }
}
