package com.ps2.service.impl;

import com.ps2.dto.PosSessionDto;
import com.ps2.entity.*;
import com.ps2.exception.BusinessException;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.PosSessionMapper;
import com.ps2.repository.OrderRepository;
import com.ps2.repository.PosSessionRepository;
import com.ps2.repository.UserRepository;
import com.ps2.service.PosSessionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PosSessionServiceImpl implements PosSessionService {

    private final PosSessionRepository posSessionRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PosSessionMapper posSessionMapper;

    public PosSessionServiceImpl(PosSessionRepository posSessionRepository, UserRepository userRepository, OrderRepository orderRepository, PosSessionMapper posSessionMapper) {
        this.posSessionRepository = posSessionRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.posSessionMapper = posSessionMapper;
    }

    @Override
    @Transactional
    public PosSessionDto openSession(PosSessionDto sessionDto) {
        User user = userRepository.findById(sessionDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<PosSession> activeSessions = posSessionRepository.findByUser_UserIdAndStatus(user.getUserId(), SessionStatus.OPEN);
        if (!activeSessions.isEmpty()) {
            throw new BusinessException("User already has an open session");
        }

        PosSession session = posSessionMapper.toEntity(sessionDto, user);
        session.setOpeningTime(LocalDateTime.now());
        session.setStatus(SessionStatus.OPEN);

        session = posSessionRepository.save(session);
        return posSessionMapper.toDto(session);
    }

    @Override
    @Transactional
    public PosSessionDto closeSession(Long sessionId) {
        PosSession session = posSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (session.getStatus() == SessionStatus.CLOSED) {
            throw new BusinessException("Session is already closed");
        }

        // Calculate revenue, order count, and tax amount for this session
        // Here we assume any order created by the user between openingTime and now is part of this session
        // In a real application, you might explicitly link Orders to a PosSession.
        final Long sessionUserId = session.getUser().getUserId();
        final LocalDateTime sessionOpeningTime = session.getOpeningTime();
        
        List<Order> sessionOrders = orderRepository.findAll().stream()
                .filter(o -> o.getUser().getUserId().equals(sessionUserId))
                .filter(o -> o.getCreatedAt().isAfter(sessionOpeningTime))
                .filter(o -> o.getStatus() == OrderStatus.PAID)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        int ordersCount = sessionOrders.size();

        for (Order order : sessionOrders) {
            totalRevenue = totalRevenue.add(order.getTotalAmount());
            totalTax = totalTax.add(order.getTaxAmount());
        }

        session.setClosingTime(LocalDateTime.now());
        session.setClosingAmount(session.getOpeningAmount().add(totalRevenue));
        session.setStatus(SessionStatus.CLOSED);

        session = posSessionRepository.save(session);

        PosSessionDto dto = posSessionMapper.toDto(session);
        dto.setRevenue(totalRevenue);
        dto.setOrdersCount(ordersCount);
        dto.setTaxAmount(totalTax);

        return dto;
    }

    @Override
    public List<PosSessionDto> getActiveSessionsByUser(Long userId) {
        return posSessionRepository.findByUser_UserIdAndStatus(userId, SessionStatus.OPEN).stream()
                .map(posSessionMapper::toDto)
                .collect(Collectors.toList());
    }
}
