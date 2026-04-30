package com.fullstackwebapp.Service;

import com.fullstackwebapp.Model.Notification;
import com.fullstackwebapp.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // 🔔 Create notification (used in OrderService)
    public void createNotification(Long sellerId, String message) {
        Notification notification = new Notification();
        notification.setSellerId(sellerId);
        notification.setMessage(message);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    // 📥 Get all notifications for a seller
    public List<Notification> getNotifications(Long sellerId) {
        return notificationRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
    }

    // 🔴 Get unread notification count
    public long getUnreadCount(Long sellerId) {
        return notificationRepository.countBySellerIdAndIsReadFalse(sellerId);
    }

    // ✔ Mark a single notification as read
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // ✔ Mark all notifications as read
    public void markAllAsRead(Long sellerId) {
        List<Notification> notifications =
                notificationRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }
}