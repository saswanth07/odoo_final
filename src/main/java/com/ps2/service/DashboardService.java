package com.ps2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface DashboardService {
    BigDecimal getTotalRevenue();
    Long getTotalOrders();
    List<Map<String, Object>> getTopProducts();
    List<Map<String, Object>> getTopCategories();
    com.ps2.dto.PosSessionDto getEmployeeSummary(String email);
    Long getEmployeeOrdersCount(String email);
    BigDecimal getEmployeeRevenue(String email);
    Map<String, Object> getCustomerSummary(Long customerId);
    List<com.ps2.dto.OrderDto> getCustomerOrders(Long customerId);
    List<Map<String, Object>> getCustomerFavorites(Long customerId);
    BigDecimal getAverageOrderValue();
    List<Map<String, Object>> getSalesTrend();
}
