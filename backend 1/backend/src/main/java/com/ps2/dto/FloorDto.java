package com.ps2.dto;

import jakarta.validation.constraints.NotBlank;

public class FloorDto {

    private Long floorId;

    @NotBlank(message = "Floor name is required")
    private String floorName;

    public FloorDto() {}

    public FloorDto(Long floorId, String floorName) {
        this.floorId = floorId;
        this.floorName = floorName;
    }

    public Long getFloorId() { return floorId; }
    public void setFloorId(Long floorId) { this.floorId = floorId; }

    public String getFloorName() { return floorName; }
    public void setFloorName(String floorName) { this.floorName = floorName; }
}
