package com.ps2.mapper;

import com.ps2.dto.FloorDto;
import com.ps2.entity.Floor;
import org.springframework.stereotype.Component;

@Component
public class FloorMapper {

    public FloorDto toDto(Floor entity) {
        if (entity == null) {
            return null;
        }
        return new FloorDto(entity.getFloorId(), entity.getFloorName());
    }

    public Floor toEntity(FloorDto dto) {
        if (dto == null) {
            return null;
        }
        Floor entity = new Floor();
        entity.setFloorId(dto.getFloorId());
        entity.setFloorName(dto.getFloorName());
        return entity;
    }
}
