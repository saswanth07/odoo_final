package com.ps2.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class OrderNumberGenerator {
    private final AtomicInteger counter = new AtomicInteger(1);
    private String currentDate = "";

    public synchronized String generateOrderNumber() {
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String timeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
        if (!today.equals(currentDate)) {
            currentDate = today;
            counter.set(1);
        }
        return String.format("ORD-%s-%s-%04d", currentDate, timeStr, counter.getAndIncrement());
    }
}
