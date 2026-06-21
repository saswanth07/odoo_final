package com.ps2.service.impl;

import com.ps2.dto.FloorDto;
import com.ps2.entity.Floor;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.FloorMapper;
import com.ps2.repository.FloorRepository;
import com.ps2.service.FloorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FloorServiceImpl implements FloorService {

    private final FloorRepository floorRepository;
    private final FloorMapper floorMapper;

    public FloorServiceImpl(FloorRepository floorRepository, FloorMapper floorMapper) {
        this.floorRepository = floorRepository;
        this.floorMapper = floorMapper;
    }

    @Override
    public FloorDto createFloor(FloorDto floorDto) {
        Floor floor = floorMapper.toEntity(floorDto);
        floor = floorRepository.save(floor);
        return floorMapper.toDto(floor);
    }

    @Override
    public FloorDto updateFloor(Long id, FloorDto floorDto) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        floor.setFloorName(floorDto.getFloorName());

        floor = floorRepository.save(floor);
        return floorMapper.toDto(floor);
    }

    @Override
    public void deleteFloor(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        floorRepository.delete(floor);
    }

    @Override
    public FloorDto getFloorById(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        return floorMapper.toDto(floor);
    }

    @Override
    public List<FloorDto> getAllFloors() {
        return floorRepository.findAll().stream()
                .map(floorMapper::toDto)
                .collect(Collectors.toList());
    }
}
