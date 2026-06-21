package com.ps2.service.impl;

import com.ps2.dto.OrderDto;
import com.ps2.dto.request.AddProductRequest;
import com.ps2.dto.request.CreateOrderRequest;
import com.ps2.entity.*;
import com.ps2.exception.BusinessException;
import com.ps2.exception.ResourceNotFoundException;
import com.ps2.mapper.OrderMapper;
import com.ps2.repository.*;
import com.ps2.service.OrderService;
import com.ps2.util.OrderNumberGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final OrderMapper orderMapper;
    private final OrderNumberGenerator orderNumberGenerator;

    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                            ProductRepository productRepository, CustomerRepository customerRepository,
                            RestaurantTableRepository tableRepository, UserRepository userRepository,
                            CouponRepository couponRepository, OrderMapper orderMapper,
                            OrderNumberGenerator orderNumberGenerator) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
        this.orderMapper = orderMapper;
        this.orderNumberGenerator = orderNumberGenerator;
    }

    @Override
    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setOrderNumber(orderNumberGenerator.generateOrderNumber());
        
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            order.setCustomer(customer);
        }

        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        order.setTable(table);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        order.setUser(user);

        order.setStatus(OrderStatus.DRAFT);
        order.setSubtotal(BigDecimal.ZERO);
        order.setTaxAmount(BigDecimal.ZERO);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(BigDecimal.ZERO);
        order.setOrderItems(new ArrayList<>());
        if (request.getOrderType() != null) {
            order.setOrderType(request.getOrderType());
        } else {
            order.setOrderType("OFFLINE");
        }

        order = orderRepository.save(order);

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (AddProductRequest itemReq : request.getItems()) {
                addProductToOrderInternal(order, itemReq);
            }
            recalculateOrderTotals(order);
        }

        return orderMapper.toDto(order);
    }

    @Override
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.toDto(order);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomer_CustomerId(customerId).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto addProductToOrder(Long orderId, AddProductRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new BusinessException("Cannot add products to an order that is not in DRAFT status");
        }

        addProductToOrderInternal(order, request);
        recalculateOrderTotals(order);

        return orderMapper.toDto(order);
    }

    private void addProductToOrderInternal(Order order, AddProductRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());
        item.setUnitPrice(product.getPrice());
        item.setDiscount(BigDecimal.ZERO);
        
        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        item.setTotal(total);

        order.getOrderItems().add(item);
        orderItemRepository.save(item);
    }

    @Override
    @Transactional
    public OrderDto updateProductQuantity(Long orderId, Long orderItemId, Integer quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new BusinessException("Cannot update products in an order that is not in DRAFT status");
        }

        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found"));

        if (!item.getOrder().getOrderId().equals(order.getOrderId())) {
            throw new BusinessException("OrderItem does not belong to this order");
        }

        item.setQuantity(quantity);
        item.setTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(quantity)).subtract(item.getDiscount()));
        orderItemRepository.save(item);

        recalculateOrderTotals(order);
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto removeProductFromOrder(Long orderId, Long orderItemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new BusinessException("Cannot remove products from an order that is not in DRAFT status");
        }

        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found"));

        order.getOrderItems().remove(item);
        orderItemRepository.delete(item);

        recalculateOrderTotals(order);
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto applyCoupon(Long orderId, String couponCode) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new BusinessException("Cannot apply coupon to an order that is not in DRAFT status");
        }

        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

        if (!coupon.getActive()) {
            throw new BusinessException("Coupon is not active");
        }

        order.setCoupon(coupon);
        recalculateOrderTotals(order);
        
        return orderMapper.toDto(order);
    }

    private void recalculateOrderTotals(Order order) {
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        for (OrderItem item : order.getOrderItems()) {
            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setTotal(itemTotal);
            subtotal = subtotal.add(itemTotal);

            if (item.getProduct().getTax() != null) {
                // Assuming tax is a percentage (e.g., 5.0 for 5%)
                BigDecimal itemTax = itemTotal.multiply(item.getProduct().getTax()).divide(BigDecimal.valueOf(100));
                taxAmount = taxAmount.add(itemTax);
            }
        }

        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (order.getCoupon() != null) {
            Coupon coupon = order.getCoupon();
            if (coupon.getDiscountType() == DiscountType.FIXED) {
                discountAmount = coupon.getDiscountValue();
            } else if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
                discountAmount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
            }
        }
        order.setDiscountAmount(discountAmount);

        BigDecimal total = subtotal.add(taxAmount).subtract(discountAmount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }
        order.setTotalAmount(total);

        orderRepository.save(order);
    }
}
