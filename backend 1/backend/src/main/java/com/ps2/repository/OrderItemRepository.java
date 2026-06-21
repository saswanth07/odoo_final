package com.ps2.repository;

import com.ps2.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder_OrderId(Long orderId);

    @Query("SELECT oi.product.name as name, SUM(oi.quantity) as qty FROM OrderItem oi JOIN oi.order o WHERE o.status = 'PAID' GROUP BY oi.product.name ORDER BY qty DESC")
    List<Object[]> findTopProducts();

    @Query("SELECT oi.product.category.name as name, SUM(oi.quantity) as qty FROM OrderItem oi JOIN oi.order o WHERE o.status = 'PAID' GROUP BY oi.product.category.name ORDER BY qty DESC")
    List<Object[]> findTopCategories();
}
