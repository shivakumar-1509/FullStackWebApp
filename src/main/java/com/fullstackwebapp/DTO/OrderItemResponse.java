package com.fullstackwebapp.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


public record OrderItemResponse(
       String ProductName,
       int Quantity,
       BigDecimal TotalPrice
) {
}
