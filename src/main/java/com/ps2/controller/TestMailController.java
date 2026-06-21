package com.ps2.controller;

import com.ps2.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestMailController {

    private final EmailService emailService;

    public TestMailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/test-mail")
    public String testMail() {

        emailService.sendPasswordEmail(
                "saswanth545@gmail.com",
                "TEST1234"
        );

        return "Mail Sent";
    }
}