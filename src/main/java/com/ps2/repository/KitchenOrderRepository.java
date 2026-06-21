package com.ps2.repository;

import com.ps2.entity.KitchenOrder;
import com.ps2.entity.KitchenStage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface KitchenOrderRepository extends JpaRepository<KitchenOrder, Long> {
    List<KitchenOrder> findByStage(KitchenStage stage);
    Optional<KitchenOrder> findByOrder_OrderId(Long orderId);
}
