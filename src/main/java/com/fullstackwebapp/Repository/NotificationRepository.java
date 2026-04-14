package com.fullstackwebapp.Repository;

import com.fullstackwebapp.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    long countBySellerIdAndIsReadFalse(Long sellerId);
}
