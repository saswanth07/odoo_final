package com.ps2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long methodId;

    private String methodName; // e.g., "CASH", "CARD", "UPI"

    private Boolean enabled;

    private String upiId;

    public PaymentMethod() {
    }

    public PaymentMethod(Long methodId, String methodName, Boolean enabled, String upiId) {
        this.methodId = methodId;
        this.methodName = methodName;
        this.enabled = enabled;
        this.upiId = upiId;
    }

    @PrePersist
    protected void onCreate() {
        if (this.enabled == null) {
            this.enabled = true;
        }
    }

    public Long getMethodId() {
        return methodId;
    }

    public void setMethodId(Long methodId) {
        this.methodId = methodId;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }
}
