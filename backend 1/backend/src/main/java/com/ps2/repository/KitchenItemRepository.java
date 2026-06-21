package com.ps2.repository;

import com.ps2.entity.KitchenItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KitchenItemRepository extends JpaRepository<KitchenItem, Long> {
    List<KitchenItem> findByKitchenOrder_KitchenOrderId(Long kitchenOrderId);
}
