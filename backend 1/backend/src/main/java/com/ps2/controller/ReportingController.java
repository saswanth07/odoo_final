package com.ps2.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class ReportingController {

    private final com.ps2.service.ExportService exportService;

    public ReportingController(com.ps2.service.ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/daily-sales")
    public ResponseEntity<?> getDailySales(@org.springframework.web.bind.annotation.RequestParam(required = false) String format) {
        return generateReportResponse("Daily Sales", "{ 'sales': 1500, 'orders': 45 }", format);
    }

    @GetMapping("/weekly-sales")
    public ResponseEntity<?> getWeeklySales(@org.springframework.web.bind.annotation.RequestParam(required = false) String format) {
        return generateReportResponse("Weekly Sales", "{ 'sales': 10500, 'orders': 315 }", format);
    }

    @GetMapping("/monthly-sales")
    public ResponseEntity<?> getMonthlySales(@org.springframework.web.bind.annotation.RequestParam(required = false) String format) {
        return generateReportResponse("Monthly Sales", "{ 'sales': 45000, 'orders': 1350 }", format);
    }

    @GetMapping("/product-sales")
    public ResponseEntity<?> getProductSales(@org.springframework.web.bind.annotation.RequestParam(required = false) String format) {
        return generateReportResponse("Product Sales", "{ 'topProduct': 'Latte', 'count': 400 }", format);
    }

    @GetMapping("/category-sales")
    public ResponseEntity<?> getCategorySales(@org.springframework.web.bind.annotation.RequestParam(required = false) String format) {
        return generateReportResponse("Category Sales", "{ 'topCategory': 'Beverages', 'sales': 25000 }", format);
    }

    private ResponseEntity<?> generateReportResponse(String reportName, String data, String format) {
        if ("pdf".equalsIgnoreCase(format)) {
            byte[] pdfBytes = exportService.exportToPdf(reportName, data);
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", reportName.replace(" ", "_") + ".pdf");
            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } else if ("xls".equalsIgnoreCase(format) || "xlsx".equalsIgnoreCase(format)) {
            byte[] excelBytes = exportService.exportToExcel(reportName, data);
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", reportName.replace(" ", "_") + ".xlsx");
            return new ResponseEntity<>(excelBytes, headers, org.springframework.http.HttpStatus.OK);
        } else {
            Map<String, String> report = new HashMap<>();
            report.put("reportName", reportName);
            report.put("data", data);
            report.put("status", "Generated");
            return ResponseEntity.ok(report);
        }
    }
}
