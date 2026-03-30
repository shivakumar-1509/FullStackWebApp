package com.fullstackwebapp.DTO;

import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        String OrderId,
        String CostumerName,
        String EmailId,
        String Status,
        LocalDate Date,
        List<OrderItemResponse> OrderItemRequests
) {
}