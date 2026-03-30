package com.fullstackwebapp.DTO;

import com.fullstackwebapp.Model.Product;

public record OrderItemRequest(
        Long ProductId,
        int Quantity
) {
}
