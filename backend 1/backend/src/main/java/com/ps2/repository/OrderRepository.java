package com.ps2.repository;

import com.ps2.entity.Order;
import com.ps2.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
    
    Long countByUser_UserIdAndCreatedAtBetween(Long userId, java.time.LocalDateTime start, java.time.LocalDateTime end);
    
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.user.userId = :userId AND o.createdAt BETWEEN :start AND :end")
    java.math.BigDecimal sumTotalAmountByUser_UserIdAndCreatedAtBetween(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start, @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);

    List<Order> findByCustomer_CustomerId(Long customerId);
    List<Order> findByTable_TableId(Long tableId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = com.ps2.entity.OrderStatus.PAID")
    java.math.BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = com.ps2.entity.OrderStatus.PAID")
    Long getTotalOrdersCount();

    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.status = com.ps2.entity.OrderStatus.PAID")
    java.math.BigDecimal getAverageOrderValue();

    @Query("SELECT FUNCTION('DATE', o.createdAt) as date, SUM(o.totalAmount) as total " +
           "FROM Order o WHERE o.status = com.ps2.entity.OrderStatus.PAID " +
           "GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY date DESC")
    java.util.List<Object[]> getSalesTrend();

}
