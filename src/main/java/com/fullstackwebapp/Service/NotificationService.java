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

    public void createNotification(Long sellerId, String message) {
        Notification notification = new Notification();
        notification.setSellerId(sellerId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<Notification> getSellerNotifications(Long sellerId) {
        return notificationRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
    }

    public long getUnreadCount(Long sellerId) {
        return notificationRepository.countBySellerIdAndIsReadFalse(sellerId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}
