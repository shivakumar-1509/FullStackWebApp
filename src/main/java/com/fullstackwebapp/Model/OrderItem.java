package com.fullstackwebapp.Model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int  ProductId;

    @ManyToOne
    private Product Product;
    private int Quantity;
    private BigDecimal TotalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    private Order Order;

}
