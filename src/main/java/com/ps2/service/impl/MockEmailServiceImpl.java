package com.ps2.service.impl;

import com.ps2.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

// @Service
public class MockEmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(MockEmailServiceImpl.class);

    @Override
    public void sendPasswordEmail(String toEmail, String generatedPassword) {
        logger.info("==================================================");
        logger.info("MOCK EMAIL SENT TO: {}", toEmail);
        logger.info("SUBJECT: Your new Cafe POS Account Password");
        logger.info("BODY:");
        logger.info("Hello,");
        logger.info("An admin has created an account for you.");
        logger.info("Your temporary password is: {}", generatedPassword);
        logger.info("Please log in and change your password as soon as possible.");
        logger.info("==================================================");
    }

    @Override
    public void sendEmailWithAttachment(String to, String subject, String body, MultipartFile file) {
        logger.info("==================================================");
        logger.info("MOCK EMAIL WITH ATTACHMENT SENT TO: {}", to);
        logger.info("SUBJECT: {}", subject);
        logger.info("BODY: {}", body);
        logger.info("ATTACHMENT: {}", file != null ? file.getOriginalFilename() : "none");
        logger.info("==================================================");
    }
}
