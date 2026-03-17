package com.fullstackwebapp.DTO;

import java.util.List;

public record OrderRequest(
        String CustomerName ,
        String emailId,
        List<OrderItemRequest> Items
) {
}
