package com.ps2.repository;

import com.ps2.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrder_OrderId(Long orderId);
    List<Payment> findByOrder_Customer_CustomerId(Long customerId);
}
