package com.ps2.service.impl;

import com.ps2.dto.FeedbackDto;
import com.ps2.entity.Customer;
import com.ps2.entity.Feedback;
import com.ps2.entity.Order;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.exception.DuplicateResourceException;
import com.ps2.mapper.FeedbackMapper;
import com.ps2.repository.CustomerRepository;
import com.ps2.repository.FeedbackRepository;
import com.ps2.repository.OrderRepository;
import com.ps2.service.FeedbackService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final FeedbackMapper feedbackMapper;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, CustomerRepository customerRepository, OrderRepository orderRepository, FeedbackMapper feedbackMapper) {
        this.feedbackRepository = feedbackRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.feedbackMapper = feedbackMapper;
    }

    @Override
    public FeedbackDto createFeedback(FeedbackDto feedbackDto) {
        if (feedbackRepository.findByOrder_OrderId(feedbackDto.getOrderId()).isPresent()) {
            throw new DuplicateResourceException("Feedback already exists for this order");
        }

        Customer customer = customerRepository.findById(feedbackDto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
                
        Order order = orderRepository.findById(feedbackDto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Feedback feedback = feedbackMapper.toEntity(feedbackDto, customer, order);
        feedback = feedbackRepository.save(feedback);
        
        return feedbackMapper.toDto(feedback);
    }

    @Override
    public FeedbackDto getFeedbackByOrderId(Long orderId) {
        Feedback feedback = feedbackRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found for this order"));
        return feedbackMapper.toDto(feedback);
    }

    @Override
    public List<FeedbackDto> getFeedbackByCustomerId(Long customerId) {
        return feedbackRepository.findByCustomer_CustomerId(customerId).stream()
                .map(feedbackMapper::toDto)
                .collect(Collectors.toList());
    }
}
