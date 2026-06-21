package com.ps2.controller;

import com.ps2.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/revenue")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        return ResponseEntity.ok(dashboardService.getTotalRevenue());
    }

    @GetMapping("/orders")
    public ResponseEntity<Long> getTotalOrders() {
        return ResponseEntity.ok(dashboardService.getTotalOrders());
    }

    @GetMapping("/average-order-value")
    public ResponseEntity<BigDecimal> getAverageOrderValue() {
        return ResponseEntity.ok(dashboardService.getAverageOrderValue());
    }

    @GetMapping("/sales-trend")
    public ResponseEntity<List<Map<String, Object>>> getSalesTrend() {
        return ResponseEntity.ok(dashboardService.getSalesTrend());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts() {
        return ResponseEntity.ok(dashboardService.getTopProducts());
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<Map<String, Object>>> getTopCategories() {
        return ResponseEntity.ok(dashboardService.getTopCategories());
    }

    @GetMapping("/employee-performance")
    public ResponseEntity<String> getEmployeePerformance() {
        // Placeholder for employee performance logic
        return ResponseEntity.ok("Employee performance data not yet implemented.");
    }

    @GetMapping("/employee-summary")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN')")
    public ResponseEntity<com.ps2.dto.PosSessionDto> getEmployeeSummary(java.security.Principal principal) {
        return ResponseEntity.ok(dashboardService.getEmployeeSummary(principal.getName()));
    }

    @GetMapping("/employee-orders")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN')")
    public ResponseEntity<Long> getEmployeeOrders(java.security.Principal principal) {
        return ResponseEntity.ok(dashboardService.getEmployeeOrdersCount(principal.getName()));
    }

    @GetMapping("/employee-revenue")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER', 'KITCHEN')")
    public ResponseEntity<BigDecimal> getEmployeeRevenue(java.security.Principal principal) {
        return ResponseEntity.ok(dashboardService.getEmployeeRevenue(principal.getName()));
    }

    @GetMapping("/customer-summary")
    public ResponseEntity<Map<String, Object>> getCustomerSummary(@RequestParam Long customerId) {
        return ResponseEntity.ok(dashboardService.getCustomerSummary(customerId));
    }

    @GetMapping("/customer-orders")
    public ResponseEntity<List<com.ps2.dto.OrderDto>> getCustomerOrders(@RequestParam Long customerId) {
        return ResponseEntity.ok(dashboardService.getCustomerOrders(customerId));
    }

    @GetMapping("/customer-favorites")
    public ResponseEntity<List<Map<String, Object>>> getCustomerFavorites(@RequestParam Long customerId) {
        return ResponseEntity.ok(dashboardService.getCustomerFavorites(customerId));
    }
}
