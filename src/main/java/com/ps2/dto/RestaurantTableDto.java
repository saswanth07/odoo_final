package com.ps2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RestaurantTableDto {

    private Long tableId;

    @NotNull(message = "Floor ID is required")
    private Long floorId;

    private String floorName;

    @NotBlank(message = "Table number is required")
    private String tableNumber;

    @NotNull(message = "Seats is required")
    private Integer seats;

    private Boolean activeStatus;

    public RestaurantTableDto() {}

    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }

    public Long getFloorId() { return floorId; }
    public void setFloorId(Long floorId) { this.floorId = floorId; }

    public String getFloorName() { return floorName; }
    public void setFloorName(String floorName) { this.floorName = floorName; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public Integer getSeats() { return seats; }
    public void setSeats(Integer seats) { this.seats = seats; }

    public Boolean getActiveStatus() { return activeStatus; }
    public void setActiveStatus(Boolean activeStatus) { this.activeStatus = activeStatus; }

    private Integer coordX;
    private Integer coordY;

    public Integer getCoordX() { return coordX; }
    public void setCoordX(Integer coordX) { this.coordX = coordX; }

    public Integer getCoordY() { return coordY; }
    public void setCoordY(Integer coordY) { this.coordY = coordY; }
}
