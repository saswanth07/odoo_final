package com.ps2.controller;

import com.ps2.service.QRService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
public class QRController {

    private final QRService qrService;

    public QRController(QRService qrService) {
        this.qrService = qrService;
    }

    @GetMapping(value = "/table/{tableId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateTableQR(@PathVariable Long tableId) {
        String selfOrderingUrl = "https://ps2-cafe.app/order?tableId=" + tableId;
        byte[] qrImage = qrService.generateQRCode(selfOrderingUrl, 250, 250);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);
    }

    @GetMapping(produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQR(@RequestParam String text) {
        byte[] qrImage = qrService.generateQRCode(text, 250, 250);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);
    }
}
