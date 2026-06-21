package com.ps2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_tables")
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id")
    private Floor floor;

    private String tableNumber;

    private Integer seats;

    private Boolean activeStatus;

    public RestaurantTable() {
    }

    public RestaurantTable(Long tableId, Floor floor, String tableNumber, Integer seats, Boolean activeStatus) {
        this.tableId = tableId;
        this.floor = floor;
        this.tableNumber = tableNumber;
        this.seats = seats;
        this.activeStatus = activeStatus;
    }

    @PrePersist
    protected void onCreate() {
        if (this.activeStatus == null) {
            this.activeStatus = true;
        }
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public Boolean getActiveStatus() {
        return activeStatus;
    }

    public void setActiveStatus(Boolean activeStatus) {
        this.activeStatus = activeStatus;
    }

    private Integer coordX = 50;
    private Integer coordY = 50;

    public Integer getCoordX() {
        return coordX;
    }

    public void setCoordX(Integer coordX) {
        this.coordX = coordX;
    }

    public Integer getCoordY() {
        return coordY;
    }

    public void setCoordY(Integer coordY) {
        this.coordY = coordY;
    }
}
