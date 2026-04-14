package com.fullstackwebapp.Service;

import com.fullstackwebapp.DTO.*;
import com.fullstackwebapp.Model.Order;
import com.fullstackwebapp.Model.OrderItem;
import com.fullstackwebapp.Model.Product;
import com.fullstackwebapp.Repository.Orders;
import com.fullstackwebapp.Repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    Orders orders;
    ProductRepository repo;

    @Autowired
    public OrderService(Orders orders, ProductRepository repo) {
        this.orders = orders;
        this.repo = repo;
    }

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public OrderResponse placeOrders(OrderRequest orderRequest, OrderItemRequest orderItemRequest) {

        Order order = new Order();
        order.setOrderId("ORD"+UUID.randomUUID().toString().substring(0, 5));
        order.setCostumerName(orderRequest.CustomerName());
        order.setEmailId(orderRequest.emailId());
        order.setStatus(Status.ORDER_PLACED.name());
        order.setDate(LocalDate.now());

        List<OrderItem> orderItemList = new ArrayList<>();
        for(OrderItemRequest req : orderRequest.Items()){
            Product product1 = repo.findById(req.ProductId())
                    .orElseThrow(() -> new RuntimeException("Product Not Available"));
            product1.setProductQuantity(product1.getProductQuantity() - req.Quantity());
            repo.save(product1);
            notificationService.createNotification(
                    product1.getCreatedBy().getId(),
                    "New order received for product: " + product1.getProductName()
            );

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product1.getProductId());
            orderItem.setProduct(product1);
            orderItem.setQuantity(req.Quantity());
            orderItem.setTotalPrice(product1.getProductPrice().multiply(BigDecimal.valueOf(req.Quantity())));
            orderItemList.add(orderItem);
        }
        order.setItems(orderItemList);
        orders.save(order);
        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for (OrderItem orderItem : orderItemList) {
            OrderItemResponse orderItemResponse = new OrderItemResponse(
                    orderItem.getProduct().getProductName(),
                    orderItem.getQuantity(),
                    orderItem.getTotalPrice()
            );
            orderItemResponses.add(orderItemResponse);
        }

        OrderResponse response = new OrderResponse(
                order.getOrderId(),
                order.getCostumerName(),
                order.getEmailId(),
                order.getStatus(),
                order.getDate(),
                orderItemResponses);
        return response;
    }

    public List<OrderResponse> getAllOrders() throws Exception{

        Order order = new Order();
        List<OrderResponse> orderResponses = new ArrayList<>();

        for(Order order1 : orders.findAll()){
            List <OrderItemResponse> orderItemResponses = new ArrayList<>();
            for(OrderItem orderItem : order1.getItems()){
                OrderItemResponse orderItemResponse = new OrderItemResponse(
                        orderItem.getProduct().getProductName(),
                        orderItem.getQuantity(),
                        orderItem.getTotalPrice()
                );
                orderItemResponses.add(orderItemResponse);
            }

            OrderResponse orderResponse = new OrderResponse(
                    order1.getOrderId(),
                    order1.getCostumerName(),
                    order1.getEmailId(),
                    order1.getStatus(),
                    order1.getDate(),
                    orderItemResponses
            );

            orderResponses.add(orderResponse);
        }

        return orderResponses;
    }


}



