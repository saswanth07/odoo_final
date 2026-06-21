package com.ps2.repository;

import com.ps2.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCustomer_CustomerId(Long customerId);
    Optional<Feedback> findByOrder_OrderId(Long orderId);
}
