package com.ps2.service;

public interface EmailService {
    void sendPasswordEmail(String email, String password);
    void sendEmailWithAttachment(String to, String subject, String body, org.springframework.web.multipart.MultipartFile file);
}