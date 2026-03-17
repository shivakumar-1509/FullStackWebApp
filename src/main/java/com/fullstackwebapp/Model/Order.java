package com.fullstackwebapp.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(unique = true)
    Long orderId;
    String CostumerName;
    String EmailId;
    String Status;
    LocalDate Date;

    @OneToMany(cascade = CascadeType.ALL)
    List<OrderItem> Items;

}
