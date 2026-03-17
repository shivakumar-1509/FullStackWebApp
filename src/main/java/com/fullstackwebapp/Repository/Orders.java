package com.fullstackwebapp.Repository;

import com.fullstackwebapp.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Orders extends JpaRepository< Order,Integer> {

}
