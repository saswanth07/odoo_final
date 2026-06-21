package com.ps2.controller;

import com.ps2.dto.FeedbackDto;
import com.ps2.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackDto> createFeedback(@Valid @RequestBody FeedbackDto feedbackDto) {
        FeedbackDto created = feedbackService.createFeedback(feedbackDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<FeedbackDto> getFeedbackByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByOrderId(orderId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByCustomerId(customerId));
    }
}
