package com.ps2.dto;

import com.ps2.entity.SessionStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PosSessionDto {

    private Long sessionId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    private LocalDateTime openingTime;
    private LocalDateTime closingTime;

    @NotNull(message = "Opening amount is required")
    private BigDecimal openingAmount;

    private BigDecimal closingAmount;

    private SessionStatus status;

    // Calculated fields
    private BigDecimal revenue;
    private Integer ordersCount;
    private BigDecimal taxAmount;

    public PosSessionDto() {}

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(LocalDateTime openingTime) { this.openingTime = openingTime; }

    public LocalDateTime getClosingTime() { return closingTime; }
    public void setClosingTime(LocalDateTime closingTime) { this.closingTime = closingTime; }

    public BigDecimal getOpeningAmount() { return openingAmount; }
    public void setOpeningAmount(BigDecimal openingAmount) { this.openingAmount = openingAmount; }

    public BigDecimal getClosingAmount() { return closingAmount; }
    public void setClosingAmount(BigDecimal closingAmount) { this.closingAmount = closingAmount; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public Integer getOrdersCount() { return ordersCount; }
    public void setOrdersCount(Integer ordersCount) { this.ordersCount = ordersCount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
}
