package com.ps2.repository;

import com.ps2.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByFloor_FloorId(Long floorId);
}
