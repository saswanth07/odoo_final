package com.ps2.service.impl;

import com.ps2.dto.RestaurantTableDto;
import com.ps2.entity.Floor;
import com.ps2.entity.RestaurantTable;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.RestaurantTableMapper;
import com.ps2.repository.FloorRepository;
import com.ps2.repository.RestaurantTableRepository;
import com.ps2.service.RestaurantTableService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantTableServiceImpl implements RestaurantTableService {

    private final RestaurantTableRepository tableRepository;
    private final FloorRepository floorRepository;
    private final RestaurantTableMapper tableMapper;

    public RestaurantTableServiceImpl(RestaurantTableRepository tableRepository, FloorRepository floorRepository, RestaurantTableMapper tableMapper) {
        this.tableRepository = tableRepository;
        this.floorRepository = floorRepository;
        this.tableMapper = tableMapper;
    }

    @Override
    public RestaurantTableDto createTable(RestaurantTableDto tableDto) {
        Floor floor = floorRepository.findById(tableDto.getFloorId())
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        RestaurantTable table = tableMapper.toEntity(tableDto, floor);
        table = tableRepository.save(table);
        return tableMapper.toDto(table);
    }

    @Override
    public RestaurantTableDto updateTable(Long id, RestaurantTableDto tableDto) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        Floor floor = floorRepository.findById(tableDto.getFloorId())
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        table.setFloor(floor);
        table.setTableNumber(tableDto.getTableNumber());
        table.setSeats(tableDto.getSeats());
        if (tableDto.getActiveStatus() != null) {
            table.setActiveStatus(tableDto.getActiveStatus());
        }
        if (tableDto.getCoordX() != null) {
            table.setCoordX(tableDto.getCoordX());
        }
        if (tableDto.getCoordY() != null) {
            table.setCoordY(tableDto.getCoordY());
        }

        table = tableRepository.save(table);
        return tableMapper.toDto(table);
    }

    @Override
    public void deleteTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        tableRepository.delete(table);
    }

    @Override
    public RestaurantTableDto getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        return tableMapper.toDto(table);
    }

    @Override
    public List<RestaurantTableDto> getAllTables() {
        return tableRepository.findAll().stream()
                .map(tableMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantTableDto> getTablesByFloor(Long floorId) {
        return tableRepository.findByFloor_FloorId(floorId).stream()
                .map(tableMapper::toDto)
                .collect(Collectors.toList());
    }
}
