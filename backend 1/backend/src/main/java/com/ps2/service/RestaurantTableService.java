package com.ps2.service;

import com.ps2.dto.RestaurantTableDto;
import java.util.List;

public interface RestaurantTableService {
    RestaurantTableDto createTable(RestaurantTableDto tableDto);
    RestaurantTableDto updateTable(Long id, RestaurantTableDto tableDto);
    void deleteTable(Long id);
    RestaurantTableDto getTableById(Long id);
    List<RestaurantTableDto> getAllTables();
    List<RestaurantTableDto> getTablesByFloor(Long floorId);
}
