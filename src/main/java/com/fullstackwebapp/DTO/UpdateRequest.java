package com.fullstackwebapp.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Data
public class UpdateRequest{
    private String ProductName;
    private BigDecimal ProductPrice;
    private int ProductQuantity;
    private String ProductCategory;
    private String ProductDescription;
}
