package com.ps2.controller;

import com.ps2.dto.RestaurantTableDto;
import com.ps2.service.RestaurantTableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class RestaurantTableController {

    private final RestaurantTableService tableService;

    public RestaurantTableController(RestaurantTableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<RestaurantTableDto> createTable(@Valid @RequestBody RestaurantTableDto tableDto) {
        RestaurantTableDto created = tableService.createTable(tableDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<RestaurantTableDto> updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTableDto tableDto) {
        RestaurantTableDto updated = tableService.updateTable(id, tableDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTableDto> getTableById(@PathVariable Long id) {
        RestaurantTableDto table = tableService.getTableById(id);
        return ResponseEntity.ok(table);
    }

    @GetMapping
    public ResponseEntity<List<RestaurantTableDto>> getAllTables() {
        List<RestaurantTableDto> tables = tableService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/floor/{floorId}")
    public ResponseEntity<List<RestaurantTableDto>> getTablesByFloor(@PathVariable Long floorId) {
        List<RestaurantTableDto> tables = tableService.getTablesByFloor(floorId);
        return ResponseEntity.ok(tables);
    }
}
