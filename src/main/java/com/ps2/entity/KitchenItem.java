package com.ps2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "kitchen_items")
public class KitchenItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kitchenItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kitchen_order_id")
    private KitchenOrder kitchenOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Boolean completed;

    private Integer quantity;

    public KitchenItem() {
    }

    public KitchenItem(Long kitchenItemId, KitchenOrder kitchenOrder, Product product, Boolean completed, Integer quantity) {
        this.kitchenItemId = kitchenItemId;
        this.kitchenOrder = kitchenOrder;
        this.product = product;
        this.completed = completed;
        this.quantity = quantity;
    }

    public Long getKitchenItemId() {
        return kitchenItemId;
    }

    public void setKitchenItemId(Long kitchenItemId) {
        this.kitchenItemId = kitchenItemId;
    }

    public KitchenOrder getKitchenOrder() {
        return kitchenOrder;
    }

    public void setKitchenOrder(KitchenOrder kitchenOrder) {
        this.kitchenOrder = kitchenOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
