package com.fullstackwebapp.Repository;

import com.fullstackwebapp.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
   List<Product> findProductByCreatedBy_Id(Long userId);
}
