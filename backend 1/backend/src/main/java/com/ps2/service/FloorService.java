package com.ps2.service;

import com.ps2.dto.FloorDto;
import java.util.List;

public interface FloorService {
    FloorDto createFloor(FloorDto floorDto);
    FloorDto updateFloor(Long id, FloorDto floorDto);
    void deleteFloor(Long id);
    FloorDto getFloorById(Long id);
    List<FloorDto> getAllFloors();
}
