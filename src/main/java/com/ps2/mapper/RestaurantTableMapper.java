package com.ps2.mapper;

import com.ps2.dto.RestaurantTableDto;
import com.ps2.entity.Floor;
import com.ps2.entity.RestaurantTable;
import org.springframework.stereotype.Component;

@Component
public class RestaurantTableMapper {

    public RestaurantTableDto toDto(RestaurantTable entity) {
        if (entity == null) {
            return null;
        }
        RestaurantTableDto dto = new RestaurantTableDto();
        dto.setTableId(entity.getTableId());
        if (entity.getFloor() != null) {
            dto.setFloorId(entity.getFloor().getFloorId());
            dto.setFloorName(entity.getFloor().getFloorName());
        }
        dto.setTableNumber(entity.getTableNumber());
        dto.setSeats(entity.getSeats());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setCoordX(entity.getCoordX());
        dto.setCoordY(entity.getCoordY());
        return dto;
    }

    public RestaurantTable toEntity(RestaurantTableDto dto, Floor floor) {
        if (dto == null) {
            return null;
        }
        RestaurantTable entity = new RestaurantTable();
        entity.setTableId(dto.getTableId());
        entity.setFloor(floor);
        entity.setTableNumber(dto.getTableNumber());
        entity.setSeats(dto.getSeats());
        entity.setActiveStatus(dto.getActiveStatus());
        if (dto.getCoordX() != null) entity.setCoordX(dto.getCoordX());
        if (dto.getCoordY() != null) entity.setCoordY(dto.getCoordY());
        return entity;
    }
}
