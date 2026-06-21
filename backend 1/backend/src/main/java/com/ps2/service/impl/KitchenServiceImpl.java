package com.ps2.service.impl;

import com.ps2.dto.KitchenOrderDto;
import com.ps2.entity.*;
import com.ps2.exception.BusinessException;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.KitchenMapper;
import com.ps2.repository.KitchenItemRepository;
import com.ps2.repository.KitchenOrderRepository;
import com.ps2.repository.OrderRepository;
import com.ps2.service.KitchenService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KitchenServiceImpl implements KitchenService {

    private final KitchenOrderRepository kitchenOrderRepository;
    private final KitchenItemRepository kitchenItemRepository;
    private final OrderRepository orderRepository;
    private final KitchenMapper kitchenMapper;

    public KitchenServiceImpl(KitchenOrderRepository kitchenOrderRepository, KitchenItemRepository kitchenItemRepository, OrderRepository orderRepository, KitchenMapper kitchenMapper) {
        this.kitchenOrderRepository = kitchenOrderRepository;
        this.kitchenItemRepository = kitchenItemRepository;
        this.orderRepository = orderRepository;
        this.kitchenMapper = kitchenMapper;
    }

    @Override
    @Transactional
    public KitchenOrderDto sendOrderToKitchen(Long orderId) {
        if (kitchenOrderRepository.findByOrder_OrderId(orderId).isPresent()) {
            throw new BusinessException("Order already sent to kitchen");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new BusinessException("Cannot send empty order to kitchen");
        }

        KitchenOrder kitchenOrder = new KitchenOrder();
        kitchenOrder.setOrder(order);
        kitchenOrder.setStage(KitchenStage.TO_COOK);
        kitchenOrder.setKitchenItems(new ArrayList<>());
        
        kitchenOrder = kitchenOrderRepository.save(kitchenOrder);

        for (OrderItem orderItem : order.getOrderItems()) {
            KitchenItem kitchenItem = new KitchenItem();
            kitchenItem.setKitchenOrder(kitchenOrder);
            kitchenItem.setProduct(orderItem.getProduct());
            kitchenItem.setCompleted(false);
            kitchenItem.setQuantity(orderItem.getQuantity());
            kitchenOrder.getKitchenItems().add(kitchenItem);
            kitchenItemRepository.save(kitchenItem);
        }

        order.setStatus(OrderStatus.SENT_TO_KITCHEN);
        orderRepository.save(order);

        return kitchenMapper.toDto(kitchenOrder);
    }

    @Override
    @Transactional
    public KitchenOrderDto updateKitchenStage(Long kitchenOrderId, KitchenStage stage) {
        KitchenOrder kitchenOrder = kitchenOrderRepository.findById(kitchenOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Kitchen order not found"));

        kitchenOrder.setStage(stage);
        
        if (stage == KitchenStage.PREPARING) {
            kitchenOrder.getOrder().setStatus(OrderStatus.PREPARING);
        } else if (stage == KitchenStage.COMPLETED) {
            kitchenOrder.getOrder().setStatus(OrderStatus.COMPLETED);
            kitchenOrder.getKitchenItems().forEach(item -> item.setCompleted(true));
        } else if (stage == KitchenStage.SERVED) {
            kitchenOrder.getOrder().setStatus(OrderStatus.COMPLETED);
        }

        kitchenOrder = kitchenOrderRepository.save(kitchenOrder);
        orderRepository.save(kitchenOrder.getOrder());
        
        return kitchenMapper.toDto(kitchenOrder);
    }

    @Override
    @Transactional
    public KitchenOrderDto markItemCompleted(Long kitchenItemId) {
        KitchenItem kitchenItem = kitchenItemRepository.findById(kitchenItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Kitchen item not found"));
        
        kitchenItem.setCompleted(true);
        kitchenItemRepository.save(kitchenItem);

        KitchenOrder kitchenOrder = kitchenItem.getKitchenOrder();
        boolean allCompleted = kitchenOrder.getKitchenItems().stream().allMatch(KitchenItem::getCompleted);
        if (allCompleted) {
            kitchenOrder.setStage(KitchenStage.COMPLETED);
            kitchenOrder.getOrder().setStatus(OrderStatus.COMPLETED);
            kitchenOrderRepository.save(kitchenOrder);
            orderRepository.save(kitchenOrder.getOrder());
        }

        return kitchenMapper.toDto(kitchenOrder);
    }

    @Override
    public List<KitchenOrderDto> getActiveKitchenOrders() {
        List<KitchenOrder> activeOrders = new ArrayList<>();
        activeOrders.addAll(kitchenOrderRepository.findByStage(KitchenStage.TO_COOK));
        activeOrders.addAll(kitchenOrderRepository.findByStage(KitchenStage.PREPARING));
        activeOrders.addAll(kitchenOrderRepository.findByStage(KitchenStage.COMPLETED));
        
        return activeOrders.stream()
                .map(kitchenMapper::toDto)
                .collect(Collectors.toList());
    }
}
