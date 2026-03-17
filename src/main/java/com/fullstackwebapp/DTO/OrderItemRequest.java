package com.fullstackwebapp.DTO;

import com.fullstackwebapp.Model.Product;

public record OrderItemRequest(
        int ProductId,
        int Quantity
) {
}
