package com.ps2.service;

import com.ps2.dto.FeedbackDto;
import java.util.List;

public interface FeedbackService {
    FeedbackDto createFeedback(FeedbackDto feedbackDto);
    FeedbackDto getFeedbackByOrderId(Long orderId);
    List<FeedbackDto> getFeedbackByCustomerId(Long customerId);
}
