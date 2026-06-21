package com.ps2.service.impl;

import com.ps2.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordEmail(String email, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("PS2 Cafe Employee Account");
        message.setText(
                "Welcome to PS2 Cafe\n\n" +
                "Your employee account has been created.\n\n" +
                "Email: " + email + "\n" +
                "Password: " + password + "\n\n" +
                "Please change your password after login."
        );
        mailSender.send(message);
    }

    @Override
    public void sendEmailWithAttachment(String to, String subject, String body, MultipartFile file) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            if (file != null && !file.isEmpty()) {
                helper.addAttachment(
                        file.getOriginalFilename() != null ? file.getOriginalFilename() : "receipt.pdf",
                        file
                );
            }
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email with attachment", e);
        }
    }
}
