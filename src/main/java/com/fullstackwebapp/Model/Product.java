package com.fullstackwebapp.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ProductId;

    private String ProductName;
    private BigDecimal ProductPrice;
    private Integer ProductQuantity;
    private String ProductCategory;
    private String ProductDescription;

    @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "dd-MM-yyyy")
    private Date ProductDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User CreatedBy;

    private String ImageName;
    private String ImageType;
    @Lob
    private byte[] ProductImage;


}
