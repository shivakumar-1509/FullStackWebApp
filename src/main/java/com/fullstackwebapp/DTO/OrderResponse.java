package com.fullstackwebapp.DTO;

import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        Long OrderId,
        String CostumerName,
        String EmailId,
        String Status,
        LocalDate Date,
        List<OrderItemRequest> OrderItemRequests

) {
}
