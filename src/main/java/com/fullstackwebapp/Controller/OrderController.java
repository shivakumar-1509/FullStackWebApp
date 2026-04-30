package com.fullstackwebapp.Controller;

import com.fullstackwebapp.DTO.OrderItemRequest;
import com.fullstackwebapp.DTO.OrderRequest;
import com.fullstackwebapp.Model.Order;
import com.fullstackwebapp.Service.OrderService;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@Controller
public class OrderController {
    private  OrderService orderService;

    @Autowired
    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/placeOrder")
    public ResponseEntity<?> addOrder(OrderRequest orderRequest, OrderItemRequest orderItemRequest) {
        return new ResponseEntity<>(orderService.placeOrders(orderRequest,orderItemRequest), HttpStatus.OK);
    }

    @GetMapping("/Orders")
    public ResponseEntity<?> getOrders() throws Exception {
        return new ResponseEntity<>(orderService.getAllOrders(),HttpStatus.OK);
    }

}
