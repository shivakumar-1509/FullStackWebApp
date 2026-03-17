package com.fullstackwebapp.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


public record OrderItemResponse(
       int ProductName,
       int Quantity,
       BigDecimal TotalPrice
) {
}
