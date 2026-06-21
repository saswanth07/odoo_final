package com.ps2.controller;

import com.ps2.dto.FloorDto;
import com.ps2.service.FloorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/floors")
@org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
public class FloorController {

    private final FloorService floorService;

    public FloorController(FloorService floorService) {
        this.floorService = floorService;
    }

    @PostMapping
    public ResponseEntity<FloorDto> createFloor(@Valid @RequestBody FloorDto floorDto) {
        FloorDto created = floorService.createFloor(floorDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FloorDto> updateFloor(@PathVariable Long id, @Valid @RequestBody FloorDto floorDto) {
        FloorDto updated = floorService.updateFloor(id, floorDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFloor(@PathVariable Long id) {
        floorService.deleteFloor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FloorDto> getFloorById(@PathVariable Long id) {
        FloorDto floor = floorService.getFloorById(id);
        return ResponseEntity.ok(floor);
    }

    @GetMapping
    public ResponseEntity<List<FloorDto>> getAllFloors() {
        List<FloorDto> floors = floorService.getAllFloors();
        return ResponseEntity.ok(floors);
    }
}
