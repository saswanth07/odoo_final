package com.ps2.controller;

import com.ps2.dto.OrderDto;
import com.ps2.service.OrderService;
import com.ps2.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class ReceiptController {

    private final OrderService orderService;
    private final EmailService emailService;

    public ReceiptController(OrderService orderService, EmailService emailService) {
        this.orderService = orderService;
        this.emailService = emailService;
    }

    @GetMapping("/{id}/receipt")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<Map<String, Object>> generateReceipt(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("receiptId", "REC-" + order.getOrderId());
        receipt.put("orderId", order.getOrderId());
        receipt.put("date", LocalDateTime.now());
        receipt.put("customer", order.getCustomerId() != null ? "Customer ID: " + order.getCustomerId() : "Guest");
        receipt.put("status", order.getStatus());

        List<Map<String, Object>> items = order.getItems().stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("productName", item.getProductName());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("unitPrice", item.getUnitPrice());
            itemMap.put("total", item.getTotal());
            return itemMap;
        }).collect(Collectors.toList());

        receipt.put("items", items);
        receipt.put("totalAmount", order.getTotalAmount());

        return ResponseEntity.ok(receipt);
    }

    @PostMapping(value = "/{id}/send-receipt", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<?> sendReceipt(
            @PathVariable Long id,
            @RequestParam("email") String email,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        OrderDto order = orderService.getOrderById(id);
        
        String subject = "Receipt for Order " + (order.getOrderNumber() != null ? order.getOrderNumber() : "#" + order.getOrderId());
        String body = "Dear Customer,\n\nThank you for dining with us at PS2 Cafe!\n\nPlease find your receipt attached to this email.\n\nTotal Amount Paid: INR " + order.getTotalAmount() + "\n\nBest Regards,\nPS2 Cafe Team";
        
        emailService.sendEmailWithAttachment(email, subject, body, file);

        return ResponseEntity.ok("Receipt successfully sent to " + email);
    }
}
