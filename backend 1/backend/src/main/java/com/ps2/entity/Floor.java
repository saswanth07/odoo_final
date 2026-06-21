package com.ps2.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "floors")
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long floorId;

    private String floorName;

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL)
    private List<RestaurantTable> tables;

    public Floor() {
    }

    public Floor(Long floorId, String floorName) {
        this.floorId = floorId;
        this.floorName = floorName;
    }

    public Long getFloorId() {
        return floorId;
    }

    public void setFloorId(Long floorId) {
        this.floorId = floorId;
    }

    public String getFloorName() {
        return floorName;
    }

    public void setFloorName(String floorName) {
        this.floorName = floorName;
    }

    public List<RestaurantTable> getTables() {
        return tables;
    }

    public void setTables(List<RestaurantTable> tables) {
        this.tables = tables;
    }
}
