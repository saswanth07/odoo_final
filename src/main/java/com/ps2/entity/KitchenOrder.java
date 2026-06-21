package com.ps2.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "kitchen_orders")
public class KitchenOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kitchenOrderId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    private KitchenStage stage;

    @OneToMany(mappedBy = "kitchenOrder", cascade = CascadeType.ALL)
    private List<KitchenItem> kitchenItems;

    public KitchenOrder() {
    }

    public KitchenOrder(Long kitchenOrderId, Order order, KitchenStage stage, List<KitchenItem> kitchenItems) {
        this.kitchenOrderId = kitchenOrderId;
        this.order = order;
        this.stage = stage;
        this.kitchenItems = kitchenItems;
    }

    public Long getKitchenOrderId() {
        return kitchenOrderId;
    }

    public void setKitchenOrderId(Long kitchenOrderId) {
        this.kitchenOrderId = kitchenOrderId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public KitchenStage getStage() {
        return stage;
    }

    public void setStage(KitchenStage stage) {
        this.stage = stage;
    }

    public List<KitchenItem> getKitchenItems() {
        return kitchenItems;
    }

    public void setKitchenItems(List<KitchenItem> kitchenItems) {
        this.kitchenItems = kitchenItems;
    }
}
